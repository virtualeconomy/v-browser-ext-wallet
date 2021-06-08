<template>
  <b-modal id="signVerify" ref="signVerifyModal" lazy centered hide-footer hide-header>
    <button class="btn-close close sign-verify-close" @click="close">
      <img width="12" height="12" src="../../static/icons/ic_close.png" />
    </button>
    <b-tabs class="tabs" :title-item-class="{fontWeight:bold}" justified @input="switchTab">
      <b-tab>
        <div class="tab_title" slot="title">Sign</div>
        <div class="sign" v-if="step==1">
          <div class="add-account">
            <div class="form-group" style="margin-top: 20px;">
              <label class="add-label">Message</label>
              <input class="form-control input-height" v-model="signMsg" />
            </div>
            <div class="form-group" style="margin-top: 20px;">
              <label class="add-label">Private Key</label>
              <input class="form-control input-height" readonly v-model="this.getPrivateKey" />
            </div>
          </div>
        </div>
        <div class="confirm_page" v-else>
          <div class="form-group" style="margin-top: 20px;">
            <label class="add-label signature_title">Signature</label>
            <div class="confirm_text">{{signSignature}}</div>
          </div>
        </div>
      </b-tab>
      <b-tab>
        <div class="tab_title" slot="title">Verify</div>
        <div class="verify" v-if="step==1">
          <div class="add-account">
            <div class="form-group" style="margin-top: 20px;">
              <label class="add-label">Message</label>
              <input class="form-control input-height" v-model="verifyMsg" />
            </div>
            <div class="form-group" style="margin-top: 20px;">
              <label class="add-label">Signature</label>
              <input class="form-control input-height" v-model="verifySignature" />
            </div>
            <div class="form-group" style="margin-top: 20px;">
              <label class="add-label">Public Key</label>
              <input class="form-control input-height" v-model="verifyPublicKey" />
            </div>
          </div>
        </div>
        <div class="confirm_page" v-else>
          <div v-if="isSign" class="form-group" style="margin-top: 20px;">
            <label class="add-label signature_title">Signature</label>
            <div class="confirm_text">{{verifySignature}}</div>
          </div>
          <div v-else class="form-group" style="margin-top: 20px;">
            <div class="confirm_text">Signature is {{isValidSignature?'valid':'invalid'}} !</div>
          </div>
        </div>
      </b-tab>
    </b-tabs>
    <b-row style="margin-top: 20px;margin-bottom: 15px;">
      <b-col class="col-lef" v-if="step==1">
        <b-button class="btn-cancel" block variant="light" size="lg" @click="close">Cancel</b-button>
      </b-col>
      <b-col class="col-rit" v-if="step==1">
        <b-button
          block
          class="btn-create"
          variant="warning"
          size="lg"
          @click="isSign?sign():verify()"
        >{{isSign?'Sign':'Verify'}}</b-button>
      </b-col>
      <b-col class="col-lef" v-if="step==2">
        <b-button class="btn-cancel" block variant="light" size="lg" @click="prev">Prev</b-button>
      </b-col>
      <b-col class="col-rit" v-if="step==2">
        <b-button block class="btn-create" variant="warning" size="sm" @click="copySignature">Copy</b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'
import seedLib from '../utils/seed.js'
import Base58 from 'base-58'
import Axlsign from 'axlsign'
import { PUBLIC_KEY_BYTE_LENGTH } from 'src/js-v-sdk/src/constants'
export default {
  name: "SignVerify",
  created() {
  },
  data: function() {
    return {
      isSign: true,
      step: 1,
      signMsg: "",
      verifyMsg: "",
      errorMsg: "",
      verifyPublicKey: "",
      signSignature: "",
      isValidSignature: false,
      verifySignature: ""
    };
  },
  computed: {
    ...mapState({
      networkByte: state => state.wallet.networkByte,
      wallet: state => state.wallet,
      account: state => state.API.account,
      selectedAccount: state => state.account.selectedAccount,
    }),
    secretInfo() {
      if (this.wallet.password) {
        return JSON.parse(
            seedLib.decryptSeedPhrase(this.wallet.info, this.wallet.password))
      }
    },
    getPrivateKey() {
      return seedLib.fromExistingPhrasesWithIndex(this.getSeedPhrase, this.selectedAccount, this.networkByte).keyPair.privateKey
    },
    getSeedPhrase() {
      if (this.secretInfo) {
        return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, this.wallet.password)
      }
    },
  },
  methods: {
    resetData() {
      this.step = 1
      this.signMsg = ""
      this.errorMsg = ""
      this.verifyMsg = ""
      this.verifySignature = ""
      this.verifyPublicKey = ""
      this.signSignature = ""
      this.isValidSignature = false
    },
    close() {
      this.resetData()
      this.$refs.signVerifyModal.hide()
    },
    prev() {
      this.step = 1
    },
    sign() {
      try {
        this.account.buildFromPrivateKey(this.getPrivateKey)
        let bytes = Base58.decode(this.signMsg)
        this.signSignature = this.account.getSignature(bytes)
        this.step = 2
      } catch (e) {
        this.errorMsg = e
        console.log(this.errorMsg)
      }
    },
    verify() {
      try {
        let msgBytes = Base58.decode(this.verifyMsg)
        if (!msgBytes || !(msgBytes instanceof Uint8Array)) {
          throw new Error('Missing or invalid msg');
        }
        if (!this.verifySignature || typeof this.verifySignature !== 'string') {
          throw new Error('Missing or invalid signature');
        }
        if (!this.verifyPublicKey || typeof this.verifyPublicKey !== 'string') {
          throw new Error('Missing or invalid public key');
        }
        let signatureBytes = Base58.decode(this.verifySignature)
        let publicKeyBytes = Base58.decode(this.verifyPublicKey)
        if (publicKeyBytes.length !== PUBLIC_KEY_BYTE_LENGTH) {
          throw new Error('Invalid public key');
        }
        this.isValidSignature = Axlsign.verify(publicKeyBytes, msgBytes, signatureBytes);
        this.step = 2
      } catch (e) {
        this.errorMsg = e
        console.log(this.errorMsg)
      }
    },
    switchTab(idx) {
      this.isSign = idx === 0
      this.resetData()
    },
    copySignature() {
      navigator.clipboard
        .writeText(this.isSign ? this.signSignature : this.verifySignature)
        .then(res => {
          // success
        })
        .catch(err => {
          // fail
        });
    }
  }
};
</script>

<style scoped>
.sign-verify-close {
  margin-top: -6px !important;
}
.tabs {
  margin-top: 30px;
  height: 250px;
}

.tab_title {
  font-weight: 500;
  font-size: 18px;
}

.input-height {
  height: 48px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(230, 230, 237, 1);
  font-size: 14px;
  font-family: SFProText-Regular, SFProText;
  font-weight: 400;
  color: rgba(169, 169, 176, 1);
  line-height: 16px;
}
.add-account {
  padding-top: 10px !important;
}
.add-close {
  margin-top: -6px !important;
}
.add-label {
  height: 16px;
  font-size: 15px;
  font-family: SFProText-Regular, SFProText;
  font-weight: 500;
  color: rgba(50, 50, 51, 1);
  line-height: 16px;
}
.btn-cancel {
  height: 44px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(242, 242, 247, 1);
  font-size: 16px;
  font-family: SFProText-Regular, SFProText;
  font-weight: 400;
  color: rgba(50, 50, 51, 1);
  line-height: 19px;
}
.btn-create {
  border-radius: 4px;
  height: 44px;
  font-size: 16px;
  font-family: SFProText-Medium, SFProText;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 19px;
}
.confirm_text {
  color: #a9a9af;
  font-size: 16px;
  margin-left: 10px;
  width: 95%;
  height: 170px;
  word-wrap: break-word;
  word-break: break-all;
  overflow: scroll;
}
.btn-copy {
  width: 70px;
}
.signature_title {
  font-weight: bold;
  font-size: 18px;
}
</style>
