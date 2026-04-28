import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          400: "#66f2ff",
          500: "#2dd4ff",
          600: "#1fb6ff",
        },
      },
      boxShadow: {
        glow: "0 0 45px rgba(34, 211, 238, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
