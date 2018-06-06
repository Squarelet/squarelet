import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/de'
import VueSocketio from 'vue-socket.io'

Vue.use(Element, {locale})
// Vue.use(VueSocketio, 'http://localhost:3001', store);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
