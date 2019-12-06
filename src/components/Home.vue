<template>
    <div class="home">
        <nav-bar class="nav-bar"
                 :addresses="addresses"
                 :account-names="accountNames"
                 :balances="balances"
                 :token-name="tokenName"
                 :selected-account="selectedAccount"
                 @addTokenSig="getPageSignal"></nav-bar>
        <div v-if="page === 'home'"
             class="account-content">
            <div>
                <img class="token-icon"
                src="../../static/icons/ic_v_logo@3x.png">
            </div>
            <div class="balance">
                <p class="token-balance">{{ showBalance(balances[address]) }}<span class="unity">{{ ' ' + tokenName }}</span> </p >
            </div>
            <div class="btn">
                <b-button class="btn-deposit" @click="showMessage">
                    <img class="icon-btn"
                         src="../../static/icons/ic_deposit@3x.png"><b class="deposit-txt">Deposit</b></b-button>
                <b-button class="btn-send" @click="send">
                    <img class="icon-btn"
                         src="../../static/icons/ic_send@3x.png"><b class="send-txt">Send</b></b-button>
            </div>
            <transaction-records class="transaction-records"
                                 :network-byte="networkByte"
                                 :token-name="tokenName"
                                 :address="address"></transaction-records>
        </div>
        <div v-else-if="page === 'addToken'">
            <add-token @addTokenSig="getPageSignal"></add-token>
        </div>
    </div>
</template>

<script>
    import NavBar from './NavBar.vue'
    import Send from './Send.vue'
    import Deposit from './Deposit.vue'
    import TransactionRecords from './TransactionRecords.vue'
    import { mapState } from 'vuex'
    import { VSYS_PRECISION } from '../js-v-sdk/src/constants'
    import Vue from 'vue'
    import seedLib from '../libs/seed.js'
    import BigNumber from 'bignumber.js'
    import AddToken from './AddToken.vue'

    export default {
        name: "Home",
        components: {
            NavBar,
            Send,
            Deposit,
            TransactionRecords,
            AddToken
        },
        created() {
            if (this.wallet.password === false) {
                this.$router.push('/login')
            }
            this.$store.commit('API/updateChain', this.networkByte)
            this.getAddresses()
            this.getBalances()
            this.address = this.addresses[this.selectedAccount]
            this.accountName = this.accountNames[this.selectedAccount]
        },
        data: function() {
            return {
                page: 'home',
                addresses: [],
                address: '',
                accountName: '',
                balances: {}
            }
        },
        computed: {
            ...mapState({
                networkByte: state => state.wallet.networkByte,
                chain: state => state.API.chain,
                wallet: state => state.wallet,
                selectedAccount: state => state.account.selectedAccount,
                accountNames: state => state.account.accountNames,
                walletAmount: state => state.wallet.walletAmount,
                selectedToken: state => state.account.selectedToken
            }),
            secretInfo() {
                return JSON.parse(
                    seedLib.decryptSeedPhrase(this.wallet.info, this.wallet.password))
            },
            tokenName() {
                if (this.selectedToken === 'VSYS') {
                    return 'VSYS'
                }
            }
        },
        watch: {
            walletAmount(now, old) {
                this.getAddresses()
            }
        },
        methods: {
            send() {
                this.page = 'send'
            },
            getSeedPhrase() {
                if (this.secretInfo) {
                    return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, this.wallet.password)
                }
            },
            getAddresses() {
                let seedPhrase = this.getSeedPhrase()
                for (let index = 0; index < this.walletAmount; index++) {
                    let seed = seedLib.fromExistingPhrasesWithIndex(seedPhrase, index, this.networkByte)
                    Vue.set(this.addresses, index, seed.address)
                }
            },
            getBalances() {
                if (this.selectedToken === 'VSYS') {
                    for (const addr in this.addresses) {
                        this.chain.getBalanceDetail(this.addresses[addr]).then(response => {
                            let value = BigNumber(response.available).dividedBy(VSYS_PRECISION).toString()
                            Vue.set(this.balances, this.addresses[addr], value)
                        }, respError => {
                            Vue.set(this.balances, this.addresses[addr], value)
                        })
                    }
                }

            },
            showBalance(balance) {
                let amount = String(balance)
                if (amount.length >= 14) {
                    let index = amount.indexOf('.')
                    amount = amount.slice(0, index + 3) + '...'
                }
                return amount
            },
            showMessage() {
                console.log(this.getSeedPhrase())
                console.log(this.addresses)
                console.log(this.selectedToken)
                console.log(this.balances)
            },
            getPageSignal(data) {
                this.page = data
            }
        }
    }
</script>

<style scoped>
    .home {
        height: 100%;
        width:360px;
        background:rgba(247,247,252,1);
        color:#F7F7FC;
    }
    .nav-bar {
        height: 60px;
        width: 100%;
        z-index:1000;
    }
    .account-content {
        height: 237px;
        width: 100%;
    }
    .token-icon {
        width: 56px;
        height: 56px;
        margin-left:152px;
        margin-top:32px;
    }
    .balance {
        margin-top: 20px;
        width: 100%;
        height: 33px;
        text-align: center;
    }
    .token-balance {
        font-size:28px;
        font-family:Roboto-Regular,Roboto;
        font-weight:400;
        color:rgba(50,50,51,1);
        line-height:33px;
    }
    .unity {
        font-size:16px;
        font-family:Roboto-Regular,Roboto;
        font-weight:400;
        color:rgba(50,50,51,1);
        line-height:19px;
    }
    .btn {
        width:100%;
        height:96px;
    }
    .btn-deposit {
        margin-top: 24px;
        display:inline-block;
        width:128px;
        height:40px;
        background:rgba(0,188,37,1);
        border-radius:4px;
    }
    .btn-send {
        margin-top: 24px;
        margin-left: 20px;
        width:128px;
        height:40px;
        background:rgba(246,0,46,1);
        border-radius:4px;
    }
    .icon-btn {
        width:16px;
        height:16px;
    }
    .deposit-txt {
        width:59px;
        height:19px;
        font-size:16px;
        font-family:SFProText-Regular,SFProText;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:19px;
        margin-left:8px;
    }
    .send-txt {
        width:39px;
        height:19px;
        font-size:16px;
        font-family:SFProText-Regular,SFProText;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:19px;
        margin-left:8px;
    }
    .transaction-records {
        height: 263px;
        width: 328px;
        z-index:1000;
        margin-left:16px;
    }
</style>
