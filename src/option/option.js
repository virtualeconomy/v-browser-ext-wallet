import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from '../router/router'
import store from '../store'
Vue.use(BootstrapVue)
router.push('/confirm')
new Vue({
    el: '#option',
    store,
    router: router,
    render: h => h(App)
})
