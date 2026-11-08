"""Shared figure language for the three project reports.

The site is one publication, not three notebooks. A reader should be able to
move from a retail chart to a model diagnostic without relearning the palette,
type hierarchy, or where the annotation lives. The functions here are
deliberately small: they set the frame and the reading order, and leave the
data marks to each chart.
"""

from __future__ import annotations

import matplotlib.pyplot as plt

PRIMARY = "#1f6fb2"
ACCENT = "#d97706"
MUTED = "#c4cdd5"
SOFT = "#5c6b7a"
INK = "#1f2933"
GRID = "#dbe3ea"


def apply_style() -> None:
    """Set the common Matplotlib defaults once per process."""
    plt.rcParams.update(
        {
            "figure.dpi": 110,
            "savefig.dpi": 160,
            "figure.facecolor": "white",
            "savefig.facecolor": "white",
            "font.family": "sans-serif",
            "font.sans-serif": ["Source Sans 3", "Segoe UI", "Arial", "DejaVu Sans"],
            "font.size": 10,
            "axes.titlesize": 13,
            "axes.titleweight": "semibold",
            "axes.titlelocation": "left",
            "axes.titlepad": 14,
            "axes.titlecolor": INK,
            "axes.labelsize": 9.5,
            "axes.labelcolor": SOFT,
            "text.color": INK,
            "xtick.color": SOFT,
            "ytick.color": SOFT,
            "xtick.labelsize": 8.8,
            "ytick.labelsize": 9,
            "axes.spines.top": False,
            "axes.spines.right": False,
            "axes.spines.left": False,
            "axes.edgecolor": MUTED,
            "axes.grid": True,
            "axes.axisbelow": True,
            "grid.color": GRID,
            "grid.alpha": 0.8,
            "grid.linewidth": 0.7,
            "figure.autolayout": False,
            # Currency labels contain "$"; do not let Matplotlib treat them as
            # mathtext delimiters.
            "text.parse_math": False,
        }
    )


def style_axes(ax, *, grid_axis: str = "y") -> None:
    """Remove chartjunk and put the grid behind the data."""
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_visible(False)
    ax.grid(axis=grid_axis, color=GRID, linewidth=0.7)
    ax.grid(axis="x" if grid_axis == "y" else "y", visible=False)
    ax.tick_params(length=0)


def add_title(ax, title: str, subtitle: str | None = None) -> None:
    """A left-aligned title with an optional explanatory deck."""
    ax.set_title(title, loc="left")
    if subtitle:
        ax.text(
            0,
            1.015,
            subtitle,
            transform=ax.transAxes,
            ha="left",
            va="bottom",
            fontsize=9,
            color=SOFT,
        )


def add_source(fig, text: str) -> None:
    """Put the source/definition note where a reader looks for it."""
    # Reserve a strip below the axes: a figure-level note does not participate
    # in constrained layout, so without this it collides with the x label.
    engine = fig.get_layout_engine()
    if engine is not None:
        engine.set(rect=(0, 0.08, 1, 1))
    fig.text(0.01, 0.008, text, ha="left", va="bottom", fontsize=7.5, color=SOFT)


def brl_thousands(value: float, _position: int | None = None) -> str:
    """Format R$ thousands as a compact, readable axis tick."""
    if value >= 1_000:
        return f"R$ {value / 1_000:.1f}m"
    return f"R$ {value:.0f}k"


def brl_millions(value: float, _position: int | None = None) -> str:
    """Format an absolute R$ value as millions for direct labels."""
    return f"R$ {value / 1_000_000:.2f}m"


def reference_line(ax, value: float, label: str, *, axis: str = "x") -> None:
    """A thin, labelled benchmark that does not compete with the data."""
    if axis == "x":
        ax.axvline(value, color=SOFT, linestyle=(0, (4, 3)), linewidth=1)
        ax.text(
            value,
            0.94,
            label,
            transform=ax.get_xaxis_transform(),
            ha="center",
            va="top",
            fontsize=7.8,
            color=SOFT,
            bbox={"facecolor": "white", "edgecolor": "none", "pad": 1.5},
        )
    else:
        ax.axhline(value, color=SOFT, linestyle=(0, (4, 3)), linewidth=1)
        ax.text(
            0.99,
            value,
            label,
            transform=ax.get_yaxis_transform(),
            ha="right",
            va="bottom",
            fontsize=7.8,
            color=SOFT,
        )
