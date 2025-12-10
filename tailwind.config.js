/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
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
      // Vibrant, experimental color system
      colors: {
        // Primary brand colors - vibrant and playful
        brand: {
          coral: '#FF6B6B',      // Vibrant coral - primary accent
          teal: '#06B6D4',       // Bright teal - secondary
          violet: '#8B5CF6',     // Rich violet - tertiary
          amber: '#F59E0B',      // Warm amber - highlights
          rose: '#F43F5E',       // Bold rose - emphasis
        },
        // Atmospheric backgrounds - layered gradients
        atmosphere: {
          cream: '#FFF8F0',      // Warm cream base
          fog: '#F8FAFC',        // Cool fog
          blush: '#FFF1F2',      // Soft blush
          mint: '#F0FDFA',       // Fresh mint
          lavender: '#F5F3FF',   // Gentle lavender
        },
        // Surface colors - for cards and elevated elements
        surface: {
          100: '#FFFFFF',
          200: '#FAFAFA',
          300: '#F4F4F5',
          warm: '#FEF3C7',       // Warm highlight
          cool: '#DBEAFE',       // Cool highlight
        },
        // Text hierarchy
        ink: {
          900: '#1A1A1A',        // Primary text
          700: '#3D3D3D',        // Secondary text
          500: '#737373',        // Tertiary text
          300: '#A3A3A3',        // Muted text
        },
        // Keep legacy colors for compatibility
        space: {
          600: '#23263A',
          700: '#1A1D2E',
          800: '#151725',
          900: '#0F111D',
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
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
