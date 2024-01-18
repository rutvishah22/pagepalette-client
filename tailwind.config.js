/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      // Define default styles for <ol>
      'ol': {
        listStyleType: 'decimal',
        paddingLeft: '1.5rem', // Adjust the left padding as needed
      },

      // Define default styles for <ul>
      'ul': {
        listStyleType: 'disc',
        paddingLeft: '1.5rem', // Adjust the left padding as needed
      },

      // Define default styles for <li>
      'li': {
        marginBottom: '0.5rem', // Adjust the margin between list items
      },
    },
  },
  plugins: [],
}

