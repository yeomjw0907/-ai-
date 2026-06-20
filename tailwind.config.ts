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
        "primary-foreground": "#FFFFFF",
        destructive: "#DC2626",
        "destructive-foreground": "#FFFFFF",
        secondary: "#EEF2F7",
        "secondary-foreground": "#1A1D21",
        accent: "#FF4D6D",
        "accent-foreground": "#FFFFFF",
        background: "#F7F8FA",
        foreground: "#1A1D21",
        popover: "#1A1D21",
        "popover-foreground": "#FFFFFF",
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#0B4DA2",
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
