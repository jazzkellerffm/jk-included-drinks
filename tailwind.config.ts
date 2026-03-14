import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jazz: {
          black: "#0a0a0b",
          charcoal: "#141416",
          smoke: "#1c1c1f",
          gold: "#c9a227",
          "gold-dim": "#9a7b1a",
          cream: "#f5f0e6",
          "cream-dim": "#b8b0a0",
        },
      },
      fontFamily: {
        ace: ["var(--font-ace)"],
        "polysans-neutral": ["var(--font-polysans-neutral)"],
        "polysans-bulky": ["var(--font-polysans-bulky)"],
        display: ["var(--font-ace)"],
        sans: ["var(--font-polysans-neutral)"],
      },
      minHeight: {
        touch: "3.5rem",
        "touch-lg": "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
