/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.svg",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          600: '#23263A',
          700: '#1A1D2E',
          800: '#151725',
          900: '#0F111D',
        },
        accent: {
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
        },
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
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'marquee': 'marquee 20s linear infinite',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
