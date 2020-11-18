<template>
  <b-modal id="webList" ref="webListModal" lazy centered hide-footer hide-header>
    <button class="btn-close close webLists-close" @click="close">
      <img width="12" height="12" src="../../static/icons/ic_close.png" />
    </button>
    <div class="webLists">
      <p class="p1">Trusted Websites</p>
      <div class="table" v-for="(item,index) in storage.wallet.webList" :key="index">
        <div class="content">
          <img :src="item.siteIcon" v-if="item.siteIcon!=null" class="icon" alt />
          <div class="no_icon icon" v-else>{{item.iconText}}</div>
          <div class="name">{{item.siteName}}</div>
        </div>
        <img src="../../static/icons/trash.png" class="trash" alt @click="deleteDomain(index)" />
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "WebList",
  created() {
    this.storage = JSON.parse(window.localStorage.getItem("vuex"));
    this.storage.wallet.webList.map(item => {
      if (item.siteName.indexOf("www.") != -1) {
        item.iconText = item.siteName.slice(4, 5).toUpperCase();
      } else {
        let re = /\./g;
        if (item.siteName.match(re).length > 1) {
          let reg = /([^.]+\.)?([^\.]+\..+)/;
          let m = item.siteName.match(reg);
          if (m.length > 2) {
            item.siteName = m[2];
          }
        }
        item.iconText = item.siteName.slice(0, 1).toUpperCase();
      }
    });
  },
  data: function() {
    return {
      storage: {}
    };
  },
  methods: {
    deleteDomain(idx) {
      this.storage.wallet.webList.splice(idx, 1);
      window.localStorage.setItem("vuex", JSON.stringify(this.storage));
    },
    close() {
      this.$refs.webListModal.hide();
    }
  }
};
</script>

<style scoped>
.webLists {
  padding-top: 15px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.p1 {
  height: 29px;
  font-size: 24px;
  font-family: SFProDisplay-Medium, SFProDisplay;
  font-weight: 500;
  color: rgba(50, 50, 51, 1);
  line-height: 29px;
  margin-bottom: 20px;
}
.webLists-close {
  margin-top: -6px !important;
}
.table {
  width: 85%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content {
  width: 65%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.trash {
  width: 17px;
  height: 20px;
}
.icon {
  width: 25px;
  height: 25px;
}
.no_icon {
  border-radius: 50%;
  border: 1px solid #f5f5f5;
  text-align: center;
  line-height: 25px;
}
.name {
  width: 70%;
}
</style>
