/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./public/**/*.svg"],
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
        },
      },
      animation: {
        'errant-flinch': 'errant-flinch 0.15s ease-out forwards',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
