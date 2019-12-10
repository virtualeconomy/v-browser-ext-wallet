<template>
    <b-modal id="details"
             lazy
             ref="detailsModal"
             centered
             body-class="details-dialog"
             hide-footer
             hide-header>
        <button class="close btn-close" @click="close">
            <img width="12" height="12" src="../../static/icons/ic_close@2x.png">
        </button>
        <div class="account-content">
            <p>{{ accountName }}</p><img width="12" height="12" src="../../static/icons/ic_edit@2x.png"/>
        </div>
        <img :src="getQrCodeImg"/>
        <div class="address"><p>{{ address }}</p>
            <textarea v-model="address"
                      ref="addrToCopy"
                      class="hidden"
                      readonly>
            </textarea>
            <b-btn
                id="addr-cpy"
                v-b-popover.click.top="'Copied!'"
                @click="copyAddress"
                variant="link">
            <img width="12" height="12" src="../../static/icons/ic_copy@2x.png"></b-btn>
        </div>
        <div class="view">
            <p>View on Explorer</p>
            <b-btn variant="link" @click="viewOnExplorer"><img width="6" height="10" src="../../static/icons/ic_arrow_right@2x.png"/></b-btn></div>
        <div class="view">
            <p>Export Private Key / Seed</p>
            <b-btn v-b-modal.privacy variant="link"><img width="6" height="10" src="../../static/icons/ic_arrow_right@2x.png"/></b-btn></div>
        <Privacy></Privacy>
    </b-modal>
</template>

<script>
import jrQrcode from 'jr-qrcode'
import { ADDRESS_TEST_EXPLORER, ADDRESS_EXPLORER } from '../store/network.js'
import { PROTOCOL, OPC_ACCOUNT } from '../js-v-sdk/src/constants.js'
import { mapState } from 'vuex'
import Privacy from './Privacy.vue'
export default {
    name: "Details",
    components: { Privacy },
    computed: {
        ...mapState({
            networkByte: state => state.wallet.networkByte,
        }),
        accountObject() {
            return {
                protocol: PROTOCOL,
                api: 1,
                opc: OPC_ACCOUNT,
                address: this.address
            }
        },
        getQrCodeImg() {
            const options = {
                width: 140,
                height: 140,
                correctLevel: 2,
                reverse: false,
                background: '#ffffff',
                foreground: '#000000'
            }
            const text = JSON.stringify(this.accountObject)
            const imgBase64 = jrQrcode.getQrBase64(text, options)
            return imgBase64
        },
    },
    props: {
        networkByte: {
            type: Number,
            require: true,
            default: 84
        },
        address: {
            type: String,
            require: true,
            default: ''
        },
        accountName: {
            type: String,
            require: true,
            default: ''
        }
    },
    methods: {
        close() {
            this.$refs.detailsModal.hide()
        },
        viewOnExplorer() {
            if (String.fromCharCode(this.networkByte) === 'T') {
                window.open(ADDRESS_TEST_EXPLORER + this.address)
            } else {
                window.open(ADDRESS_EXPLORER + this.address)
            }
        },
        copyAddress() {
            this.$refs.addrToCopy.select()
            window.document.execCommand('copy')
            this.$root.$emit('bv::show::popover', 'addr-cpy')
            setTimeout(() => {
                this.$root.$emit('bv::hide::popover', 'addr-cpy')
            }, 400)
        },
    }
}
</script>

<style scoped lang="less">
.btn-close {
    width: 12px;
    height: 12px;
    margin-top: -3px;
}
.account-content {
    margin-top: 20px;
    margin-bottom: 2px;
    p {
        display: inline-block;
        font-size:20px;
        font-family:SFProDisplay-Medium,SFProDisplay;
        font-weight:500;
        color:rgba(50,50,51,1);
        line-height:24px;
        margin: 0px;
    }
    img {
        position: relative; left: 8px;
    }
}
.address {
    margin-top: 14px;
    text-align: left;
    padding: 8px 12px;
    width:312px;
    height:56px;
    background:rgba(247,247,252,1);
    border-radius:4px;
    margin-bottom: 10px;
    p {
        display: inline-block;
        width:230px;
        height:40px;
        font-size:14px;
        font-family:SFProText-Regular,SFProText;
        font-weight:400;
        color:rgba(50,50,51,1);
        line-height:20px;
        word-break: break-all;
        position: relative;
        margin: 0px;
    }
    button {
        padding: 0px;
        margin-top: 4px;
        float: right;
    }
}
.hidden {
    font-size: 12pt;
    border: 0px;
    padding: 0px;
    margin: 0px;
    position: absolute;
    left: -9999px;
    top: 0px;
}
.view {
    text-align: left;
    border-bottom: 1px solid rgba(242,242,247,1);
    background: rgba(255,255,255,1);
    width:312px;
    height:49px;
    padding: 0px 12px;
    p {
        display: inline-block;
        position: relative;
        height:16px;
        font-size:14px;
        font-family:SFProText-Regular,SFProText;
        font-weight:400;
        color:rgba(50,50,51,1);
        line-height:16px;
        margin: 16px 0px;
    }
    button {
        margin-top: 11px;
        padding:0px;
        float: right;
    }
}
</style>
