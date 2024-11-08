import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

loadFonts();

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.component('isLoading', Loading);
app.mount('#app');