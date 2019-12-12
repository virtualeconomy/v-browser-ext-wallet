<template>
    <b-btn :class="[selectedToken==tokenId ? 'selected-record-unit' : 'record-unit']"
           @click="addConfirm"
           fluid>
        <div class="record-icon">
            <img width="56px"
                 height="56px"
                 :src="tokenSvg(tokenSymbol)">
        </div>
        <div class="record-detail">
                <div class="token-balance"><span>{{showBalance(balance)}}</span></div>
                <div class="unity"><span>{{ ' ' + tokenSymbol }}</span></div>
        </div>
        <div v-if="!(tokenId === 'VSYS')"
             class="record-action">
            <b-dropdown no-caret
                        class="more-btn"
                        variant="link"
                        right>
                <template slot="button-content" style="padding: 0 0">
                    <div class="more-icon">
                        <img width="20px"
                             height="20px"
                             src="../../static/icons/ic_more@2x.png">
                    </div>
                </template>
                <b-dropdown-item @click="hide"><span>Hide Token</span></b-dropdown-item>
                <b-dropdown-item @click="viewOnExplorer"><span>View on Explorer</span></b-dropdown-item>
            </b-dropdown>
        </div>
    </b-btn>
</template>

<script>
import BigNumber from 'bignumber.js'
import Vue from 'vue'
import { mapState } from 'vuex'
import { TOKEN_TEST_EXPLORER, TOKEN_EXPLORER } from '../store/network.js'
export default {
    name: "TokenRecord",
    data: function() {
        return {
            unity: BigNumber(1)
        }
    },
    props: {
        tokenId: {
            type: String,
            default: '',
            require: true
        },
        tokenSymbol: {
            type: String,
            default: '',
            require: true
        },
        tokenRecords: {
            type: Object,
            require: true,
            default: function() {}
        },
        balance: {
            type: String,
            default: '',
            require: true
        }
    },
    computed: {
        ...mapState({
            networkByte: state => state.wallet.networkByte,
            chain: state => state.API.chain,
            selectedToken: state => state.account.selectedToken
        })
    },
    methods: {
        hide() {
            let tmp = this.tokenRecords
            Vue.delete(tmp, this.tokenId)
            const updateInfo = { 'networkByte': this.networkByte, 'tokens': tmp}
            this.$store.commit('account/updateToken', updateInfo)
        },
        viewOnExplorer() {
            if (String.fromCharCode(this.networkByte) === 'T') {
                window.open(TOKEN_TEST_EXPLORER + this.tokenId)
            } else {
                window.open(TOKEN_EXPLORER + this.tokenId)
            }
        },
        tokenSvg(name) {
            if (name === 'VSYS'){
                return "../../static/icons/token/" + name + ".png"
            } else if (name === 'DLL' || name === 'DM' || name === 'IPX' || name === 'VTEST') {
                return "../../static/icons/token/" + name + ".svg"
            } else {
                return "../../static/icons/token/other.svg"
            }
        },
        addConfirm() {
            this.$store.commit('account/updateSelectedToken', this.tokenId)
            this.$emit('selectSucceed')
        },
        showBalance(balance) {
            let amount = String(balance)
            if (amount.length >= 13) {
                let index = amount.indexOf('.') === -1 ? 7 : amount.indexOf('.')
                amount = amount.slice(0, index + 3) + '...'
            }
            return amount
        },
    }
}
</script>

<style scoped>
.record-unit, .record-unit:hover {
    width:320px;
    height:88px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    padding-left: 20px;
    padding-bottom: 16px;
    padding-top: 16px;
    border: rgba(255,255,255,1);
}
.record-unit:active, .record-unit:focus, .record-unit:active:focus {
    width:320px;
    height:88px;
    background:rgba(233,233,242,1);
    border-radius:4px;
    border:rgba(233,233,242,1);
    padding-left: 20px;
    padding-bottom: 16px;
    padding-top: 16px;
}
.selected-record-unit, .selected-record-unit:hover, .selected-record-unit:active, .selected-record-unit:focus, .selected-record-unit:active:focus {
    width:320px;
    height:88px;
    background:rgba(233,233,242,1);
    border-radius:4px;
    border:rgba(233,233,242,1);
    padding-left: 20px;
    padding-bottom: 16px;
    padding-top: 16px;
}
.record-action {
    width: 40px;
    float: right;
    display: inline-block;
    position: relative;
    top: 10px;
    padding-right: 12px;
    padding-left: 0px;
}
.more-btn {
    background: none;
    border: none;
    padding: 0 0;
}
.token-balance {
    display: inline-block;
    float: left;
    font-size:20px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:28px;
}
.unity {
    padding-left: 4px;
    padding-top: 8px;
    float: left;
    font-size:14px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
}

.more-icon {
    padding: 0 0;
}
.record-icon {
    display:inline-block;
    float: left;
    padding: 0 0;
}
.record-detail {
    float: left;
    display: inline-block;
    padding-left: 15px;
    padding-top: 15px;
}
</style>
