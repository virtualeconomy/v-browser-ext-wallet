export default {
    namespaced: true,

    state: {
        accountNames: ['Account 1'],
        selectedAccount: 0,
        selectedToken: 'TWuyTczrVc4KeDUBpksxY8bpcogKfKqoVGE7cwcs3',
        tokenRecords: {}
    },

    mutations: {
        addAccount(state, account) {
            state.accountNames.push(account)
        },
        updateSelectedAccount(state, index) {
            state.selectedAccount = index
        },
        addToken(state, tokenRecordsInfo) {
            state.tokenRecords = tokenRecordsInfo
        },
        updateSelectedToken(state, tokenId) {
            state.selectedToken = tokenId
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
