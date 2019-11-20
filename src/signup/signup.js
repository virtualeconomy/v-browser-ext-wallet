import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import jdenticon from 'jdenticon'
import router from '../router/router'
Vue.use(BootstrapVue)
Vue.use(jdenticon)
new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
})
