<template>
    <div class="home"
         @mousemove=resetSessionClearTimeout>
        <nav-bar v-show="showNav"
                 class="nav-bar"
                 :addresses="addresses"
                 :token-balances="tokenBalances"
                 :balances="balances"
                 :token-records="tokenRecords"
                 :selected-token="selectedToken"
                 :selected-account="selectedAccount"
                 @changePage="changePage"></nav-bar>
        <div v-if="page === 'home'"
             class="account-content">
            <div>
                <img class="token-icon"
                     :src="tokenSvg">
            </div>
            <div class="balance">
                <p class="token-balance">{{ accountBalance }}<span class="unity">{{ ' ' + tokenName }}</span> </p >
            </div>
            <div class="btn">
                <b-button class="btn-deposit"
                          @click="deposit">
                    <img class="icon-btn"
                         src="../../static/icons/ic_deposit@3x.png"><b class="deposit-txt">Deposit</b></b-button>
                <b-button class="btn-send"
                          @click="send">
                    <img class="icon-btn"
                         src="../../static/icons/ic_send@3x.png"><b class="send-txt">Send</b></b-button>
            </div>
            <transaction-records class="transaction-records"
                                 :network-byte="networkByte"
                                 :token-name="tokenName"
                                 :token-balances="tokenBalances"
                                 :token-records="tokenRecords"
                                 :address="address"></transaction-records>
        </div>
        <div v-else-if="page === 'addToken'">
            <add-token :token-records="tokenRecords"
                       @changePage="changePage"></add-token>
        </div>
        <div v-else-if="page === 'send'">
            <Send @changePage="changePage"
                  :address="address"
                  :account-name="accountNames[selectedAccount]"
                  :balances="balances"
                  :token-balances="tokenBalances"
                  :network-byte="networkByte"
                  :token-name="tokenName"
                  :selected-token="selectedToken"
                  :selected-account="selectedAccount"
                  @showNavBar="showNavBar"></Send>
        </div>
        <div v-else-if="page === 'deposit'">
            <Deposit :address="addresses[selectedAccount]"
                     @changePage="changePage"></Deposit>
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
        this.getTokenRecords()
        this.$store.commit('API/updateAPI', this.networkByte)
        this.getAddresses()
        this.getBalances()
        this.getTokenBalances()
        this.accountName = this.accountNames[this.selectedAccount]
    },
    data: function() {
        return {
            page: 'home',
            addresses: [],
            address: '',
            accountName: '',
            balances: {},
            tokenBalances: {},
            tokenRecords: {},
            sessionClearTimeout: void 0,
            showNav: true
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
            testnetTokenRecords: state => state.account.testnetTokenRecords,
            mainnetTokenRecords: state => state.account.mainnetTokenRecords,
            selectedToken: state => state.account.selectedToken,
            tokenRecords: state => state.account.tokenRecords
        }),
        secretInfo() {
            return JSON.parse(
                seedLib.decryptSeedPhrase(this.wallet.info, this.wallet.password))
        },
        tokenName() {
            if (this.selectedToken === 'VSYS') {
                return 'VSYS'
            } else {
                return this.tokenRecords[this.selectedToken]
            }
        },
        tokenSvg() {
            let name = this.tokenName
            if (name === 'VSYS'){
                return "../../static/icons/token/" + name + ".png"
            } else if (name === 'DLL' || name === 'DM' || name === 'IPX' || name === 'VTEST') {
                return "../../static/icons/token/" + name + ".svg"
            } else {
                return "../../static/icons/token/other.svg"
            }
        },
        accountBalance() {
            let amount = 0
            if (this.selectedToken === 'VSYS') {
                if (this.balances[this.address]) {
                    amount = String(this.balances[this.address])
                } else {
                    amount = '0'
                }
            } else {
                if (this.tokenBalances[this.selectedToken]) {
                    amount = String(this.tokenBalances[this.selectedToken].value)
                } else {
                    amount = '0'
                }
            }
            if (amount.length >= 14) {
                let index = amount.indexOf('.')
                amount = amount.slice(0, index + 3) + '...'
            }
            return amount
        }
    },
    watch: {
        walletAmount(now, old) {
            this.getAddresses()
            this.getBalances()
            this.getTokenBalances()
        },
        selectedAccount(now ,old) {
            this.address = this.addresses[this.selectedAccount]
            this.getBalances()
            this.getTokenBalances()
        },
        selectedToken(now, old) {
            this.getTokenBalances()
        },
        page(now, old) {
            if (now === 'home') {
                this.getBalances()
                this.getTokenBalances()
            }
        },
        networkByte(now, old) {
            this.getTokenRecords()
            this.$store.commit('API/updateAPI', this.networkByte)
            this.getAddresses()
            this.$store.commit('account/updateSelectedToken', 'VSYS')
            this.getBalances()
            this.accountName = this.accountNames[this.selectedAccount]
        }
    },
    mounted() {
        this.setSessionClearTimeout()
    },
    beforeDestroy() {
        clearTimeout(this.sessionClearTimeout)
    },
    methods: {
        getTokenRecords() {
            if (String.fromCharCode(this.networkByte) === 'T') {
                this.tokenRecords = this.testnetTokenRecords
            } else if (String.fromCharCode(this.networkByte) === 'M') {
                this.tokenRecords = this.mainnetTokenRecords
            } else {
                this.tokenRecords = {}
            }
        },
        setSessionClearTimeout() {
            let oldTimeout = 5
            try {
                const newTimeout = this.wallet.sessionTimeout
                oldTimeout = newTimeout || oldTimeout
            } catch (e) {
                oldTimeout = 5
            }
            this.sessionClearTimeout = setTimeout(() => {
                this.$store.commit('wallet/updatePassword', false)
                this.$router.push('/login')
            }, oldTimeout * 60 * 1000)
        },
        resetSessionClearTimeout() {
            clearTimeout(this.sessionClearTimeout)
            this.setSessionClearTimeout()
        },
        changePage(pageName) {
            this.page = pageName
        },
        showNavBar(temp) {
            this.showNav = temp
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
            this.address = this.addresses[this.selectedAccount]
        },
        getBalances() {
            for (const addr in this.addresses) {
                this.chain.getBalanceDetail(this.addresses[addr]).then(response => {
                    let value = BigNumber(response.available).dividedBy(VSYS_PRECISION).toString()
                    Vue.set(this.balances, this.addresses[addr], value)
                    }, respError => {
                        Vue.set(this.balances, this.addresses[addr], value)
                    })
                }
        },
        getTokenBalances() {
            for (let tokenId in this.tokenRecords) {
                this.chain.getTokenBalance(this.address, tokenId).then(response => {
                    let value = BigNumber(response.balance).dividedBy(response.unity)
                    Vue.set(this.tokenBalances, tokenId, { 'value': value, 'unity': response.unity })
                })
            }
        },
        send() {
            this.page = 'send'
        },
        deposit() {
            this.page = 'deposit'
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
    margin-bottom: 24px;
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
    height:85px;
}
.btn-deposit {
    display:inline-block;
    width:128px;
    height:40px;
    background:rgba(0,188,37,1);
    border: 1px solid rgba(0,188,37,1);
    border-radius:4px;
}
.btn-send {
    margin-left: 20px;
    width:128px;
    height:40px;
    background:rgba(246,0,46,1);
    border: 1px solid rgba(246,0,46,1);
    border-radius:4px;
}
.btn-send:active, .btn-send:hover{
    background-color: #E03146 !important;
    border: 1px solid #E03146 !important;
}
.btn-deposit:active, .btn-deposit:hover{
    background-color: #45b33f !important;
    border: 1px solid #45b33f !important;
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
