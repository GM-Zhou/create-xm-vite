import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { initRem } from './utils/flexible';
import { monitor } from './utils/xmly';

monitor(); // apm，魔镜
initRem();
const app = createApp(App);

app.use(router);
app.config.warnHandler = (msg) => {
  console.log('warn', msg);
};
app.config.errorHandler = (err) => {
  console.log('err', err);
};
app.mount('#app');
