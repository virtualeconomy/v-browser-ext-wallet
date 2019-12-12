<template>
  <b-modal id="about"
           title="About"
           ref="aboutModal"
           centered
           ok-only
           hide-header
           hide-footer>
    <button
      class="close btn-close"
      @click="closeModal">
      <img width="12" height="12"
           src="../../static/icons/ic_close.png">
    </button>
    <div class="about-container">
      <div class="image-illustration">
        <img width="150px"
             src="../../static/icons/ic_illustration_wallet.svg">
      </div>
      <div class="about-vsyswallet">About V Wallet
      </div>
      <div class="version">Version {{ vNumber }}
      </div>
      <div class="about_text">
        V Wallet is a reference implementation of cross-platform browser wallet for the V Systems blockchain network. It features basic hot wallet mode.<br/>It implements V Systems wallet format specification 1.0 and V Systems wallet QR code API 4.0.
      </div>
      <div class="right-reserved">@2018-2019 V SYSTEMS LIMITED All rights reserved
      </div>
    </div>
  </b-modal>
</template>
<script>
import manifest from '../manifest'
var initData = {
    vNumber: manifest.version
}
export default {
    name: 'About',
    data: function() {
        return initData
    },
    methods: {
        closeModal() {
            this.$refs.aboutModal.hide()
        }
    }
}
</script>

<style scoped>
.btn-close {
    position: absolute;
    right: 15px;
    margin-top: -6px !important;
}
.about-container {
    text-align: center;
}
.image-illustration{
    margin-top: 10px;
    margin-bottom: 10px;
}
.about-vsyswallet {
    color:#181B3A;
    font-size: 24px;
}
.version {
    color:#9091A3;
    font-size:16px;
}
.about_text {
    margin: 15px;
    margin-right: 10px !important;
    color:#4F515E;
    font-size:12px;
    text-align: left;
}
.right-reserved {
    text-align: center;
    width: 100%;
    color:#9091A3;
    float:left;
    font-size:10px;
}
</style>
