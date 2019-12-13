<template>
    <div>
    <div class="save-back-up">
        <div class="back">
            <img class = "back-icon" src="../../../static/icons/ic_back.png"/>
            <b-btn class="back-link text-decoration-none" variant="link"
                   @click="changePage('create')">Back</b-btn>
        </div>
        <p class="p1">Secret Backup Phrase</p>
        <p class="p2">Your secret backup phrase makes it easy to back up and restore your personal account.</p>
        <p class="p3"><span>WARNING:</span> Never disclose your backup phrase. Anyone with this phrase can take your Ether forever.</p>
        <div class="word-container unselectable">
          <template v-for="(word, idx) in wordList">
            <span :key="idx">{{ word }}
            </span>&nbsp;
          </template>
        </div>
        <b-row>
            <b-col class="col-lef">
                <b-button
                        class="btn-remind"
                        block
                        variant="light"
                        size="lg"
                        @click="changePage('success')">Remind me later
                </b-button>
            </b-col>
            <b-col class="col-right">
                <b-button
                        block
                        class="btn-next"
                        variant="warning"
                        size="lg"
                        @click="changePage('confirmBackup')">Next
                </b-button>
            </b-col>
        </b-row>
    </div>
        <div class="tips">
            <p style="font-weight: 600;">Tips:</p>
            <p>Store this phrase in a password manager like 1 Password.</p>
            <p>Write this phrase on a piece of paper and store in a secure location. If you want even more securuty, write it down on multiple pieces of paper and store each in 2-3 different location.</p>
            <p>Memorize this phrase.</p>
            <br>
            <p style="color: rgba(255,136,55,1);margin-top: -8px;">Download this Secret Backup Phrase and Keep it store safety on an extermal encrypted hard drive of storage medium.</p>
        </div>
        <textarea
                v-model="seedPhrase"
                ref="wordsToCopy"
                class="hidden"
                readonly>
        </textarea>
    </diV>
</template>

<script>
import seedLib from '../../utils/seed.js'
import { mapState } from 'vuex'
export default {
    name: "SaveBackup",
    methods: {
        changePage(pageName) {
            this.$emit('show-page', pageName)
        }
    },
    computed: {
        ...mapState({
            wallet: state => state.wallet,
        }),
        secretInfo() {
            if (this.wallet.password) {
                return JSON.parse(
                    seedLib.decryptSeedPhrase(this.wallet.info, this.wallet.password))
            }
        },
        seedPhrase() {
            return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, this.wallet.password)
        },
        wordList() {
            return this.seedPhrase.split(' ')
        }
    }
}
</script>

<style scoped lang="less">
.save-back-up {
    width: 480px;
    position: relative;
    display: block;
    top: 24px;
}
.tips {
    width: 200px;
    position: relative;
    left: 520px;
    top: -405px;
    display: block;
    font-family:SFProText-Semibold,SFProText;
    p {
        font-size:14px;
        font-family:SFProText-Regular,SFProText;
        font-weight:400;
        color:rgba(50,50,51,1);
        line-height:18px;
    }
}
.back {
    height: 40px;
}
.back-icon {
    width: 12px;
    height: 12px;
}
.back-link {
    width:33px;
    height:16px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:19px;
    padding: 0px;
    margin-bottom: 4px;
}
.p1 {
    height:34px;
    font-size:28px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:34px;
    margin-bottom: 12px;
}
.p2 {
    height:36px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:18px;
    margin-bottom: 16px;
}
.p3 {
    width:100%;
    height:36px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:#323233;
    line-height:18px;
    margin-bottom: 48px;
    span {
        color:rgba(255,136,55,1);
    }

}
.word-container {
    padding: 32px 53px;
    background:rgba(255,255,255,1);
    border-radius:6px;
    border:1px solid rgba(230,230,237,1);
    margin-bottom: 88px;
    span {
        height:19px;
        font-size:16px;
        font-family:SFProText-Regular,SFProText;
        font-weight:400;
        color:rgba(50,50,51,1);
        line-height:19px;
    }
}
.unselectable {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    line-height: 200%;
}
.col-lef {
    padding-right: 9px;
}
.col-right {
    padding-left: 9px;
}
.btn-remind {
    font-size:16px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(255,136,55,1);
    line-height:19px;
    width:230px;
    height:44px;
    background:rgba(255,136,55,0);
    border-radius:4px;
    border:1px solid rgba(255,136,55,1);
}
.btn-next {
    font-size:16px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:19px;
    width:230px;
    height:44px;
    background:rgba(255,136,55,1);
    border-radius:5px;
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
</style>
