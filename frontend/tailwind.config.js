/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#020617",
        carbon: "#050816",
        emeraldGlow: "#00ff88",
        deepGreen: "#064e3b",
        panelGreen: "#052e2b",
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 255, 136, 0.18)",
        card: "0 24px 80px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
}
