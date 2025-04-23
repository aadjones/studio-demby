/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.svg",
  ],
  theme: {
    extend: {
      typography: {
        quoteless: {
          css: {
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
          },
        },
      },
      keyframes: {
        'errant-flinch': {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '100%': {
            transform:
              'translate(var(--x, 0px), var(--y, 0px)) rotate(var(--r, 0deg))',
          },
          subtlePulse: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.98' }
          },
        },
        fadeSlideIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
      },
      animation: {
        'errant-flinch': 'errant-flinch 0.15s ease-out forwards',
        fadeSlideIn: "fadeSlideIn 0.4s ease-out forwards",
        subtlePulse: 'subtlePulse 6s ease-in-out infinite',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
