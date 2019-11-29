<template>
    <b-modal id="details"
             lazy
             centered
             dialog-class="details-dialog"
             hide-footer
             hide-header>
        <button class="close btn-close">
            <img width="12" height="12" src="../../static/icons/ic_close@2x.png">
        </button>
        <div style="position: relative; top: -26px; margin-bottom: -10px;">
            <div style="margin-bottom: -5px;">
            <p class="account-name">Account 1</p><img style="position: relative; left: 8px;" width="12" height="12" src="../../static/icons/ic_edit@2x.png"/>
            </div>
            <img :src="getQrCodeImg"/>
        </div>
        <div class="address"><p ref="addrToCopy">AR5Rmu8peuqJr98jpSQhnWPw55jfN847w88</p>
            <b-btn
                id="addr-cpy"
                class="btn-copy-addr"
                v-b-popover.click.topright="'Copied!'"
                @click="copyText('addr-cpy', 'addrToCopy')"
                variant="link">
            <img width="12" height="12" src="../../static/icons/ic_copy@2x.png">
        </b-btn></div>
        <div class="view"><p>View on Explorer</p><b-btn class="explorer-link" variant="link" @click="viewOnExplorer"><img width="6" height="10" src="../../static/icons/ic_arrow_right@2x.png"/></b-btn></div>
        <div class="export"><p>Export Private Key / Seed</p><b-btn class="export-link" variant="link"><img width="6" height="10" src="../../static/icons/ic_arrow_right@2x.png"/></b-btn></div>
    </b-modal>
</template>

<script>
import jrQrcode from 'jr-qrcode'
import { ADDRESS_TEST_EXPLORER, ADDRESS_EXPLORER } from '../store/network.js'
export default {
    name: "Details",
    computed: {
        accountObject() {
            return {
                protocol: 'v.systems',
                api: 1,
                opc: 'account',
                address: 'AR5Rmu8peuqJr98jpSQhnWPw55jfN847w88'
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
        }
    },
    methods: {
        viewOnExplorer() {
            if (String.fromCharCode(this.networkByte) === 'T') {
                window.open(ADDRESS_TEST_EXPLORER + this.address)
            } else {
                window.open(ADDRESS_EXPLORER + this.address)
            }
        },
        copyText(buttonId, refName) {
            this.$refs[refName].select()
            window.document.execCommand('copy')
            this.$root.$emit('bv::show::popover', buttonId)
            setTimeout(() => {
                this.$root.$emit('bv::hide::popover', buttonId)
            }, 400)
        }
    }
}
</script>

<style scoped>
.logo-item {
    position: relative;
    top: -50px;
}
.btn-close {
    width: 12px;
    height: 12px;
    margin-top: -7px;
    margin-right: -2px;
}
.address {
    text-align: left;
    width:248px;
    height:56px;
    background:rgba(247,247,252,1);
    border-radius:4px;
}
.address p {
    display: inline-block;
    width:180px;
    height:40px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:20px;
    word-break: break-all;
    position: relative;
    left: 12px;
    top: 8px;
}
.view {
    text-align: left;
    margin-top: 10px;
    border-bottom: 1px solid rgba(242,242,247,1);
    background: rgba(255,255,255,1);
    width:248px;
    height:48px;
}
.view p {
    display: inline-block;
    position: relative;
    left: 12px;
    top: 10px;
    width:111px;
    height:16px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
}
.export {
    text-align: left;
    border-bottom: 1px solid rgba(242,242,247,1);
    margin-bottom: 15px;
    background: rgba(255,255,255,1);
    width:248px;
    height:48px;
}
.export p {
    display: inline-block;
    position: relative;
    left: 12px;
    top: 10px;
    width: 175px;
    height: 16px;
    font-size: 14px;
    font-family: SFProText-Regular, SFProText;
    font-weight: 400;
    color: rgba(50, 50, 51, 1);
    line-height: 16px;
}
.account-name {
    display: inline-block;
    font-size:20px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:24px;
}
.btn-copy-addr {
    margin-top: 7px;
    float: right;
}
.explorer-link {
    float: right;
}
.export-link {
    float: right;
    position: relative;
    top: 3px;
}
</style>
