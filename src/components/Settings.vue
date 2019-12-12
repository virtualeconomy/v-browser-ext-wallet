<template>
    <b-modal id="settings"
             ref="settingsModal"
             lazy
             centered
             hide-footer
             hide-header>
        <button class="btn-close close settings-close"
                @click="close">
            <img width="12" height="12" src="../../static/icons/ic_close.png">
        </button>
        <div class="settings">
            <p class="p1">Settings</p>
            <div class="form-group select-form">
                <label>Language</label>
                <b-form-select class="form-control select"
                               :options="langOptions"
                               :disabled="true"
                               v-model="selectedLang">
                </b-form-select>
            </div>
            <div class="form-group select-form">
                <label>Network</label>
                <b-form-select class="form-control select"
                               :options="networkOptions"
                               v-model="selectedNetwork">
                </b-form-select>
            </div>
            <div class="form-group select-form">
                <label>Session Timeout</label>
                <b-form-select class="form-control select"
                               :options="timeoutOptions"
                               v-model="selectedSession">
                </b-form-select>
            </div>
            <b-row style="margin-top: 20px;margin-bottom: 15px;">
                <b-col class="col-lef">
                    <b-button
                            class="btn-cancel"
                            block
                            variant="light"
                            size="lg"
                            @click="close">Cancel
                    </b-button>
                </b-col>
                <b-col class="col-rit">
                    <b-button
                            block
                            class="btn-confirm"
                            variant="warning"
                            size="lg"
                            @click="confirm">Confirm
                    </b-button>
                </b-col>
            </b-row>
        </div>
    </b-modal>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: "Settings",
    created() {
        this.selectedNetwork = this.networkByte
        this.selectedSession = this.sessionTimeout
    },
    data: function() {
        return {
            selectedNetwork: this.networkByte,
            selectedLang: 'en',
            selectedSession: this.sessionTimeout,
            networkOptions: [
                {
                    value: 'M'.charCodeAt(0),
                    text: 'Mainnet'
                },
                {
                    value: 'T'.charCodeAt(0),
                    text: 'Testnet'
                },

            ],
            langOptions: [
                {
                    value: 'en',
                    text: 'EN'
                },
                {
                    value: 'cn',
                    text: 'CN'
                }
            ],
            timeoutOptions: [
                {
                    value: 5,
                    text: '5 min'
                },
                {
                    value: 10,
                    text: '10 min'
                },
                {
                    value: 20,
                    text: '20 min'
                },
                {
                    value: 40,
                    text: '40 min'
                },
                {
                    value: 60,
                    text: '1 hour'
                }
            ]
        }
    },
    computed: {
        ...mapState({
            networkByte: state => state.wallet.networkByte,
            sessionTimeout: state => state.wallet.sessionTimeout
        })
    },
    methods: {
        confirm() {
            const savedSettings = {
                sessionTimeout: this.selectedSession,
                networkByte: this.selectedNetwork
            }
            this.$store.commit('wallet/updateSettings', savedSettings)
            this.$refs.settingsModal.hide()
        },
        close() {
            this.selectedNetwork = this.networkByte
            this.selectedSession = this.sessionTimeout
            this.$refs.settingsModal.hide()
        }
    }
}
</script>

<style scoped>
.settings {
    padding-top: 15px !important;
}
.p1 {
    height:29px;
    font-size:24px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:29px;
    margin-bottom: 20px;
}
.select {
    height: 48px;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    font-family:SFProText-Regular,SFProText;
    background: url("../../static/icons/ic_arrow_down_gray.png") no-repeat scroll 285px center #fff;
    background-size: 12px;
    padding-left: 12px;
    font-size:14px;
    font-weight:400;
    line-height:16px;
    margin-bottom: 10px;
}
.select-form label {
    margin-left: 4px;
    height:16px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
    margin-bottom: 10px;
}
.settings-close {
    margin-top: -6px !important;
}
.btn-cancel {
    height: 44px;
    background: rgba(255,255,255,1);
    border-radius: 4px;
    border: 1px solid rgba(242,242,247,1);
    font-size: 16px;
    font-family: SFProText-Regular,SFProText;
    font-weight: 400;
    color: rgba(50,50,51,1);
    line-height: 19px;
}
.btn-confirm {
    border-radius: 4px;
    height: 44px;
    font-size:16px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:19px;
}
</style>
