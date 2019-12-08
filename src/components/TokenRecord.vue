<template>
    <b-btn class="record-unit"
           @click="addConfirm"
           fluid>
        <b-row>
            <b-col class="record-icon">
                <img width="56px"
                     height="56px"
                     :src="tokenSvg(tokenSymbol)">
            </b-col>
            <b-col class="record-detail">
                <div style="float:left">
                    <div style="display: inline-block"><span class="token-balance">{{showBalance(balance)}}</span></div>
                    <div style="display: inline-block"><span class="unity">{{ ' ' + tokenSymbol }}</span></div>
                </div>
            </b-col>
            <b-col class="record-action">
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
                    <b-dropdown-item @click="exp"><span>View on Explorer</span></b-dropdown-item>
                </b-dropdown>
            </b-col>
        </b-row>
    </b-btn>
</template>

<script>
import BigNumber from 'bignumber.js'
import Vue from 'vue'
import { mapState } from 'vuex'
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
        address: {
            type: String,
            default: '',
            require: true
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
            tokenRecords: state => state.account.tokenRecords
        })
    },
    created() {
    },
    methods: {
        hide() {
            var tmp = this.tokenRecords
            Vue.delete(tmp, this.tokenId)
            this.$store.commit('account/updateToken', tmp)
        },
        exp() {
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
            if (amount.length >= 7) {
                // let index = amount.indexOf('.')
                amount = amount.slice(0, 7) + '...'
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
.record-action {
    position: relative;
    left: 40px;
    padding-top: 10px;
    padding-right: 12px;
    padding-left: 0px;
}
.more-btn {
    background: none;
    border: none;
    padding: 0 0;
}
.token-balance {
    float: left;
    font-size:24px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:28px;
}
.unity {
    padding-left: 4px;
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
    padding-top: 15px;
    padding-left: 0px;
    padding-right: 0px;
    min-width: 150px;
}
</style>
