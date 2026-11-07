import numpy as np
from voice.topics import (
    coherence_by_topic_count,
    fit_topic_model,
    soft_assignment_summary,
    top_terms,
    topic_stability,
    umass_coherence,
)


def _corpus() -> list[str]:
    delivery = [
        "entrega atrasada pedido nao chegou ainda aguardando produto",
        "produto nao chegou entrega atrasada correios demora",
        "ainda aguardando pedido atrasado nao recebi nada",
        "entrega demorou dias pedido nao chegou correios",
    ]
    quality = [
        "produto veio defeito qualidade pessima diferente foto",
        "veio errado produto quebrado qualidade ruim",
        "produto diferente anuncio defeito pessima qualidade",
        "veio com defeito produto errado qualidade pessima",
    ]
    return delivery * 30 + quality * 30


def test_topics_separate_delivery_from_quality_complaints():
    vectorizer, model, weights = fit_topic_model(_corpus(), n_topics=2, seed=0, max_iter=50)
    terms = top_terms(vectorizer, model, n=8)
    joined = [" ".join(topic) for topic in terms]
    assert any("entrega" in topic or "chegou" in topic for topic in joined)
    assert any("defeito" in topic or "qualidade" in topic for topic in joined)

    assigned = weights.argmax(axis=1)
    expected = np.array([0] * 120 + [1] * 120)
    agreement = max((assigned == expected).mean(), (assigned != expected).mean())
    assert agreement > 0.8
    assert assigned[:120].mean() != assigned[120:].mean()


def test_coherence_returns_one_score_per_topic():
    texts = _corpus()
    vectorizer, model, _ = fit_topic_model(texts, n_topics=2, seed=0, max_iter=20)
    scores = umass_coherence(vectorizer, model, texts)
    assert len(scores) == 2
    assert all(value < 0 for value in scores)


def test_coherence_by_topic_count_has_one_row_per_candidate():
    table = coherence_by_topic_count(_corpus(), topic_counts=(2, 3), seeds=(0, 1), max_iter=10)
    assert list(table.columns) == [
        "topics",
        "seed0_coherence",
        "mean_coherence",
        "sd_coherence",
        "perplexity",
    ]
    assert table["topics"].tolist() == [2, 3]
    assert table["sd_coherence"].ge(0).all()
    assert table["perplexity"].gt(0).all()


def test_identical_seed_is_perfectly_stable():
    stability = topic_stability(_corpus(), n_topics=2, seeds=(0, 0), max_iter=20)
    assert stability["mean_adjusted_rand"] == 1.0
    assert stability["mean_jaccard"] == 1.0


def test_soft_assignment_distinguishes_certain_from_uniform_documents():
    certain = soft_assignment_summary(np.array([[1.0, 0.0], [0.0, 1.0]]))
    uniform = soft_assignment_summary(np.array([[0.5, 0.5], [0.5, 0.5]]))
    assert certain["share_max_below_0_5_pct"] == 0.0
    assert uniform["share_second_at_least_0_25_pct"] == 100.0
    assert uniform["mean_normalized_entropy"] > certain["mean_normalized_entropy"]
