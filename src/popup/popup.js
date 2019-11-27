import Vue from 'vue'
import App from './App.vue'
import router from '../router/router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import jdenticon from 'jdenticon'
import Storage from "vue-ls";
import store from '../store'
const options = {
    namespace: 'vuejs__',
    name: 'ls',
    storage: 'memory'
}
Vue.use(BootstrapVue)
Vue.use(jdenticon)
Vue.use(Storage, options)
if (store.state.wallet.info === false) {
    chrome.runtime.sendMessage({
        method: 'showAlert'
    }, function(response) {});
}
new Vue({
    el: '#popup',
    store,
    router: router,
    render: h => h(App)
})
