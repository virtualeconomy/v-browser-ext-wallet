<template>
    <div class="token-select">
        <div class="content">
            <div class="detail-part">
                <div>
                    <canvas class="canvas-item"
                            width="56"
                            height="56"
                            :data-jdenticon-hash="avatarDataHex(addresses[selectedAccount])"></canvas>
                </div>
                <div class="account-name"><span class="name">{{ accountNames[selectedAccount] }}</span></div>
                <div class="details-copy">
                    <div class="details">
                        <div class="inline-p">
                            <img width="14px"
                                 height="14px"
                                 src="../../static/icons/ic_about_small_yellow.png">
                        </div>
                        <div class="detail-word-p">
                            <b-btn class="vsys-color text-decoration-none detail-word"
                                   variant="link"
                                   @click="details">Details</b-btn>
                        </div>
                    </div>
                    <div class="copy">
                        <div class="inline-p"><span class="p3">{{ addressShow }}</span></div>
                        <textarea v-model="address"
                                  ref="addrToCopy"
                                  class="hidden"
                                  readonly>
                        </textarea>
                        <div class="copy-icon-p">
                            <b-btn class="copy-icon"
                                   variant="link"
                                   id="addr-cpy"
                                   v-b-popover.click.topright="'Copied!'"
                                   @click="copyAddress">
                                <img width="12px"
                                     height="12px"
                                     src="../../static/icons/ic_copy.png">
                            </b-btn>
                        </div>
                    </div>
                </div>
                <hr class="hr-account">
            </div>
            <div class="accounts-part">
                <div class="scroll"
                     :style="{height: '176px'}">
                    <TokenRecord :token-id="'VSYS'"
                                 :balance="vsysBalance"
                                 :token-symbol="'VSYS'"
                                 :token-records="tokenRecords"
                                 @selectSucceed="selectSucceed"></TokenRecord>
                    <TokenRecord v-for="(idx, tokenId) in tokenRecords"
                                 :key="idx"
                                 :balance="tokenBalances[tokenId].value"
                                 :token-id="tokenId"
                                 :token-records="tokenRecords"
                                 :token-symbol="tokenRecords[tokenId].name"
                                 @selectSucceed="selectSucceed"></TokenRecord>
                </div>
            </div>
            <div class="tip-part">
                <div class="p1"><span>Don't see your tokens?</span></div>
                <div class="p2"><span>Click on Add Token to add them to your account</span></div>
                <div class="add-btn">
                    <div class="inline-p">
                        <img width="12px"
                             height="12px"
                             src="../../static/icons/ic_add_token.png">
                    </div>
                    <div class="add-word-p">
                        <b-btn class="vsys-color text-decoration-none add-word" variant="link" @click="addToken">Add Token</b-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import jdenticon from 'jdenticon'
import TokenRecord from "./TokenRecord.vue"
import converters from '../js-v-sdk/src/utils/converters.js'
import AddToken from './AddToken.vue'
export default {
    name: "TokenSelect",
    mounted() {
        jdenticon()
    },
    components: {
        TokenRecord,
        AddToken
    },
    props: {
        addresses: {
            type: Object,
            require: true,
            default: function() {}
        },
        selectedAccount: {
            type: Number,
            require: true,
            default: 0
        },
        accountNames: {
            type: Array,
            require: true,
            default: function() {
            }
        },
        vsysBalance: {
            type: String,
            require: true,
            default: '0'
        },
        tokenBalances: {
            type: Object,
            require: true,
            default: function() {}
        },
        address: {
            type: String,
            require: true,
            default: ''
        },
        tokenRecords: {
            type: Object,
            require: true,
            default: function() {}
        },
        selectedToken: {
            type: String,
            require: true,
            default: 'VSYS'
        }
    },
    methods: {
        addToken() {
            this.$emit('changePage', 'addToken')
        },
        copyAddress() {
            this.$refs.addrToCopy.select()
            window.document.execCommand('copy')
            this.$root.$emit('bv::show::popover', 'addr-cpy')
            setTimeout(() => {
                this.$root.$emit('bv::hide::popover', 'addr-cpy')
            }, 400)
        },
        details() {
            this.$root.$emit('bv::show::modal', 'details')
            this.$emit('selectSucceed')
        },
        avatarDataHex(address) {
            return converters.stringToHexString(address).split('').reverse().slice(1, 21).join('')
        },
        selectSucceed() {
            this.$emit('selectSucceed')
        }
    },
    computed: {
        addressShow() {
            const addrChars = this.addresses[this.selectedAccount].split('')
            addrChars.splice(6, 23, '...')
            return addrChars.join('')
        }
    }
}
</script>

<style scoped>
.token-select {
    overflow: hidden;
    z-index:1000;
    max-width: 340px;
}
.content {
    text-align:center;
}
.detail-part {
    position: relative;
    top: 27px;
    width: 100%;
}
.canvas-item {
}
.accounts-part {
    width: 100%;
    position: relative;
    top: 40px;
}
.tip-part {
    position: relative;
    top: 54px;
    width: 100%;
}
.account-name {
    position: relative;
    top: 12px;
}
.name {
    font-size:20px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:24px;
}
.details-copy {
    position: relative;
    top: 24px;
    padding-bottom: 10px;
}
.details {
    width: 95px;
    position: relative;
    display:inline-block;
    background:rgba(247,247,252,1);
    border-radius:17px 0px 0px 17px;
}
.copy {
    width: 168px;
    display:inline-block;
    position: relative;
    left: 1px;
    background:rgba(247,247,252,1);
    border-radius:0px 17px 17px 0px;
}
.hr-account {
    position: relative;
    top: 30px;
    width:320px;
    height:1px;
    background:rgba(240,240,245,1);
}
.p1 {
    font-size:16px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:19px;
}
.p2 {
    position: relative;
    top: 8px;
    font-size:13px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:14px;
    text-align: center;
    width: 216px;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    margin: 0 auto;
}
.p3 {
    width:116px;
    height:15px;
    font-size:13px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:15px;
}
.inline-p {
    display:inline-block;
    padding: 2px;
}
.detail-word {
    font-size:13px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(255,136,55,1);
    line-height:15px;
    padding: 0 0;
}
.detail-word-p {
    display:inline-block;
}
.add-word {
    width:80px;
    height:20px;
    font-size:14px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(255,136,55,1);
    line-height:16px;
    padding: 0 0;
}
.add-word-p {
    display:inline-block;
    position: relative;
    left: 2px;
}
.copy-icon-p {
    display:inline-block;
}
.copy-icon {
    width: 24px;
    height: 24px;
    padding: 0 0;
    position: relative;
    top: -2px;
}
.scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 100;
}
.add-btn {
    position: relative;
    top: 12px;
    padding-bottom: 76px;
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
</style>
