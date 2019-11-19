import Vue from 'vue'
import SignupEntry from './SignupEntry.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import jdenticon from 'jdenticon'
Vue.use(BootstrapVue)
Vue.use(jdenticon)
new Vue({
    el: '#signup',
    render: h => h(SignupEntry)
})
