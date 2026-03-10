/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Define theme-aware colors
        background: { light: '#ffffff', dark: '#27272a' },
        foreground: { light: '#09090b', dark: '#fafafa' },
      },
    },
  },
  plugins: [],
};
