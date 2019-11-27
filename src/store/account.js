export default {
    namespaced: true,

    state: {
        accountNames: ['Account 1'],
        selectedAccount: 0
    },

    mutations: {
        updateAccountName(state, account) {
            state.accountNames.push(account)
        }
    }

}
