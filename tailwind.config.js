/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F6E3A',
        secondary: '#D4AF37',
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        body: '#64748B',
      },
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      fontWeight: {
        'heading-light': '300',
        'heading-regular': '400',
        'heading-medium': '500',
        'heading-semibold': '600',
        'heading-bold': '700',
      },
    },
  },
  plugins: [],
}
