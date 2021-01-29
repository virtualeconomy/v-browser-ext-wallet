<template>
    <div class="home"
         @mousemove=resetSessionClearTimeout>
        <nav-bar v-if="showNav"
                 class="nav-bar"
                 :addresses="addresses"
                 :vsys-balance="vsysBalance"
                 :token-balances="tokenBalances"
                 :token-records="tokenRecords"
                 :token-name="tokenName"
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
                         src="../../static/icons/ic_deposit.png"><b class="deposit-txt">Receive</b></b-button>
                <b-button class="btn-send"
                          @click="send">
                    <img class="icon-btn"
                         src="../../static/icons/ic_send.png"><b class="send-txt">Send</b></b-button>
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
                  :vsys-balance="vsysBalance"
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
import seedLib from '../utils/seed.js'
import BigNumber from 'bignumber.js'
import AddToken from './AddToken.vue'
import { MAINNET_IP, TESTNET_IP } from 'src/store/network'

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
        this.$store.commit('wallet/initializeNode')
        this.getTokenRecords()
        this.updateAPI()
        this.getAddresses()
        this.getVSYS()
        this.getTokenBalances()
        this.accountName = this.accountNames[this.selectedAccount]
    },
    data: function() {
        return {
            page: 'home',
            addresses: {},
            address: '',
            accountName: '',
            vsysBalance: '0',
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
            if (this.wallet.password) {
                return JSON.parse(
                    seedLib.decryptSeedPhrase(this.wallet.info, this.wallet.password))
            }
        },
        tokenName() {
            if (this.selectedToken === 'VSYS') {
                return 'VSYS'
            } else {
                return this.tokenRecords[this.selectedToken].name
            }
        },
        tokenSvg() {
            let name = this.tokenName
            switch (name) {
              case "VSYS":
                return "../../static/icons/token/VSYS.png"
              case "BlockDesk":
                return "../../static/icons/token/BlockDesk.png"
              case "DLL":
                return "../../static/icons/token/Dll.svg"
              case "DM":
                return "../../static/icons/token/DM.svg"
              case "GoldZip":
                return "../../static/icons/token/GoldZip.jpg"
              case "IPX":
                return "../../static/icons/token/IPX.svg"
              case "OCT":
                return "../../static/icons/token/OCT.jpg"
              case "VTest":
                return "../../static/icons/token/VTest.svg"
              default:
                return this.tokenRecords[this.selectedToken].iconUrl || "../../static/icons/token/other.svg"
            }
        },
        accountBalance() {
            let amount = 0
            if (this.selectedToken === 'VSYS') {
                amount = this.vsysBalance
            } else {
                if (this.tokenBalances[this.selectedToken]) {
                    amount = String(this.tokenBalances[this.selectedToken].value)
                } else {
                    amount = '0'
                }
            }
            return amount
        }
    },
    watch: {
        walletAmount(now, old) {
            this.getAddresses()
            this.getVSYS()
            this.getTokenBalances()
            this.showNav = false
            this.$nextTick(() => (this.showNav = true))
        },
        selectedAccount(now ,old) {
            this.address = this.addresses[this.selectedAccount]
            this.getVSYS()
            this.getTokenBalances()
            this.showNav = false
            this.$nextTick(() => (this.showNav = true))
        },
        selectedToken(now, old) {
            this.getVSYS()
            this.getTokenBalances()
        },
        page(now, old) {
            if (now === 'home') {
                this.getVSYS()
                this.getTokenBalances()
            }
        },
        networkByte(now, old) {
            this.getTokenRecords()
            this.updateAPI()
            this.getAddresses()
            this.$store.commit('account/updateSelectedToken', 'VSYS')
            this.getVSYS()
            this.getTokenBalances()
            this.accountName = this.accountNames[this.selectedAccount]
            this.showNav = false
            this.$nextTick(() => (this.showNav = true))
        }
    },
    mounted() {
        this.setSessionClearTimeout()
    },
    beforeDestroy() {
        clearTimeout(this.sessionClearTimeout)
    },
    methods: {
        updateAPI() {
            let apiData = {
                networkByte: this.networkByte,
                nodeUrl: String.fromCharCode(this.networkByte) === 'M' ? MAINNET_IP : TESTNET_IP
            }
            this.$store.commit('API/updateAPI', apiData)
            let localNode = String.fromCharCode(this.networkByte) === 'M' ? this.wallet.nodeUrl : this.wallet.testNodeUrl
            if (localNode !== apiData.nodeUrl) {
                let suffix = '/blocks/height'
                this.$http.get(localNode + suffix).then(res => {
                  if (res.ok && res.body.height) {
                    apiData.nodeUrl = localNode
                    this.$store.commit('API/updateAPI', apiData)
                  }
                })
            }
        },
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
            this.addresses = {}
            let seedPhrase = this.getSeedPhrase()
            for (let index = 0; index < this.walletAmount; index++) {
                let seed = seedLib.fromExistingPhrasesWithIndex(seedPhrase, index, this.networkByte)
                Vue.set(this.addresses, index, seed.address)
            }
            this.address = this.addresses[this.selectedAccount]
        },
        getVSYS() {
            this.chain.getBalanceDetail(this.address).then(response => {
                this.vsysBalance = BigNumber(response.available).dividedBy(VSYS_PRECISION).toString()
            }, respError => {
                this.vsysBalance = '0'
            })
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
