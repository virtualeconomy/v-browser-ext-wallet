import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import SignupEntry from '../signup/pages/SignupEntry.vue'
import Login from '../components/Login.vue'
import Signup from '../signup/pages/Signup.vue'
import CreateAccount from "src/signup/pages/CreateAccount.vue";

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [{
        path: '*',
        redirect: '/signupEntry'
    }, {
        path: '/home',
        name: 'Home',
        component: Home
    }, {
        path: '/login',
        name: 'login',
        component: Login
    }, {
        path: '/signup',
        name: 'signup',
        component: Signup
    }, {
        path: '/create',
        name: 'create',
        component: CreateAccount
    }, {
        path: '/signupEntry',
        name: 'signupentry',
        component: SignupEntry
    }
    ]
})
export default router
