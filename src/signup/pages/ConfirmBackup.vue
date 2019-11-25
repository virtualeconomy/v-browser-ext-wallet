<template>
    <div class="confirm-back-up">
        <div class="back">
            <img class = "back-icon" src="../../../static/icons/ic_back@2x.png"/>
            <b-btn class="back-link text-decoration-none" variant="link"
                   @click="back">Back</b-btn>
        </div>
        <p class="p1">Confirm your Secret Backup Phrase</p>
        <p class="p2">Please select each phrase in order to make sure it is correct.</p>
        <b-jumbotron class="unselectable wordpad">
          <template v-for="(word, idx) in selectedWords">
            <span :key="idx + word + '-selected'"
                  class="word">{{ word }}</span>&nbsp;
          </template>
        </b-jumbotron>
        <div class="wordarea">
            <template v-for="(word, idx) in wordList">
                <b-button
                        :key="idx"
                        v-if="tagFlag[idx]"
                        :size="'sm'"
                        class="unselectable word-btn untap"
                        @click='tapWord(idx)'>
                    {{ word }}
                </b-button>
                <b-button
                        :key="idx"
                        v-else
                        :variant="dark"
                        :size="'sm'"
                        class="unselectable word-btn tap"
                        :disabled="true">
                    {{ word }}
                </b-button>
                &nbsp;
            </template>
        </div>
        <div v-show="errorMsg"
             class="error-message">{{ errorMsg }}
        </div>
        <b-button
                class="input-height"
                v-if="isContinueDisable"
                :variant="'warning'"
                :size="'lg'"
                :block="true"
                @click="clearWords">
            clear and try again
        </b-button>
        <b-button
                v-if="!isContinueDisable"
                class="input-height"
                :variant="'warning'"
                :size="'lg'"
                :block=true
                @click="confirm">
            Confirm
        </b-button>
    </div>

</template>

<script>
import seedLib from '../../libs/seed'
import { mapState } from 'vuex'
import Vue from 'vue'
export default {
    name: "ConfirmBackup",
    data: function() {
        return {
            selectedWords: [],
            tagFlag: [],
            isContinueDisable: true,
            errorMsg: void 0
        }
    },
    mounted() {
        this.tagFlag = Array(this.wordList.length).fill(true)
    },
    computed: {
        ...mapState({
            localWallet: state => state.wallet.localWallet,
        }),
        secretInfo() {
            return JSON.parse(
                seedLib.decryptSeedPhrase(this.localWallet.info, Vue.ls.get('pwd')))
        },
        seedPhrase() {
            return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, Vue.ls.get('pwd'))
        },
        wordList() {
            return this.seedPhrase.split(' ').sort(function(a, b) { return 0.5 - Math.random() })
        }
    },
    methods: {
        back() {
            this.$emit('show-page', 'saveBackup')
        },
        tapWord(idx) {
            Vue.set(this.tagFlag, idx, false)
            this.selectedWords.push(this.wordList[idx])
            if (this.wordList.length === this.selectedWords.length) {
                this.checkWords()
            }
        },
        clearWords() {
            this.tagFlag = Array(this.wordList.length).fill(true)
            this.selectedWords = []
            this.errorMsg = void 0
        },
        checkWords() {
            const phrases = this.selectedWords.join(' ')
            if (phrases === this.seedPhrase) {
                this.isContinueDisable = false
            } else {
                this.errorMsg = 'Sorry, words are not in the right order, please click the clear button and tap the words in right order.'
            }
        },
        confirm() {
            this.$emit('show-page', 'success')
        }
    }
}
</script>

<style scoped>
.confirm-back-up {
    width: 560px;
    position: relative;
    display: block;
    top: 28px;
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
    font-size:32px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:40px;
}
.p2 {
    height:21px;
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:21px;
}
.wordpad {
    margin-top: 46px;
    width:560px;
    min-height: 205px;
    background:rgba(255,255,255,1);
    border-radius:7px;
    border:1px solid rgba(230,230,237,1);
    line-height: 335%;
    padding: 26px 26px;
}
.unselectable {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.word {
    margin-right: 6px;
    background:rgba(255,255,255,1);
    border-radius:5px;
    border:1px solid rgba(230,230,237,1);
    font-size:19px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:22px;
    letter-spacing: 0;
    padding: 9px 28px;
}
.word-btn {
    font-size:19px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:22px;
    margin-top: 10px;
    height: 36px;
    letter-spacing: 0;
}
.wordarea {
    text-align: center;
}
.untap {
    width:117px;
    height:42px;
    background:rgba(255,255,255,1);
    border-radius:5px;
    border:1px solid rgba(230,230,237,1);
}
.tap {
    opacity: 1;
    color:rgba(255,255,255,1);
    width:117px;
    height:42px;
    background:rgba(50,50,51,1);
    border-radius:5px;
}
.input-height {
    width: 100%;
    margin-top: 26px;
    height: 51px;
}
.error-message {
    width: 100%;
    min-height: 40px;
    font-size: 100%;
    color: red;
    margin-top: 20px;
}
</style>
