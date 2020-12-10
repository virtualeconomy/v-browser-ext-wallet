<template>
    <div class="add-token">
        <div class="add-word">
            <span class="add">Add Tokens</span>
        </div>
        <div class="col page container">
            <div class="height-full"
                 bg-variant="white"
                 border-variant="primary">
                <b-tabs @input="tokenTabChange">
                    <b-tab active>
                        <template slot="title">
                            <div><span>Verified Token</span></div>
                        </template>
                        <div class="content">
                            <div v-if="showDisable"
                                 style="text-align: center;margin-top: 120px;">
                                <img height="70"
                                     width="70"
                                     src="../../static/icons/ic_wait.svg">
                            </div>
                            <div class="accounts-part">
                                <div class="scroll"
                                     :style="{height: showDisable ? '94px': '264px' }">
                                    <div v-for="(certifiedToken, tokenId) in certifiedTokens"
                                         :key="tokenId">
                                        <b-btn class="token-unit"
                                               @click="addVerifiedToken(tokenId, certifiedToken.name)">
                                            <div class="token-svg"><img width="56px"
                                                                        height="56px"
                                                                        :src="certifiedToken.iconUrl"></div>
                                            <div class="cer-name"><span>{{certifiedToken.name}}</span></div>
                                            <div class="notice" v-if="isExistedToken(tokenId)">Already added!</div>
                                        </b-btn>
                                    </div>
                                </div>
                            </div>
                            <b-row class="button-row">
                                <b-col class="col-lef">
                                    <b-button
                                            class="btn-cancel"
                                            block
                                            variant="light"
                                            size="lg"
                                            @click="close">Cancel
                                    </b-button>
                                </b-col>
                                <b-col class="col-rig">
                                    <b-button
                                            block
                                            class="btn-confirm"
                                            variant="warning"
                                            size="lg"
                                            :disabled="isSubmitDisabled"
                                            @click="addToken">Add
                                    </b-button>
                                </b-col>
                            </b-row>
                        </div>
                    </b-tab>
                    <b-tab>
                        <template slot="title">
                            <div><span>Custom Token</span></div>
                        </template>
                        <div class="content">
                            <div class="form-group cus-group">
                                <label>Token ID</label>
                                <b-form-input class="form-control"
                                              v-model="tokenId"
                                              :state="isValidToken(tokenId)"
                                              aria-describedby="inputTokenLiveFeedback"
                                              placeholder="Please input Token ID"
                                              onfocus="this.select()"></b-form-input>
                                <b-form-invalid-feedback id="inputTokenLiveFeedback"
                                                         style="margin-top: -20px"
                                                         v-if="isVerifiedToken(tokenId)">
                                    It's verified Token!
                                </b-form-invalid-feedback>
                                <b-form-invalid-feedback id="inputTokenLiveFeedback"
                                                         style="margin-top: -20px"
                                                         v-else>
                                    Error: Failed to get Token Info! (Please make sure Token ID is correct and network is available to connect node)
                                </b-form-invalid-feedback>
                                <label>Token Symbol</label>
                                <b-form-input class="form-control input-bottom"
                                              v-model="tokenSymbol"
                                              :state="checkSymbol(tokenSymbol)"
                                              aria-describedby="inputSymbolLiveFeedback"
                                              placeholder="Please input Token Symbol"
                                              onfocus="this.select()"></b-form-input>
                                <b-form-invalid-feedback id="inputSymbolLiveFeedback"
                                                         v-if="!isValidSymbol(tokenSymbol)">
                                    Symbol must be digits or English letters within 5.
                                </b-form-invalid-feedback>
                                <b-form-invalid-feedback id="inputSymbolLiveFeedback"
                                                         v-if="!isUsedSymbol(tokenSymbol)">
                                    Symbol already exists.
                                </b-form-invalid-feedback>
                            </div>
                            <b-row class="button-row">
                                <b-col class="col-lef">
                                    <b-button
                                            class="btn-cancel"
                                            block
                                            variant="light"
                                            size="lg"
                                            @click="close">Cancel
                                    </b-button>
                                </b-col>
                                <b-col class="col-rig">
                                    <b-button
                                            block
                                            class="btn-confirm"
                                            variant="warning"
                                            size="lg"
                                            :disabled="isSubmitDisabled"
                                            @click="addToken">Add
                                    </b-button>
                                </b-col>
                            </b-row>
                        </div>
                    </b-tab>
                </b-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import certify from '../utils/certify.js'
import { CERTIFIED_TOKENS, CERTIFIED_TEST_TOKENS } from '../store/network.js'
import common from 'src/js-v-sdk/src/utils/common'
export default {
    name: "AddToken",
    data: function() {
        return {
            activeTab: 'verified',
            tokenId: '',
            tokenSymbol: '',
            certifiedTokens: {},
            selectedVerifiedToken: '',
            selectedVerifiedSymbol: '',
            responseErr: false,
            showDisable: false
        }
    },
    created() {
        this.getCertifiedTokens()
    },
    props: {
        tokenRecords: {
            type: Object,
            require: true,
            default: function() {}
        }
    },
    watch: {
        networkByte(now, old) {
            this.getCertifiedTokens()
        }
    },
    computed: {
        ...mapState({
            chain: state => state.API.chain,
            networkByte: state => state.wallet.networkByte
        }),
        isSubmitDisabled() {
            let tokenId = this.activeTab === 'custom' ? this.tokenId : this.selectedVerifiedToken
            if (this.activeTab === 'verified') {
                return this.isExistedToken(tokenId)
            } else {
                return tokenId.length <= 0 || !this.checkSymbol(this.tokenSymbol) || this.isVerifiedToken(tokenId) || this.tokenSymbol.length <= 0
            }
        }
    },
    methods: {
        getCertifiedTokens() {
            let isTestnet = String.fromCharCode(this.networkByte) === 'T'
            let url = isTestnet ? CERTIFIED_TEST_TOKENS : CERTIFIED_TOKENS
            let localCertifiedTokens = isTestnet ? certify.certifiedTokensList['Testnet'] : certify.certifiedTokensList['Mainnet']
            let iconUrl = url.slice(0, url.length - 11)
            this.showDisable = true
            this.$http.get(url).then(res => {
                try {
                    let data = res.body.data.list
                    let tmpTokens = {}
                    let tmpToken = {}
                    for (let index in data) {
                        tmpToken = data[index]
                        tmpTokens[tmpToken.Id] = { 'name': tmpToken.Name, 'iconUrl': iconUrl + tmpToken.IconUrl }
                    }
                    this.certifiedTokens = localCertifiedTokens
                } catch (err) {
                    this.certifiedTokens = localCertifiedTokens
                }
                this.showDisable = false
            },err => {
                console.log(err)
                this.certifiedTokens = localCertifiedTokens
                this.showDisable = false
            })
        },
        tokenTabChange(tabIndex) {
            if (tabIndex === 0) {
                this.activeTab = 'verified'
            } else if (tabIndex === 1) {
                this.activeTab = 'custom'
            }
        },
        addToken() {
            let tmp = this.tokenRecords
            let tokenId = this.activeTab === 'custom' ? this.tokenId : this.selectedVerifiedToken
            let tokenSymbol = this.activeTab === 'custom' ? this.tokenSymbol : this.selectedVerifiedSymbol
            if (tokenId in tmp) {
                this.$emit('changePage', 'home')
            }
            if (tokenId) {
                this.chain.getTokenInfo(tokenId).then(response => {
                    this.responseErr = false
                    if (response.hasOwnProperty('error')) {
                        this.responseErr = true
                        return
                    }
                    let contractID = common.tokenIDToContractID(tokenId)
                    this.chain.getContractInfo(contractID).then(res => {
                        if (res.hasOwnProperty('error')) {
                            this.responseErr = true
                            return
                        }
                        if (res.type !== 'NonFungibleContract' && res.type !== 'TokenContract' && res.type !== 'TokenContractWithSplit') {
                            this.responseErr = true
                            return
                        }
                        let contractType = res.type
                        let tokenInfo = { 'name': tokenSymbol, 'contractType': contractType }
                        Vue.set(tmp, tokenId, tokenInfo)
                        const updateInfo = { 'networkByte': this.networkByte, 'tokens': tmp}
                        this.$store.commit('account/updateToken', updateInfo)
                        this.$store.commit('account/updateSelectedToken', tokenId)
                        this.$emit('changePage', 'home')
                    }, err => {
                        this.responseErr = true
                    })
                }, respError => {
                    this.responseErr = true
                })
            }
        },
        close() {
            this.$emit('changePage', 'home')
        },
        addVerifiedToken(tokenId, verifiedSymbol) {
            this.selectedVerifiedToken = tokenId
            this.selectedVerifiedSymbol = verifiedSymbol
        },
        isExistedToken(tokenId) {
            return tokenId in this.tokenRecords
        },
        checkSymbol(symbol) {
            return this.isUsedSymbol(symbol) && this.isValidSymbol(symbol)
        },
        isUsedSymbol(symbol) {
            if (symbol === "VSYS") {
                return false
            }
            let tmp = this.tokenRecords
            for (let tokenId in tmp) {
              if (tmp[tokenId].name === symbol) {
                return false
              }
            }
            return true
        },
        isValidSymbol(symbol) {
            let Regx = /^[A-Za-z0-9]*$/;
            return symbol.length <= 5 && Regx.test(symbol)
        },
        isValidToken(tokenId) {
            if (tokenId.length === 0) {
                return void 0
            }
            return !this.responseErr && !this.isVerifiedToken(tokenId)
        },
        isVerifiedToken(tokenId) {
            return tokenId in this.certifiedTokens
        }
    }
}
</script>
<style scoped>
.add-token {
    width:360px;
    background:rgba(247,247,252,1);
}
.add-word {
    position: relative;
    top: 24px;
    left: 24px;
}
.add {
    padding: 0 0;
    font-size:24px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:29px;
}
.page {
    padding: 0px 0px;
    background:rgba(247,247,252,1);
    position: relative;
    top: 36px;
    bottom: 118px;
}
.height-full {
    max-height: 100%;
}
.btn-cancel {
    width:148px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:19px;
    height:44px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(242,242,247,1);
}
.btn-confirm {
    width:148px;
    font-size:16px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:19px;
    height:44px;
    background:rgba(255,136,55,1);
    border-radius:4px;
}
.content {
    background:rgba(247,247,252,1);
}
.button-row {
    padding: 16px 24px;
    height:76px;
    background:rgba(255,255,255,1);
}
.cus-group {
    padding-top: 32px;
    margin-bottom: 118px;
    padding-right: 24px;
    padding-left: 24px;
}
.cus-group label {
    margin-left: 4px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
    margin-bottom: 12px;
}
.cus-group input {
    height:48px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
    margin-bottom: 24px;
}
.input-bottom {
    margin-bottom: 0px !important;
}
.col-lef{
    margin-left: 15px;
    padding-left: 0px;
    padding-right: 0px;
}
.col-rig {
    padding-right: 0px;
    padding-left: 0px;
    margin-right: -15px;
}
.accounts-part {
    width: 100%;
    padding-top: 24px;
    padding-bottom: 48px;
    padding-left: 20px;
    padding-right: 20px;
}
.scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 100;
}
.token-unit {
    width: 320px;
    height: 88px;
    background: rgba(247,247,252,1);
    border-radius: 4px;
    padding-left: 24px;
    padding-bottom: 16px;
    padding-top: 16px;
    border: rgba(247,247,252,1);
}
.token-unit:active, .token-unit:focus, .token-unit:hover, .token-unit:active:focus {
    width: 320px;
    height: 88px;
    background: rgba(247, 247, 252, 1);
    border-radius: 4px;
    border: 1px solid rgba(255, 136, 55, 1);
    padding-left: 24px;
    padding-bottom: 16px;
    padding-top: 16px;
}
.token-svg {
    display:inline-block;
    float: left;
}
.cer-name {
    display:inline-block;
    float: left;
    position: relative;
    top: 17px;
    left: 16px;
    height:21px;
    font-size:18px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:21px;
}
.notice {
    position: relative;
    top: 20px;
    float: right;
    font-size:12px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(246,0,46,1);
    line-height:14px;
}
.tips {
    position: relative;
    top: -20px;
    font-size:12px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(246,0,46,1);
    line-height:14px;
}
</style>
