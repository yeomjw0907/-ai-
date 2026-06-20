import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0B4DA2", strong: "#083B7D" },
        accent: "#FF4D6D",
        bg: "#F7F8FA",
        surface: "#FFFFFF",
        ink: { DEFAULT: "#1A1D21", muted: "#6B7280" },
        line: "#E5E7EB",
      },
      borderRadius: {
        card: "16px",
        ctl: "12px",
      },
      maxWidth: {
        app: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
