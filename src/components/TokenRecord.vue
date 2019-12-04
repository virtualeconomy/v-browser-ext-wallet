<template>
    <b-container class="record-unit"
                 fluid>
        <b-row align-v="center">
            <b-col class="record-icon">
                <img width="56px"
                     height="56px"
                     src="../../static/icons/ic_v_logo@3x.png">
            </b-col>
            <b-col class="record-detail">
                <div style="float:left">
                    <div style="display: inline-block"><span class="token-balance">{{tokenBalance}}</span></div>
                    <div style="display: inline-block"><span class="unity">{{ ' ' + 'VSYS' }}</span></div>
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
                    <!--<b-dropdown-item @click="hide" class="hide-bg"><span class="hide-word">Hide Token</span></b-dropdown-item>-->
                    <!--<b-dropdown-item @click="exp" class="exp-bg"><span class="exp-word">View on Explorer</span></b-dropdown-item>-->
                </b-dropdown>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import BigNumber from 'bignumber.js'
import { mapState } from 'vuex'
export default {
    name: "TokenRecord",
    data: function() {
        return {
            unity: BigNumber(1),
            tokenBalance: BigNumber(3097.9777)
        }
    },
    props: {
        address: {
            type: String,
            default: ''
        },
        tokenId: {
            type: String,
            default: '',
            require: true
        }
    },
    computed: {
        ...mapState({
            networkByte: state => state.wallet.networkByte,
            chain: state => state.API.chain
        })
    },
    created() {
        this.updateToken()
    },
    methods: {
        hide() {
        },
        exp() {
        },
        updateToken() {
            console.log(this.address)
            console.log(this.tokenId)
            this.chain.getTokenBalance(this.address, this.tokenId).then(response => {
                this.unity = BigNumber(response.unity)
                this.tokenBalance = BigNumber(response.balance).dividedBy(response.unity)
                console.log('res', response)
            }, respError => {
            })
        },
    }
}
</script>

<style scoped>
.record-unit {
    background:rgba(255,255,255,1);
    border-radius:4px;
    width: 320px;
    /*height: 88px;*/
}
.record-unit:hover {
    background:rgba(233,233,242,1);
    border-radius:4px;
    width: 320px;
}
.record-action {
    /*flex-grow: 0;*/
    padding-right: 12px;
    max-width: 60px;
}
.more-btn {
    background: none;
    border: none;
    padding: 0 0;
}
.token-balance {
    font-size:24px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:28px;
}
.unity {
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
    flex-grow: 0;
    padding-left: 20px;
    padding-right: 16px;
    padding-top: 16px;
    padding-bottom: 16px;
}
.record-detail {
    padding-left: 0;
    padding-right: 0;
    padding-top: 30px;
    padding-bottom: 29px;
    min-width: 150px;
}
.hide-bg {
    padding: 0 0;
    background:rgba(50,50,51,1);
    border-radius:4px 4px 0px 0px;
    opacity:0.89;
}
.hide-word {
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:16px;
}
.exp-bg {
    padding: 0 0;
    background:rgba(50,50,51,1);
    border-radius:0px 0px 4px 4px;
    opacity:0.89;
}
.exp-word {
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:16px;
}
</style>
