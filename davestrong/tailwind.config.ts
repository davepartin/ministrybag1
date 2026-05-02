import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#182026",
        ink: "#20242a",
        paper: "#f7f4ee",
        moss: "#2f6f5e",
        river: "#2f6f9f",
        ember: "#bd6b2d"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(24, 32, 38, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
