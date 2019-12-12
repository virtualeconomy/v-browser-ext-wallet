<template>
    <b-modal id="privacy"
             lazy
             ref="privacyModal"
             centered
             hide-footer
             hide-header>
        <div class="back">
            <img class="back-icon" src="../../static/icons/ic_back.png"/>
            <b-btn class="back-link text-decoration-none" variant="link"
                   @click="back">Back</b-btn>
        </div>
        <div class="privacy">
            <p class="p1">{{ accountName }}</p>
            <p class="p2">{{ addressShow }}</p>
            <b-form-group class="private-form">
                <label>Private Key</label>
                <b-input-group class="input-t"
                               v-if="privateKeyHidden">
                    <b-btn @click="showPriKey"
                           size="sm"
                           variant="white"
                           :disabled="!prvKeyPwd"
                           class="privacy-button">Show</b-btn>
                    <b-form-input size="sm"
                                  placeholder="Type your password"
                                  v-model="prvKeyPwd"
                                  @input="hideErr('prvKeyPwdErr')"
                                  type="password"
                                  id="prvKeyPwd">
                    </b-form-input>
                </b-input-group>
                <b-input-group class="input-t"
                               v-else>
                    <b-btn size="sm"
                           variant="white"
                           @click="hidePriKey"
                           class="privacy-button">Hide</b-btn>
                    <b-form-input id="priKey"
                                  readonly
                                  size="sm"
                                  class="show-info"
                                  v-model="privateKey"
                                  type="text">
                    </b-form-input>
                </b-input-group>
            </b-form-group>
            <b-form-group class="private-form">
                <label>Seed</label>
                <b-input-group class="input-t"
                               v-if="seedHidden">
                    <b-btn @click="showSeed"
                           size="sm"
                           variant="white"
                           :disabled="!seedPwd"
                           class="privacy-button">Show</b-btn>
                    <b-form-input size="sm"
                                  placeholder="Type your password"
                                  v-model="seedPwd"
                                  @input="hideErr('seedPwdError')"
                                  type="password"
                                  id="prvKeyPwd">
                    </b-form-input>
                </b-input-group>
                <b-input-group class="input-t"
                               v-else>
                    <b-btn size="sm"
                           variant="white"
                           @click="hideSeed"
                           class="privacy-button">Hide</b-btn>
                    <b-form-input id="priKey"
                                  readonly
                                  size="sm"
                                  v-model="seed"
                                  type="text">
                    </b-form-input>
                </b-input-group>
            </b-form-group>
            <div class="text-area"><p class="p3">Warning: Never disclose this key. Anyone with your private keys can steal any assets help in your account.</p></div>
            <b-row style="margin-top: 20px;margin-bottom: 15px;">
                <b-col>
                <b-button block
                          class="btn-confirm"
                          variant="warning"
                          size="lg"
                          @click="close">Close
                </b-button>
                </b-col>
            </b-row>
        </div>
    </b-modal>
</template>

<script>
import { mapState } from 'vuex'
import seedLib from '../utils/seed.js'
export default {
    name: "Privacy",
    data: function() {
        return {
            prvKeyPwd: '',
            seedPwd: '',
            seed: this.getSeedPhrase,
            prvKeyPwdErr: false,
            seedPwdErr: false,
            seedHidden: true,
            privateKeyHidden: true,
            privateKey: this.getPrivateKey
        }
    },
    props: {
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
    computed: {
        ...mapState({
            wallet: state => state.wallet,
            selectedAccount: state => state.account.selectedAccount,
        }),
        secretInfo() {
            return JSON.parse(
                seedLib.decryptSeedPhrase(this.wallet.info, this.wallet.password))
        },
        getPrivateKey() {
            return seedLib.fromExistingPhrasesWithIndex(this.getSeedPhrase, this.selectedAccount, this.networkByte).keyPair.privateKey
        },
        getSeedPhrase() {
            if (this.secretInfo) {
                return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, this.wallet.password)
            }
        },
        addressShow() {
            const addrChars = this.address.split('')
            addrChars.splice(6, 23, '...')
            return addrChars.join('')
        }
    },
    methods: {
        showPriKey() {
            if (this.prvKeyPwd === this.wallet.password) {
                setTimeout(() => {
                    this.prvKeyPwdErr = false
                    this.privateKey = this.getPrivateKey
                    this.privateKeyHidden = false
                    this.prvKeyPwd = ''
                }, 400)
            } else {
                this.prvKeyPwdErr = true
            }
        },
        hidePriKey() {
            this.privateKey = ''
            this.privateKeyHidden = true
        },
        showSeed() {
            if (this.seedPwd === this.wallet.password) {
                setTimeout(() => {
                    this.seedPwdErr = false
                    this.seed = this.getSeedPhrase
                    this.seedHidden = false
                    this.seedPwd = ''
                }, 400)
            } else {
                this.seedPwdErr = true
            }
        },
        hideSeed() {
            this.seed = ''
            this.seedHidden = true
        },
        hideErr(errorType) {
            this[errorType] = false
        },
        back() {
            this.$refs.privacyModal.hide()
        },
        close() {
            this.$refs.privacyModal.hide()
            this.$emit('close')
        }
    }
}
</script>

<style scoped>
.back {
    height: 40px;
}
.back-icon {
    width: 12px;
    height: 12px;
}
.back-link {
    width: 33px;
    height: 16px;
    font-size: 14px;
    font-family: SFProText-Regular, SFProText;
    font-weight: 400;
    color: rgba(169, 169, 176, 1);
    line-height: 16px;
    padding: 2px 0px;
    margin-bottom: 6px;
}
.privacy {
    text-align: center;
}
.p1 {
    height:24px;
    font-size:20px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:24px;
    margin-bottom: 6px;
}
.p2 {
    height:15px;
    font-size:13px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:15px;
    margin-bottom: 22px;
}
.input-t {
    height:56px;
    background:rgba(255,255,255,1);
}
#prvKeyPwd {
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
    height: 56px !important;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:16px;
}
#priKey {
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
    height: 56px !important;
    padding-right: 70px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:20px;
    word-break: break-all;
}
.private-form {
    text-align: left;
}
.private-form label {
    height:16px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
    margin-bottom: 12px;
}
.privacy-button {
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(255,136,55,1);
    line-height:16px;
    position: absolute;
    margin-top: 15px;
    margin-left: 250px;
    z-index: 100;
}
.text-area {
    height:66px;
    background:rgba(255,245,247,1);
    border-radius:4px;
    padding: 12px;
    text-align: left;
}
.p3 {
    height:42px;
    font-size:12px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(246,0,46,1);
    line-height:14px;
}
.btn-confirm {
    font-size:16px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:19px;
    height:44px;
    background:rgba(255,136,55,1);
    border-radius:4px;
}
</style>
