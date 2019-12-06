export default {
    namespaced: true,

    state: {
        accountNames: ['Account 1'],
        selectedAccount: 0,
        selectedToken: 'VSYS',
        tokenRecords: []
    },

    mutations: {
        addAccount(state, account) {
            state.accountNames.push(account)
        },
        updateSelectedAccount(state, index) {
            state.selectedAccount = index
        },
        addToken(state, tokenInfo) {
            state.tokenRecords.push(tokenInfo)
        },
        removeToken(state, tokenId) {
            for(var i=0; i < state.tokenRecords.length; i++){
                if(state.tokenRecords[i].tokenId === tokenId){
                    state.tokenRecords.splice(i, 1)
                }
            }
        }
    }

}
