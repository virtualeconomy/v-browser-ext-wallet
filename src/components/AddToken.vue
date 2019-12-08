<template>
    <div class="add-token">
        <div class="add-word">
            <span class="add">Add Tokens</span>
        </div>
        <div class="col page container">
            <div class="height-full"
                 bg-variant="white"
                 border-variant="primary">
                <b-tabs @input="tranTabChange">
                    <b-tab>
                        <template slot="title">
                            <div><span>Verified Token</span></div>
                        </template>
                        <div class="content">
                            <div class="accounts-part">
                                <div class="scroll"
                                     :style="{height: '264px'}">
                                    <div v-for="(certifiedToken, idx) in certifiedTokens"
                                         :key="idx">
                                        <b-btn class="token-unit">
                                            <div class="token-svg"><img width="56px"
                                                                        height="56px"
                                                                        :src="certifiedTokenSvg(certifiedToken['name'])"></div>
                                            <div  class="cer-name"><span>{{certifiedToken['name']}}</span></div>
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
                    <b-tab active>
                        <template slot="title">
                            <div><span>Custom Token</span></div>
                        </template>
                        <div class="content">
                            <div class="form-group cus-group">
                                <label>Token ID</label>
                                <input class="form-control"
                                       v-model="tokenId">
                                <label>Token Symbol</label>
                                <input class="form-control input-bottom"
                                       v-model="tokenSymbol">
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
import CertifiedTokens from '../utils/certify.js'
export default {
    name: "AddToken",
    components: {
    },
    data: function() {
        return {
            activeTab: 'verified',
            tokenId: '',
            tokenSymbol: '',
            tokenInfo: {},
            certifiedTokens: CertifiedTokens.certifiedTokens()
        }
    },
    computed: {
        ...mapState({
            tokenRecords: state => state.account.tokenRecords
        }),
    },
    methods: {
        tranTabChange(tabIndex) {
            if (tabIndex === 0) {
                this.activeTab = 'verified'
            } else if (tabIndex === 1) {
                this.activeTab = 'custom'
            }
        },
        addToken() {
            let tmp = this.tokenRecords
            Vue.set(tmp, this.tokenId, this.tokenSymbol)
            this.$store.commit('account/updateToken', tmp)
            this.$emit('changePage', 'home')
        },
        close() {
            this.$emit('changePage', 'home')
        },
        certifiedTokenSvg(name) {
            return "../../static/icons/token/" + name + ".svg"
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
.f-records {
    /*padding-bottom: 120px;*/
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
.token-unit, .token-unit:hover {
    width: 320px;
    height: 88px;
    background: rgba(247,247,252,1);
    border-radius: 4px;
    padding-left: 24px;
    padding-bottom: 16px;
    padding-top: 16px;
    border: rgba(247,247,252,1);
}
.token-unit:active, .token-unit:focus, .token-unit:active:focus {
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
</style>
