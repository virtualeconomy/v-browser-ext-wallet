<template>
    <b-container
            fluid
            class="deposit-content">
        <b-form-input id="addressInput"
                      class="input-t"
                      type="text"
                      readonly
                      v-model="address">
        </b-form-input>
        <textarea v-model="address"
                  ref="addrToCopy"
                  class="hidden"
                  readonly>
        </textarea>
        <b-btn id="btn-cpy"
               class="btn-copy"
               v-b-popover.click.topright="'Copied!'"
               @click="copyAddr"
               variant="link">
            <img width="22" height="22" src="../../static/icons/ic_copy.png">
        </b-btn>
        <div id="address-qrcode">
            <img :src="getQrCodeImg">
        </div>
        <b-button variant="warning"
                  class="btn-o"
                  block
                  size="lg"
                  @click="ok">OK
        </b-button>
    </b-container>
</template>

<script>
import { PROTOCOL, OPC_ACCOUNT } from '../js-v-sdk/src/constants'
import jrQrcode from 'jr-qrcode'
export default {
    name: "Deposit",
    props: {
        address: {
            type: String,
            require: true,
            default: ''
        }
    },
    computed: {
        receivedObject() {
            return {
                protocol: PROTOCOL,
                api: 1,
                opc: OPC_ACCOUNT,
                address: this.address
            }
        },
        getQrCodeImg() {
            const options = {
                padding: 10,
                width: 180,
                height: 180,
                correctLevel: 2,
                reverse: false,
                background: '#ffffff',
                foreground: '#000000'
            }
            const text = JSON.stringify(this.receivedObject)
            const imgBase64 = jrQrcode.getQrBase64(text, options)
            return imgBase64
        },
    },
    methods: {
        ok() {
            this.$emit('changePage', 'home')
        },
        copyAddr() {
            this.$refs.addrToCopy.select()
            window.document.execCommand('copy')
            this.$root.$emit('bv::show::popover', 'btn-cpy')
            setTimeout(() => {
                this.$root.$emit('bv::hide::popover', 'btn-cpy')
            }, 400)
        }
    }
}
</script>

<style scoped>
.deposit-content {
    padding: 30px;
    min-height: 500px;
}
#address-qrcode {
    margin-top: 30px;
    text-align: center;
    margin-bottom: 40px;
}
.input-t {
    height: 48px;
    font-size: 12px;
    color: #181B3A;
    letter-spacing: 0;
    padding-right: 30px;
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
.btn-copy {
    position: absolute;
    right:0;
    margin-right: 26px;
    margin-top: -43px;
}
</style>
