<template>
    <div>
        <b-navbar class="nav-item">
            <b-navbar-brand>
                <b-btn class="logo-btn"
                       variant="white"
                       @click="updatePopover"><img class="v-logo" src="../../static/icons/ic_v_logo@3x(1).png"></b-btn>
            </b-navbar-brand>
            <b-navbar-nav class="account">
                <b-btn class="logo-btn"
                       variant="white"
                       @click="updatePopover"><p class="account-name">{{ accountNames[selectedAccount] }}</p></b-btn>
                <b-btn class="logo-btn"
                       variant="white"
                       @click="updatePopover"><p class="account-address">{{ addressShow }}</p></b-btn>
                <div class="tokens-detail">
                    <b-button id="popover-1"
                              class="token-detail"
                              variant="link"
                              align="center"
                              @click="pop = !pop">
                        <div><img v-if="pop===false"
                                  width="10px"
                                  height="6px"
                                  src="../../static/icons/ic_arrow_down_yellow@3x.png"/></div>
                        <div><img v-if="pop===true"
                                  width="10px"
                                  height="6px"
                                  src="../../static/icons/ic_arrow_up_yellow@2x.png"/></div>
                    </b-button>
                </div>
                <b-popover ref="popover"
                           placement="bottom"
                           target="popover-1"
                           triggers=""
                           boundary-padding="0"
                           no-fade="false"
                           :show.sync="pop">
                    <token-select class="token-select"
                                  :addresses="addresses"
                                  :address="addresses[selectedAccount]"
                                  :selected-account="selectedAccount"
                                  :account-names="accountNames"
                                  :token-balances="tokenBalances"
                                  :balances="balances"
                                  :selected-token="selectedToken"
                                  @changePage="changePage"
                                  @selectSucceed="selectSucceed"></token-select>
                </b-popover>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
              <b-nav-item-dropdown right
                                   class="pr-0"
                                   no-caret>
                <template slot="button-content">
                  <canvas class="avatar col pr-0 canvas"
                          width="36"
                          height="36"
                          @click="showDropdown"
                          :data-jdenticon-hash="avatarDataHex(addresses[selectedAccount])"></canvas>
                </template>
              <div class="scroll"
                   :style="{'min-height': 'auto', 'max-height': '200px'}">
                  <b-dropdown-item-button class="button"
                                          variant="white"
                                          :class="{'selected-account': index === selectedAccount}"
                                          @click="select(index)"
                                          v-for="(address, index) in addresses">
                      <canvas class="canvas-item"
                              width="32"
                              height="32"
                              :data-jdenticon-hash="avatarDataHex(address)"></canvas>
                      <div style="display: inline-block; margin-left: 10px; height: 35px;">
                          <p class="address-item">{{ accountNames[index] }}</p>
                          <p class="amount-item">{{ showBalance(balances[address]) + ' ' + tokenName}}</p>
                      </div>
                      <img v-if="index === selectedAccount"
                           class="select"
                           width="10px"
                           height="8px" src="../../static/icons/ic_selected@2x.png">
                  </b-dropdown-item-button>
              </div>
              <b-dropdown-item v-b-modal.addAccount href="#" class="drop-down"> <img class="icon" src="../../static/icons/ic_add_account@2x.png"><span class="text">Add Account</span></b-dropdown-item>
              <b-dropdown-item v-b-modal.about href="#" class="drop-down"><img class="icon" src="../../static/icons/ic_about@2x.png"><span class="text">About</span></b-dropdown-item>
              <b-dropdown-item v-b-modal.settings href="#" class="drop-down"><img class="icon" src="../../static/icons/ic_setting@2x.png"><span class="text">Settings</span></b-dropdown-item>
              <b-dropdown-item @click="logout" class="drop-down"><img class="icon" src="../../static/icons/ic_logout@2x.png"><span class="text">Log Out</span></b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-navbar>
      <AddAccount></AddAccount>
      <Details :address="addresses[selectedAccount]"
               :account-name="accountNames[selectedAccount]"></Details>
      <Settings></Settings>
      <About></About>
    </div>
</template>

<script>
import jdenticon from 'jdenticon'
import converters from '../js-v-sdk/src/utils/converters.js'
import Details from './Details.vue'
import AddAccount from './AddAccount.vue'
import Settings from './Settings.vue'
import About from './About.vue'
import TokenSelect from "./TokenSelect.vue"
export default {
    name: "NavBar",
    mounted() {
      jdenticon()
    },
    data() {
        return {
            pop: false
        }
    },
    props: {
        addresses: {
            type: Object,
            require: true,
            default: function() {}
        },
        accountNames: {
            type: Array,
            require: true,
            default: function() {
            }
        },
        balances: {
            type: Object,
            require: true,
            default: function() {}
        },
        tokenBalances: {
            type: Object,
            require: true,
            default: function() {}
        },
        selectedAccount: {
            type: Number,
            require: true,
            default: 0
        },
        tokenName: {
            type: String,
            require: true,
            default: 'VSYS'
        },
        selectedToken: {
            type: String,
            require: true,
            default: 'VSYS'
        }
    },
    components: {
        Details,
        AddAccount,
        TokenSelect,
        Settings,
        About
    },
    methods: {
        showDropdown() {
            this.$refs.popover.$emit('close')
        },
        logout() {
            this.$store.commit('wallet/updatePassword', false)
            this.$router.push('/login')
        },
        avatarDataHex(address) {
            return converters.stringToHexString(address).split('').reverse().slice(1, 21).join('')
        },
        showBalance(balance) {
            let amount = String(balance)
            if (amount.length >= 11) {
                let index = amount.indexOf('.')
                amount = amount.slice(0, index + 3) + '...'
            }
            return amount
        },
        select(index) {
            this.$store.commit('account/updateSelectedAccount', index)
        },
        changePage(data) {
            this.$refs.popover.$emit('close')
            this.$emit('changePage', data)
        },
        selectSucceed() {
            this.$refs.popover.$emit('close')
        },
        updatePopover() {
            if(this.pop) {
                this.$refs.popover.$emit('close')
                this.pop = false
            } else {
                this.$refs.popover.$emit('open')
                this.pop = true
            }
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
.v-logo {
    width: 28px;
    height: 28px;
}
.logo-btn {
    padding: 0 0;
    background: rgba(255,255,255,1);
    border: rgba(255,255,255,1);
}
.logo-btn:hover {
    padding: 0 0;
    background: rgba(255,255,255,1);
    border: rgba(255,255,255,1);
}
.logo-btn:active, .logo-btn:focus, .logo-btn:active:focus {
    padding: 0 0;
    background: rgba(255,255,255,1);
    border: rgba(255,255,255,1);
}
.icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
}
.canvas-item {
    display: inline-block;
    margin-left: -10px;
    margin-top: 8px;
}
.text {
    width:86px;
    height:16px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
}
.drop-down {
    margin-top: 10px;
    height: 40px;
}
.button {
    margin-top: 8px;
    margin-right: 16px;
    margin-left: 16px;
    display: inline-block;
    width:198px;
    height:56px;
    background:rgba(247,247,252,1);
    border-radius:4px;
}
.canvas {
    padding-right: 0px !important;
    margin-top: 5px;
}
.nav-item {
    height: 60px;
    background:#FFFFFF;
}
.account {
    text-align: center;
    flex-direction: column !important;
    margin: 0 auto;
}
.account-name {
    font-size: 16px;
    font-family: SFProText-Medium,SFProText;
    font-weight: 500;
    color: rgba(50,50,51,1);
    line-height: 19px;
    text-align: center;
    position: relative;
    top: 8px;
}
.account-address {
    font-size: 12px;
    font-family: SFProText-Regular,SFProText;
    font-weight: 400;
    color: rgba(169,169,176,1);
    line-height: 14px;
    margin-top: -8px;
    margin-bottom: 0px;
}
.address-item {
    width:67px;
    height:16px;
    font-size:14px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:16px;
    margin-bottom: 4px;
}
.amount-item {
    width:83px;
    height:13px;
    font-size:11px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:13px;
    margin-bottom: 4px;
}
.selected-account {
    border-radius:4px;
    border:1px solid rgba(255,136,55,1) !important;
}
.select {
    margin-top: -25px;
    margin-left: 25px;
    display: inline-block;
}
.tokens-detail{
    margin: 0 auto;
    position: relative;
    top: -8px;
}
.token-detail {
    position: relative;
    padding: 0 0;
    height: 18px;
}
.token-select {
    position: relative;
    z-index:1000;
    max-width: 340px;
}
.ml-auto {
    margin-left: 0px !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
}
.scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 100;
}
</style>
