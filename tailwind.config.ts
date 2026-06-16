import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1C1F3A',
          dark: '#13162B',
          light: '#252850',
          border: '#2E3260',
        },
        purple: {
          DEFAULT: '#7C3AED',
          dark: '#5B21B6',
          light: '#A78BFA',
          xlight: '#EDE9FE',
        },
        green: {
          DEFAULT: '#10B981',
        },
        amber: {
          DEFAULT: '#F59E0B',
        },
        red: {
          DEFAULT: '#EF4444',
        },
        blue: {
          DEFAULT: '#3B82F6',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
