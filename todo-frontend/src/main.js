// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import vuetify from './plugins/vuetify'; // Import Vuetify plugin
import { loadFonts } from './plugins/webfontloader'; // Import the font loader

import './style.css'; // Optional: your styles

// Load custom fonts (optional)
loadFonts();

const app = createApp(App);

// Use the router and Vuetify plugins
app.use(router);
app.use(vuetify);

// Mount the app
app.mount('#app');