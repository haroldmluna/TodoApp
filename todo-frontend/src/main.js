import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router

import './style.css'; // Optional: your styles

// Mount the app with the router
createApp(App).use(router).mount('#app');