<template>
  <div class="confirm" :style="{'width':screenWidth+'px','height':screenHeight+'px'}">
    <img class="logo" src="../../../static/icons/vsys_logo.svg" alt />
    <div class="tips" v-if="!isNext && isShowWarning" :style="{width:tips_width}">
      <img class="warning" src="../../../static/icons/warning.svg" alt />
      <h5>This action may cause your assets to be transferred to other account and irreversible. Please make sure you trust the website and understand what you are doing now!</h5>
      <div class="check_box">
        <b-form-checkbox
          id="checkbox-1"
          v-model="isAccept"
          name="checkbox-1"
          :value="false"
          :unchecked-value="true"
        >I understand the risks and the possible consequences.</b-form-checkbox>
      </div>
      <div class="next_btn">
        <button class="btn left" @click="getSelection(false)">Cancel</button>
        <button class="btn right" @click="btnOpt(true)" :disabled="isAccept">Continue</button>
      </div>
    </div>
    <div v-else class="confirm_body" :style="{width:confirm_body_width}">
      <div class="method">
        <h3>{{interactData.method.toUpperCase()}}</h3>
      </div>
      <div class="content" v-if="interactData.params">
        <div class="params" v-for="(value,key,i) in interactData.params" :key="i">
          <span>{{key.charAt(0).toUpperCase()+key.slice(1)}}</span>
          <b-form-input
            id="amount-input"
            class="form-item"
            :style="{color:key=='Fee'?'red':''}"
            :value="value"
            disabled
            aria-describedby="inputLiveFeedback"
            v-if="key!='description'"
          ></b-form-input>
          <b-form-textarea
            v-else
            id="descriptionInput"
            class="description-item"
            :value="value"
            disabled
            :rows="3"
            :no-resize="true"
            aria-describedby="inputDescriptionLiveFeedback"
          ></b-form-textarea>
        </div>
      </div>
      <div class="btn_group">
        <button class="btn left" @click="getSelection(false)" v-if="!isShowWarning">Cancel</button>
        <button class="btn left" @click="btnOpt(false)" v-else>Prev</button>
        <button class="btn right" @click="getSelection(true)">Confirm</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async created() {
    this.interactData = JSON.parse(window.localStorage.getItem("interactData"));
    if (this.interactData.method == "send") {
      if (
        this.interactData.params.tokenId &&
        this.interactData.params.tokenId != ""
      ) {
        this.interactData.method += " TOKEN";
      } else {
        this.interactData.method += " VSYS";
        delete this.interactData.params.tokenId;
      }
    }
    if (this.interactData.method == "regContract") {
      this.interactData.params.Fee = "100 VSYS";
    }
    this.isShowWarning =
      this.interactData.method == "execContractFunc" ||
      this.interactData.method == "signContent";
    this.windowId = await this.getWindowId();
    this.interactData.windowId = this.windowId;
    window.localStorage.setItem(
      "interactData",
      JSON.stringify(this.interactData)
    );
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerWidth+ 350;
    this.changeWidth();

    window.onresize = () => {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight + 250;
      this.changeWidth();
    };
  },
  data() {
    return {
      interactData: {},
      windowId: 1,
      screenWidth: 500,
      screenHeight: 850,
      confirm_body_width: "90%",
      tips_width: "95%",
      isNext: false,
      isAccept: true,
      isShowWarning: false
    };
  },
  methods: {
    getSelection(res) {
      chrome.runtime.sendMessage(
        {
          method: "confirm",
          isConfirmed: res
        },
        function(response) {}
      );
      chrome.windows.remove(this.windowId);
    },
    getWindowId() {
      return new Promise((resolve, reject) => {
        chrome.windows.getCurrent({ populate: true }, window => {
          resolve(window.id);
        });
      });
    },
    btnOpt(type) {
      this.isNext = type;
      window.scrollTo(0, 0);
    },
    changeWidth() {
      if (this.screenWidth > 1337) {
        this.confirm_body_width = "40%";
        this.tips_width = "70%";
      } else {
        this.confirm_body_width = "90%";
        this.tips_width = "95%";
      }
    }
  }
};
</script>
<style scoped>
.confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f7f7fc;
}

.form-item {
  margin-top: 5px;
  margin-bottom: 24px;
  height: 56px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(230, 230, 237, 1);
}

.description-item {
  margin-top: 5px;
  margin-bottom: 24px;
  height: 80px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(230, 230, 237, 1);
}

.logo {
  margin-top: 7%;
}

.tips {
  margin-top: 8%;
  margin-bottom: 20px;
  font-weight: 300;
  font-size: 17px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.warning {
  width: 100px;
  height: 100px;
}

h5 {
  text-align: left;
  margin-top: 75px;
}

.check_box {
  margin: 45px 0 35px 0;
}

.next_btn {
  width: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.confirm_body {
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.method {
  margin: 10px 0;
}

.content {
  width: 90%;
}

.params {
  width: 100%;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.btn_group {
  width: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 35px 0;
}

.btn {
  border: none;
  width: 85px;
  height: 35px;
  font-size: 14px;
  font-weight: bold;
  outline: none !important;
  color: #fff;
}
.left {
  background-color: #fff;
  color: #000;
}
.right {
  background-color: rgba(255, 136, 55, 1);
}
</style>