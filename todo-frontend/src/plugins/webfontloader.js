// src/plugins/webfontloader.js
import WebFont from 'webfontloader';

export function loadFonts() {
  WebFont.load({
    google: {
      families: ['Roboto', 'Arial', 'sans-serif'], // Replace with the fonts you need
    },
  });
}