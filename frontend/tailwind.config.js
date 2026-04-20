/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        mocha: {
          50: '#f8f4f1',
          100: '#eee5df',
          200: '#e0ccc1',
          300: '#cca999',
          400: '#b48570',
          500: '#a66e51',
          600: '#8d573f',
          700: '#754533',
          800: '#623a2e',
          900: '#53332a',
          DEFAULT: '#A68A78', // Mocha Mousse
        },
        ethereal: {
          50: '#f2f7fb',
          100: '#e2eef6',
          200: '#cce3f0',
          300: '#a9cfe4',
          400: '#7eb3d3',
          500: '#5e96be',
          600: '#4a7a9f',
          700: '#3e6281',
          800: '#36536b',
          900: '#31465a',
          DEFAULT: '#A7C7E7', // Ethereal Blue
        },
        moonlight: {
          50: '#f6f7f8',
          100: '#eceef1',
          200: '#d5dae0',
          300: '#b0b9c3',
          400: '#8491a1',
          500: '#647284',
          600: '#505b6b',
          700: '#414957',
          800: '#363d47',
          900: '#1a1d23', // Moonlight Gray (Darkest)
          DEFAULT: '#2C2F33', 
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(167, 199, 231, 0)' },
          '50%': { boxShadow: '0 0 20px rgba(167, 199, 231, 0.3)' },
        },
      },
    },
  },
  plugins: [],
};
