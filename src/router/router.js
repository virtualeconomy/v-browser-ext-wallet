import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import SignupEntry from '../signup/pages/SignupEntry.vue'
import Login from '../components/Login.vue'
import ImportAccount from '../signup/pages/ImportAccount.vue'
import CreateAccount from "src/signup/pages/CreateAccount.vue";
import Terms from '../signup/pages/Terms.vue'
import TokenSelect from '../components/TokenSelect.vue'
import AddToken from '../components/AddToken.vue'
Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [{
        path: '*',
        redirect: '/home'
    }, {
        path: '/home',
        name: 'Home',
        component: Home
    }, {
        path: '/login',
        name: 'login',
        component: Login
    }, {
        path: '/import',
        name: 'import',
        component: ImportAccount
    }, {
        path: '/create',
        name: 'create',
        component: CreateAccount
    }, {
        path: '/signupEntry',
        name: 'signupentry',
        component: SignupEntry
    }, {
        path: '/terms',
        name: 'terms',
        component: Terms
    }, {
        path: '/tokenSelect',
        name: 'tokenSelect',
        component: TokenSelect
    }, {
        path: '/addToken',
        name: 'addToken',
        component: AddToken
    }
    ]
})
export default router
