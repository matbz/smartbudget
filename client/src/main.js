import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import VModal from 'vue-js-modal';
import VueNumeric from 'vue-numeric';
import Toasted from 'vue-toasted';
import App from './App';
import router from './router';
import store from './store';
import './common/filters';
import './assets/styles/element_overwrites.css';
import './assets/styles/circle.css';
import './assets/styles/main.css';

Vue.use(ElementUI, { locale, size: 'mini' });
Vue.use(VModal, { dialog: true });
Vue.use(VueNumeric);
Vue.use(Toasted, {
  theme: 'bubble',
  position: 'top-right',
  duration: 2300
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
