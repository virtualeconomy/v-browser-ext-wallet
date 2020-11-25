<template>
  <div class="confirm" :style="{'width':screenWidth+'px','height':screenHeight+'px'}">
    <img class="logo" src="../../../static/icons/V_Wallet_Logo_big.png" alt />
    <div class="tips" v-if="!isNext">
      <h5>此动作可能造成您资产转移到其他钱包上并且不可逆转，请确保您信任该网址并了解您现在所做的动作.</h5>
      <div class="next_btn">
        <button class="btn left" @click="getSelection(false)">取消</button>
        <button class="btn right" @click="isNext=true">我已了解风险并愿意承担后果，请继续</button>
      </div>
    </div>
    <div v-else class="confirm_body">
      <div class="method">
        <h3>{{interactData.method.toUpperCase()}}</h3>
      </div>
      <div class="content" v-if="interactData.params">
        <div class="params" v-for="(value,key,i) in interactData.params" :key="i">
          <span>{{key.charAt(0).toUpperCase()+key.slice(1)}}</span>
          <b-form-input
            id="amount-input"
            class="form-item"
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
        <button class="btn left" @click="isNext=false">上一步</button>
        <button class="btn conf" @click="getSelection(true)">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async created() {
    this.interactData = JSON.parse(window.localStorage.getItem("interactData"));
    if (this.interactData.method == "send") {
      if (this.interactData.params.tokenId && this.interactData.params.tokenId != "") {
        this.interactData.method += " TOKEN";
      } else {
        this.interactData.method += " VSYS";
        delete this.interactData.params.tokenId;
      }
    }
    this.windowId = await this.getWindowId();
    this.interactData.windowId = this.windowId;
    window.localStorage.setItem(
      "interactData",
      JSON.stringify(this.interactData)
    );
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  },
  data() {
    return {
      interactData: {},
      windowId: 1,
      screenWidth: 1080,
      screenHeight: 760,
      isNext: false
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
  width: 70%;
  margin-top: 13%;
  margin-bottom: 20px;
  font-weight: 300;
  font-size: 17px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.next_btn {
  width: 40%;
  margin: 55px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.confirm_body {
  width: 40%;
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
  height: 35px;
  font-size: 14px;
  font-weight: bold;
  outline: none !important;
  color: #fff;
}
.left {
  width: 70px;
  background-color: #fff;
  color: #000;
}
.right {
  background-color: rgba(255, 136, 55, 1);
}

.conf {
  width: 70px;
  background-color: rgba(255, 136, 55, 1);
}
</style>