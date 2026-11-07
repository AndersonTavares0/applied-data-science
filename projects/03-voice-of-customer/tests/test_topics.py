import numpy as np
from voice.topics import fit_topic_model, top_terms


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
