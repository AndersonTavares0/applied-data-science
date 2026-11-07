"""Topic model helpers for the review corpus."""

from __future__ import annotations

from collections.abc import Sequence

import numpy as np
import pandas as pd
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer

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
