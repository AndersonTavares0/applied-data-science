"""Text preparation for the review analysis.

The corpus is Portuguese and short. Normalisation is deliberately conservative:
it removes markup, links and punctuation but keeps accents, because ``nao`` and
``não`` are different strings and stemming without a Portuguese lemmatiser would
do more damage than good.
"""

from __future__ import annotations

import re

from sklearn.feature_extraction.text import CountVectorizer

# Function words plus the seller names that recur in this marketplace. The
# seller names are data artefacts, not complaint themes, so they are removed
# before the topic model sees them.
STOPWORDS = (  # noqa: SIM905 - a literal word list is more readable than 150 list items
    "a à às ao aos aquela aquelas aquele aqueles aquilo as até com como da das de"
    " dela delas dele deles depois do dos e é ela elas ele eles em entre era eram"
    " essa essas esse esses esta está estamos estão estas este estes eu foi fomos"
    " for foram há isso isto já lhe lhes mais mas me mesmo meu meus minha minhas"
    " muito muita muitos muitas na nas nem no nos nós nossa nossas nosso nossos"
    " num numa o os ou para pela pelas pelo pelos por qual quando que quem se sem"
    " seu seus sua suas só também te tem temos tenho tinha tu tua tuas tudo um uma"
    " umas uns você vocês vos pois porém pra pro nessa nesse nesta neste disso disto"
    " daquilo daquele daquela desses dessas deste desta sou somos são será serão"
    " seria seriam fui tive teve tiveram terá terão seja sejam"
    " lannister baratheon targaryen stark greyjoy arryn tully tyrell martell bolton"
).split()

TOKEN_PATTERN = r"(?u)\b[^\W\d_]{3,}\b"
MIN_TOKENS = 2


def normalize_text(text: object) -> str:
    """Lowercase, drop links/numbers/punctuation and collapse whitespace."""
    if text is None:
        return ""
    value = str(text).lower()
    value = re.sub(r"https?://\S+|www\.\S+", " ", value)
    value = re.sub(r"\d+", " ", value)
    value = re.sub(r"[^\w\s]", " ", value, flags=re.UNICODE)
    value = value.replace("_", " ")
    return re.sub(r"\s+", " ", value).strip()


def usable_text(text: object) -> bool:
    """Whether a comment has enough words to say anything about a topic."""
    return len(normalize_text(text).split()) >= MIN_TOKENS


def build_vectorizer(
    *,
    min_df: int = 20,
    max_df: float = 0.5,
    ngram_range: tuple[int, int] = (1, 2),
) -> CountVectorizer:
    """Count unigrams and bigrams after removing stopwords and short tokens."""
    return CountVectorizer(
        min_df=min_df,
        max_df=max_df,
        ngram_range=ngram_range,
        stop_words=list(STOPWORDS),
        token_pattern=TOKEN_PATTERN,
    )
