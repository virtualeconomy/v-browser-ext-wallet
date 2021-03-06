import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import wallet from './wallet.js'
import account from './account.js'
import API from './API.js'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    modules: ['wallet', 'account']
})

export default new Vuex.Store({
    modules: {
        wallet,
        account,
        API
    },
    plugins: [vuexLocal.plugin]
})
