<template>
    <div>
    <div class="save-back-up">
        <div class="back">
            <img class = "back-icon" src="../../../static/icons/ic_back@2x.png"/>
            <b-btn class="back-link text-decoration-none" variant="link"
                   @click="back">Back</b-btn>
        </div>
        <p class="p1">Secret Backup Phrase</p>
        <p class="p2">Your secret backup phrase makes it easy to back up and restore your personal account.</p>
        <p class="p3"><span style="color:rgba(255,136,55,1);">WARNING:</span> Never disclose your backup phrase. Anyone with this phrase can take your Ether forever.</p>
        <div class="word-container unselectable">
            <template v-for="(word, idx) in wordList">
          <span
                  :key="idx"
                  class="word">
            {{ word }}
          </span>
                &nbsp;
            </template>
        </div>
    </div>
        <div class="tips">
            <p style="font-weight: 600;font-family:SFProText-Semibold,SFProText;">Tips:</p>
            <p>Store this phrase in a password manager like 1 Password.</p>
            <p>Write this phrase on a piece of paper and store in a secure location. If you want even more securuty, write it down on multiple pieces of paper and store each in 2-3 different location.</p>
            <p>Memorize this phrase.</p>
            <br>
            <p style="color: rgba(255,136,55,1);">Download this Secret Backup Phrase and Keep it store safety on an extermal encrypted hard drive of storage medium.</p>
        </div>
    </diV>
</template>

<script>
export default {
    name: "SaveBackup",
    methods: {
        back() {
            this.$emit('show-page', 'create')
        }
    },
    data: function () {
        return {
            wordList: ['library', 'promote', 'tattoo', 'one', 'ginger', 'enough', 'sock', 'casino', 'turkey', 'motion', 'erode', 'inflict']
        }
    }
}
</script>

<style scoped>
.save-back-up {
    width: 560px;
    position: relative;
    display: block;
    top: 28px;
}
.tips {
    width: 233px;
    position: relative;
    left: 607px;
    top: -251px;
    display: block;
}
.tips p {
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:21px;
}
.back {
    height: 50px;
}
.back-icon {
    width: 14px;
    height: 14px;
}
.back-link {
    width: 39px;
    height: 19px;
    font-size: 16px;
    font-family: SFProText-Regular, SFProText;
    font-weight: 400;
    color: rgba(169, 169, 176, 1);
    line-height: 19px;
    padding: 2px 0px;
    margin-bottom: 4px;
}
.p1 {
    height:40px;
    font-size:33px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:40px;
}
.p2 {
    width:100%;
    height:42px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:21px;
}
.p3 {
    width:100%;
    height:42px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:#323233;
    line-height:21px;
}
.word-container {
    margin-top: 56px;
    padding: 30px 62px;
    background:rgba(255,255,255,1);
    border-radius:7px;
    border:1px solid rgba(230,230,237,1);
}
.unselectable {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    line-height: 200%;
}
</style>
