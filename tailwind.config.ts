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
        brand: {
          50: "#f4f3fb",
          100: "#eae6f7",
          200: "#d7d0f0",
          300: "#b9ace4",
          400: "#9681d4",
          500: "#795ec4",
          600: "#5B4FA8", // IDI Royal Purple signature
          700: "#524497",
          800: "#44397e",
          900: "#383166",
        },
        medical: {
          teal: "#0D9488",
          cyan: "#0284C7",
          sky: "#0EA5E9",
          soft: "#EAF2F8",
          bg: "#E8EEF7",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.12)",
        "glass-lg": "0 12px 40px 0 rgba(31, 38, 135, 0.18)",
        card: "0 10px 30px -5px rgba(91, 79, 168, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
