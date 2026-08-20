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
        ink: "#10243A",
        navy: "#143A56",
        teal: "#0F6C73",
        ocean: "#168A86",
        sand: "#F6F1E8",
        cream: "#FBF8F3",
        gold: "#D4A017",
        amber: "#E8B84A",
        coral: "#E07A5F",
        sky: "#4BA3C3",
        leaf: "#3D8B6E",
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "Tahoma", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -16px rgba(16, 36, 58, 0.25)",
        soft: "0 8px 24px -12px rgba(16, 36, 58, 0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
