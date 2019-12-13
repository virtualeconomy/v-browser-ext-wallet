<template>
    <div class="confirm-back-up">
        <div class="back">
            <img class = "back-icon" src="../../../static/icons/ic_back.png"/>
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
import seedLib from '../../utils/seed.js'
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
            wallet: state => state.wallet
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
    width: 480px;
    position: relative;
    display: block;
    top: 24px;
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
    height:18px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:18px;
    margin-bottom: 48px;
}
.wordpad {
    width:480px;
    min-height: 176px;
    background:rgba(255,255,255,1);
    border-radius:6px;
    border:1px solid rgba(230,230,237,1);
    line-height: 335%;
    padding: 20px 22px;
    margin-bottom: 20px;
}
.unselectable {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.word {
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:19px;
    letter-spacing: 0;
    padding: 7px 20px;
    height:36px;
}
.word-btn {
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:19px;
    margin-top: 12px;
    height: 36px;
    letter-spacing: 0;
    border-radius: 4px;
    border:1px solid rgba(230,230,237,1);
}
.wordarea {
    text-align: center;
}
.untap {
    background:rgba(255,255,255,1);
}
.tap {
    opacity: 1;
    color:rgba(255,255,255,1);
    background:rgba(50,50,51,1);
}
.input-height {
    width: 100%;
    margin-top: 48px;
    height: 44px;
    font-size:16px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:19px;
}
.error-message {
    width: 100%;
    min-height: 40px;
    font-size: 100%;
    color: red;
    margin-top: 20px;
}
</style>
