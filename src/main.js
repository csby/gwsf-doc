import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import ElementUI from 'element-ui'
import Network from '@/network/network'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(VueClipboard)
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.network = Network
Vue.prototype.msgbox = ElementUI.Message
Vue.prototype.uris = Network.uris

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
