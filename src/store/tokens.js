export default {
    namespaced: true,
    state: {
        tokens: []
    },
    mutations: {
        addToken(state, token) {
            state.tokens.push(token)
        }
    }
}
