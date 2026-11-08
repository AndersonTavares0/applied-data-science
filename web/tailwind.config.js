/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        muted: 'var(--muted)',
        rule: 'var(--rule)',
        brand: 'var(--brand)',
        'brand-strong': 'var(--brand-strong)',
        accent: 'var(--accent)',
        late: 'var(--late)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        display: ['Source Serif 4 Variable', 'Source Serif 4', 'Georgia', 'serif'],
        sans: ['Source Sans 3 Variable', 'Source Sans 3', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        site: '75rem',
        prose: '70ch',
      },
      boxShadow: {
        plate: '0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px -16px rgb(15 23 42 / 0.18)',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
