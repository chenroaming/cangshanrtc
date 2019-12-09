import Vue from 'vue'
import { makeHot, reload } from './utils/hot-reload'
import { router } from './router'
import store from './store'
import VueSweetalert2 from 'vue-sweetalert2'
import { formatDate } from './utils/date'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(VueSweetalert2)
Vue.use(ElementUI);
Vue.filter('formatDate', function (time) {
  let date = new Date(time)
  return formatDate(date, 'hh:mm:ss')
})
// tslint:disable-next-line:no-unused-expression
new Vue({
  el: '#app',
  router,
  store
})
