/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
    "./public/**/*.svg",
  ],
  theme: {
    extend: {
      // Custom font families
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],
      },
      // Colors. The site shell (nav, footer, listings, project-page chrome, shared MDX
      // blocks) uses only the tokens in this first group; see "Design tokens" in CLAUDE.md.
      // Individual projects (museum, time-*, Married For, bird cards…) keep their own palettes.
      colors: {
        // Surfaces
        paper: '#F8F7F5',        // Page background (body in global.css); hero, sticky bars
        card: '#FFFFFF',         // Raised boxes only
        subtle: '#F5F5F5',       // Chips, tabs, metadata boxes
        cream: '#FFF8F0',        // The end-of-project call-to-action box: the shell's one warm surface
        line: '#E5E5E5',         // Hairline borders and dividers
        // Accent: underlines, selection, highlights. Never text: 2.4:1 on paper.
        coral: '#FF6B6B',
        // Messages and inline code
        error: '#F43F5E',        // Form errors
        code: {
          text: '#8B5CF6',       // Inline `code` in prose
          bg: '#FEF3C7',
        },
        // Text hierarchy
        ink: {
          900: '#1A1A1A',        // Primary text
          700: '#3D3D3D',        // Secondary text
          500: '#707070',        // Tertiary text. Lightest grey with 4.5:1 contrast on paper and neutral-100.
          300: '#A3A3A3',        // Muted text
        },
        // Museum of Dashes - Natural history museum aesthetic
        museum: {
          50: '#f9f8f6',         // Warm off-white background
          100: '#efedea',        // Light parchment
          200: '#dcd8d3',        // Border gray
          800: '#3d3a36',        // Dark warm gray
          900: '#262422',        // Nearly black brown
        },
        // Keep legacy colors for compatibility
        'time-surface': {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
        },
        'time-border': {
          300: '#CED4DA',
          400: '#ADB5BD',
        },
        'time-text': {
          600: '#495057',
          700: '#343A40',
          800: '#212529',
        },
      },
      typography: {
        quoteless: {
          css: {
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
          },
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'errant-flinch': {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '100%': {
            transform:
              'translate(var(--x, 0px), var(--y, 0px)) rotate(var(--r, 0deg))',
          },
        },
        'subtlePulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.98' }
        },
        'fadeSlideIn': {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gentle-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'card-peek': {
          '0%':   { transform: 'rotateY(0deg)' },
          '35%':  { transform: 'rotateY(22deg)' },
          '65%':  { transform: 'rotateY(22deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
      },
      animation: {
        'errant-flinch': 'errant-flinch 0.15s ease-out forwards',
        'fadeSlideIn': 'fadeSlideIn 0.4s ease-out forwards',
        'subtlePulse': 'subtlePulse 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in-scale': 'fade-in-scale 0.5s ease-out',
        'marquee': 'marquee 20s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'gentle-float': 'gentle-float 3s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'card-peek': 'card-peek 1.2s ease-in-out forwards',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
