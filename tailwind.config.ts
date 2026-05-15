import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#1a1a2e",
          mid: "#16213e",
          accent: "#e94560",
        },
      },
    },
  },
  plugins: [],
};

export default config;
