
/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    fontFamily: {
      BubbleGumSans: ["BubblegumSans", "sans-serif"],
    },
    extend: {}
  },

  plugins: [require('daisyui')],

  daisyui: {
    themes: ["light", "dark", "retro"]
  }
};

module.exports = config;