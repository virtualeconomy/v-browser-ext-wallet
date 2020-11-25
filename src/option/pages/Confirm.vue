<template>
  <div class="confirm" :style="{'width':screenWidth+'px'}">
    <div class="tips" v-if="!isNext">
      <h5>此动作可能造成您资产转移到其他钱包上并且不可逆转，请确保您信任该网址并了解您现在所做的动作.</h5>
      <div class="next_btn">
        <button class="btn left" @click="getSelection(false)">取消</button>
        <button class="btn right" @click="isNext=true">我已了解风险并愿意承担后果，请继续</button>
      </div>
    </div>
    <template v-else>
      <div class="method">
        <h3>{{interactData.method.toUpperCase()}}</h3>
      </div>
      <div class="content" v-if="interactData.params">
        <div class="params" v-for="(v,k,i) in interactData.params" :key="i">
          <span>{{k.charAt(0).toUpperCase()+k.slice(1)}}: {{v}}</span>
        </div>
      </div>
      <div class="btn_group">
        <button class="btn left" @click="isNext=false">上一步</button>
        <button class="btn conf" @click="getSelection(true)">确定</button>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  async created() {
    this.interactData = JSON.parse(window.localStorage.getItem("interactData"));
    this.windowId = await this.getWindowId();
    this.interactData.windowId = this.windowId 
    window.localStorage.setItem("interactData", JSON.stringify(this.interactData));
    this.screenWidth = window.innerWidth;
  },
  data() {
    return {
      interactData: {},
      windowId: 1,
      screenWidth: 1080,
      isNext: false
    };
  },
  methods: {
    getSelection(res) {
      chrome.runtime.sendMessage(
        {
          method: "confirm",
          isPopupOpened: res
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
  background-color: #fff;
}

.tips {
  width: 70%;
  margin-top: 25%;
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

.method {
  margin-top: 15%;
  margin-bottom: 20px;
}

.params {
  font-size: 15px;
  margin-top: 15px;
  text-align: left;
}

.btn_group {
  width: 25%;
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
  background-color: #cccccc;
  color: #000;
}
.right {
  background-color: rgba(255, 136, 55, 1);
}

.conf {
  width: 70px;
  background-color: #4e6ef3;
}
</style>