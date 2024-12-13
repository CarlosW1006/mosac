import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

loadFonts();

const app = createApp(App);
// 關閉 Vue 的警告提示
app.config.warnHandler = () => null;

// 關閉 Vue 的全局錯誤提示
app.config.errorHandler = () => null;

// 禁用性能提示
app.config.performance = false;

app.use(router);
app.use(vuetify);
app.component('isLoading', Loading);
app.mount('#app');