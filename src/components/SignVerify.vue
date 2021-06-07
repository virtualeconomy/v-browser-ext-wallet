<template>
  <b-modal id="signVerify" ref="signVerifyModal" lazy centered hide-footer hide-header>
    <button class="btn-close close sign-verify-close" @click="close">
      <img width="12" height="12" src="../../static/icons/ic_close.png" />
    </button>
    <b-tabs class="tabs" :title-item-class="{fontWeight:bold}" justified @input="chageFeature">
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
              <input class="form-control input-height" v-model="signPrivateKey" />
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
              <label class="add-label">Public Key</label>
              <input class="form-control input-height" v-model="verifyPublicKey" />
            </div>
          </div>
        </div>
        <div class="confirm_page" v-else>
          <div class="form-group" style="margin-top: 20px;">
            <label class="add-label signature_title">Signature</label>
            <div class="confirm_text">{{verifySignature}}</div>
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
export default {
  name: "SignVerify",
  created() {},
  data: function() {
    return {
      isSign: true,
      step: 1,
      signMsg: "",
      signPrivateKey: "",
      verifyMsg: "",
      verifyPublicKey: "",
      signSignature: "",
      verifySignature: ""
    };
  },
  methods: {
    resetData() {
      this.step = 1;
      this.signMsg = "";
      this.signPrivateKey = "";
      this.verifyMsg = "";
      this.verifyPublicKey = "";
    },
    close() {
      this.$refs.signVerifyModal.hide();
    },
    prev() {
      this.step = 1;
    },
    sign() {
      //TODO sign
      this.step = 2;
    },
    verify() {
      //TODO verify
      this.step = 2;
    },
    chageFeature(idx) {
      this.isSign = idx === 0;
      this.resetData();
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
