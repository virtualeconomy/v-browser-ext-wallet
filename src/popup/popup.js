import Vue from 'vue'
import App from './App.vue'
import router from '../router/router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import jdenticon from 'jdenticon'
Vue.use(BootstrapVue)
Vue.use(jdenticon)
chrome.runtime.sendMessage({
    method: 'showAlert'
}, function(response) {});
new Vue({
    el: '#popup',
    router: router,
    render: h => h(App)
})
