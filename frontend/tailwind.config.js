/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layout/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#050505',
        'cyber-green': '#00ff41',
        'cyber-pink': '#ff00ff',
        'cyber-purple': '#bc13fe',
        'cyber-cyan': '#00ffff',
        'cyber-yellow': '#ffff00',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      backgroundImage: {
        'cyber-gradient': "radial-gradient(circle at 20% 30%, rgba(188, 19, 254, 0.1) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255, 0, 255, 0.1) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(0, 255, 65, 0.05) 0%, transparent 50%)",
      },
      animation: {
        'scanline': 'scanline 10s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(500%)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
