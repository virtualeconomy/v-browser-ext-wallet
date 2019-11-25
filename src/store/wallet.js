export default {
    namespaced: true,

    state: {
        localWallet: ''
    },
    mutations: {
        updateWallet(state, object) {
            state.localWallet = object
        }
    }

}
