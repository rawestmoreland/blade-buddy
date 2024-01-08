/** @type {import('tailwindcss').Config} */

import Colors from './constants/Colors';

module.exports = {
  content: ['./**.{html,js}'],
  theme: {
    extend: {
      colors: {
        lightBlue: Colors.brand.lightBlue,
        darkBlue: Colors.brand.darkBlue,
      },
    },
  },
  plugins: [],
};
