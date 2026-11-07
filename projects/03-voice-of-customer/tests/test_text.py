from voice.text import build_vectorizer, normalize_text, usable_text


def test_normalize_text_strips_markup_and_keeps_accents():
    raw = "  NÃO recebi o produto!!!\r\nhttps://example.com/ pedido 123_456  "
    assert normalize_text(raw) == "não recebi o produto pedido"


def test_normalize_text_handles_missing_values():
    assert normalize_text(None) == ""
    assert not usable_text("   ")


def test_vectorizer_drops_stopwords_and_keeps_bigrams():
    vectorizer = build_vectorizer(min_df=1, max_df=1.0)
    matrix = vectorizer.fit_transform(
        [
            "entrega atrasada produto nao chegou muito",
            "entrega atrasada ainda aguardando",
            "produto veio com defeito",
        ]
    )
    terms = set(vectorizer.get_feature_names_out())
    assert "entrega atrasada" in terms
    assert "muito" not in terms
    assert matrix.shape[0] == 3
