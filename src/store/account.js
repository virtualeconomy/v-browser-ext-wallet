export default {
    namespaced: true,

    state: {
        accountNames: ['Account 1'],
        selectedAccount: 0,
        selectedToken: 'VSYS'
    },

    mutations: {
        addAccount(state, account) {
            state.accountNames.push(account)
        },
        updateSelectedAccount(state, index) {
            state.selectedAccount = index
        }
    }

}
