import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import wallet from './wallet.js'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    modules: ['wallet']
})

export default new Vuex.Store({
    modules: {
        wallet
    },

    state: {
        loading: false
    },

    mutations: {
        loading(state, loading) {
            state.loading = loading
        }
    },

    plugins: [vuexLocal.plugin]
})
