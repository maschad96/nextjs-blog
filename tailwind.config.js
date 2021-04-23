const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    // listStyleType: {
    //   'disc': 'disc'
    // },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        'h2': {
          fontSize: theme('fontSize.3xl'),
          fontWeight: theme('fontWeight.bold'),
        },
        'h3': {
          fontSize: theme('fontSize.2xl'),
          fontWeight: theme('fontWeight.bold'),
        },
        'ul': {
          listStyleType: theme('listStyleType.disc'),
          paddingLeft: '1rem'
        },
        'ol': {
          listStyleType: theme('listStyleType.decimal'),
          paddingLeft: '1rem'
        },
        'blockquote': {
          marginLeft: '2rem'
        }
      })
    })
  ],
}
