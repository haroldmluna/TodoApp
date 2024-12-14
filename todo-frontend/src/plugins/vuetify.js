// src/plugins/vuetify.js
import 'vuetify/styles'; // Import Vuetify styles
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi'; // Import Material Design Icons

// Define NYU Colors
const nyuColors = {
  darkViolet: '#57068c',
  lightViolet: '#6f259f',
  red: '#ea4335',
  darkRed: '#c32f28',
  green: '#34a853',
  darkGreen: '#2a8c45',
};

export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: nyuColors.darkViolet, // NYU Violet
          secondary: nyuColors.lightViolet, // Lighter Violet
          error: nyuColors.red,
          success: nyuColors.green,
          // Add more color mappings if needed
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});