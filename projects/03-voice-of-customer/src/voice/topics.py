"""Topic model helpers for the review corpus."""

from __future__ import annotations

from collections.abc import Sequence

import numpy as np
import pandas as pd
from scipy.optimize import linear_sum_assignment
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics import adjusted_rand_score

from voice.text import build_vectorizer


def fit_topic_model(
    texts: Sequence[str],
    *,
    n_topics: int = 8,
    seed: int = 0,
    max_iter: int = 30,
) -> tuple[CountVectorizer, LatentDirichletAllocation, np.ndarray]:
    """Fit LDA on a count matrix and return the vectoriser, model and weights.

    LDA is fitted on the complaint text alone. The delivery outcome is joined
    afterwards, so the topics cannot be shaped to separate late from on-time
    orders.
    """
    vectorizer = build_vectorizer()
    matrix = vectorizer.fit_transform(texts)
    model = LatentDirichletAllocation(
        n_components=n_topics,
        random_state=seed,
        learning_method="batch",
        max_iter=max_iter,
    )
    weights = model.fit_transform(matrix)
    return vectorizer, model, weights


def top_terms(
    vectorizer: CountVectorizer, model: LatentDirichletAllocation, n: int = 10
) -> list[list[str]]:
    """Return the highest-weight terms for each topic."""
    terms = vectorizer.get_feature_names_out()
    return [
        [str(term) for term in terms[component.argsort()[-n:][::-1]]]
        for component in model.components_
    ]


def topic_terms_frame(
    vectorizer: CountVectorizer,
    model: LatentDirichletAllocation,
    labels: Sequence[str],
    n: int = 10,
) -> pd.DataFrame:
    """Long-form table of topic labels, ranks and terms."""
    rows = []
    for topic, (label, terms) in enumerate(
        zip(labels, top_terms(vectorizer, model, n), strict=True)
    ):
        rows.extend(
            {"topic": topic, "label": label, "rank": rank, "term": term}
            for rank, term in enumerate(terms, start=1)
        )
    return pd.DataFrame(rows)


def umass_coherence(
    vectorizer: CountVectorizer,
    model: LatentDirichletAllocation,
    texts: Sequence[str],
    *,
    n_terms: int = 10,
) -> list[float]:
    """UMass topic coherence from document co-occurrence counts.

    Coherence asks whether the top terms of a topic appear together in the
    corpus. It is a better guide to the number of topics than perplexity, which
    mostly rewards putting probability mass on frequent words.
    """
    matrix = vectorizer.transform(texts)
    binary = matrix.copy()
    binary.data[:] = 1
    document_frequency = np.asarray(binary.sum(axis=0)).ravel()
    scores = []
    for component in model.components_:
        indices = component.argsort()[-n_terms:][::-1]
        total = 0.0
        pairs = 0
        for position, left in enumerate(indices):
            for right in indices[position + 1 :]:
                co_documents = float(binary[:, left].multiply(binary[:, right]).sum())
                total += np.log((co_documents + 1.0) / max(document_frequency[left], 1))
                pairs += 1
        scores.append(float(total / pairs) if pairs else 0.0)
    return scores


def coherence_by_topic_count(
    texts: Sequence[str],
    *,
    topic_counts: Sequence[int] = (4, 5, 6, 7, 8, 9, 10),
    seeds: Sequence[int] = (0, 1, 2),
    max_iter: int = 30,
    n_terms: int = 10,
) -> pd.DataFrame:
    """Fit each candidate k across seeds and report coherence and perplexity.

    A single seed can make one k look best by initialisation luck. Repeating the
    fit and reporting the spread keeps k selection from being an artefact of the
    seed. The model is fitted on complaint text only, so the outcome cannot
    influence which k looks best.
    """
    rows = []
    for n_topics in topic_counts:
        scores = []
        perplexities = []
        for seed in seeds:
            vectorizer, model, _ = fit_topic_model(
                texts, n_topics=n_topics, seed=seed, max_iter=max_iter
            )
            coherence = umass_coherence(vectorizer, model, texts, n_terms=n_terms)
            scores.append(float(np.mean(coherence)))
            perplexities.append(float(model.perplexity(vectorizer.transform(texts))))
        rows.append(
            {
                "topics": n_topics,
                "seed0_coherence": scores[0],
                "mean_coherence": float(np.mean(scores)),
                "sd_coherence": float(np.std(scores, ddof=1)) if len(scores) > 1 else 0.0,
                "perplexity": float(np.mean(perplexities)),
            }
        )
    return pd.DataFrame(rows)


def _jaccard_matrix(reference: Sequence[set[str]], candidate: Sequence[set[str]]) -> np.ndarray:
    """Jaccard overlap of every reference topic with every candidate topic."""
    return np.array(
        [
            [len(left & right) / len(left | right) if left | right else 0.0 for right in candidate]
            for left in reference
        ]
    )


def topic_stability(
    texts: Sequence[str],
    *,
    n_topics: int = 6,
    seeds: Sequence[int] = (0, 1, 2, 3, 4),
    top_n: int = 10,
    max_iter: int = 30,
) -> dict:
    """Refit with different seeds and compare topic assignments and vocabularies.

    Seeds are not a substitute for resampling documents, but they show whether
    the learned topics are an artefact of one initialisation. ARI measures whole
    partition agreement; Jaccard measures whether the top terms survive.
    """
    vectorizer, model, weights = fit_topic_model(
        texts, n_topics=n_topics, seed=seeds[0], max_iter=max_iter
    )
    reference_terms = [set(terms) for terms in top_terms(vectorizer, model, top_n)]
    reference_assignment = weights.argmax(axis=1)
    rows = []
    aligned_jaccards = []
    for seed in seeds[1:]:
        candidate_vectorizer, candidate_model, candidate_weights = fit_topic_model(
            texts, n_topics=n_topics, seed=seed, max_iter=max_iter
        )
        candidate_terms = [
            set(terms) for terms in top_terms(candidate_vectorizer, candidate_model, top_n)
        ]
        similarity = _jaccard_matrix(reference_terms, candidate_terms)
        row_indices, column_indices = linear_sum_assignment(-similarity)
        jaccards = similarity[row_indices, column_indices]
        aligned_jaccards.append(jaccards)
        rows.append(
            {
                "seed": seed,
                "mean_jaccard": float(jaccards.mean()),
                "adjusted_rand": float(
                    adjusted_rand_score(reference_assignment, candidate_weights.argmax(axis=1))
                ),
            }
        )
    stacked = np.vstack(aligned_jaccards)
    return {
        "reference_seed": int(seeds[0]),
        "seeds": [int(seed) for seed in seeds[1:]],
        "mean_jaccard": float(stacked.mean()),
        "min_jaccard": float(stacked.min()),
        "max_jaccard": float(stacked.max()),
        "mean_adjusted_rand": float(np.mean([row["adjusted_rand"] for row in rows])),
        "min_adjusted_rand": float(np.min([row["adjusted_rand"] for row in rows])),
        "max_adjusted_rand": float(np.max([row["adjusted_rand"] for row in rows])),
        "per_topic_jaccard": [float(value) for value in stacked.mean(axis=0)],
        "by_seed": rows,
    }


def soft_assignment_summary(weights: np.ndarray) -> dict:
    """How mixed are documents across topics when assignment is hard?

    A high share of documents whose largest weight is below 0.5 is a warning
    that the topic labels describe a dominant theme, not a clean partition.
    """
    ordered = np.sort(weights, axis=1)
    largest = ordered[:, -1]
    second = ordered[:, -2]
    clipped = np.clip(weights, 1e-12, None)
    entropy = -(clipped * np.log(clipped)).sum(axis=1) / np.log(weights.shape[1])
    return {
        "max_weight_quantiles": {
            "p10": float(np.quantile(largest, 0.10)),
            "p25": float(np.quantile(largest, 0.25)),
            "p50": float(np.quantile(largest, 0.50)),
            "p75": float(np.quantile(largest, 0.75)),
            "p90": float(np.quantile(largest, 0.90)),
        },
        "share_max_below_0_5_pct": float(100 * (largest < 0.5).mean()),
        "share_max_below_0_4_pct": float(100 * (largest < 0.4).mean()),
        "share_second_at_least_0_3_pct": float(100 * (second >= 0.3).mean()),
        "share_second_at_least_0_25_pct": float(100 * (second >= 0.25).mean()),
        "mean_normalized_entropy": float(entropy.mean()),
    }
