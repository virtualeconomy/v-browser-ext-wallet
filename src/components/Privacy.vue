<template>
    <b-modal id="privacy"
             lazy
             centered
             hide-footer
             hide-header>
        <div class="back">
            <img class="back-icon" src="../../static/icons/ic_back@2x.png"/>
            <b-btn class="back-link text-decoration-none" variant="link"
                   @click="back">Back</b-btn>
            <button class="close btn-close">
                <img width="12" height="12" src="../../static/icons/ic_close@2x.png">
            </button>
        </div>
        <div class="privacy">
            <p class="p1">Account 1</p>
            <p class="p2">Adasdas..Basda</p>
            <b-form-group class="private-form">
                <label>Private Key</label>
                <b-input-group class="input-t"
                               v-if="true">
                    <b-form-input size="sm"
                                  placeholder="Type your password"
                                  v-model="prvKeyPwd"
                                  @input="hideErr('prvKeyPwdErr')"
                                  type="password"
                                  id="prvKeyPwd">
                    </b-form-input>
                    <b-input-group-append>
                        <b-btn @click="showPriKey"
                               size="sm"
                               variant="link"
                               class="privacy-button text-decoration-none">Show</b-btn>
                    </b-input-group-append>
                </b-input-group>
                <b-input-group class="input-t"
                               v-else>
                    <b-form-input id="priKey"
                                  readonly
                                  size="sm"
                                  v-model="privateKey"
                                  type="text">
                    </b-form-input>
                    <b-input-group-append>
                        <b-btn size="sm"
                               variant="link"
                               class="privacy-button text-decoration-none">Hide</b-btn>
                    </b-input-group-append>
                </b-input-group>
            </b-form-group>
            <b-form-group class="private-form">
                <label>Seed</label>
                <b-input-group class="input-t"
                               v-if="true">
                    <b-form-input size="sm"
                                  placeholder="Type your password"
                                  v-model="prvKeyPwd"
                                  @input="hideErr('prvKeyPwdErr')"
                                  type="password"
                                  id="prvKeyPwd">
                    </b-form-input>
                    <b-input-group-append>
                        <b-btn @click="showPriKey"
                               size="sm"
                               variant="link"
                               class="privacy-button text-decoration-none">Show</b-btn>
                    </b-input-group-append>
                </b-input-group>
                <b-input-group class="input-t"
                               v-else>
                    <b-form-input id="priKey"
                                  readonly
                                  size="sm"
                                  v-model="privateKey"
                                  type="text">
                    </b-form-input>
                    <b-input-group-append>
                        <b-btn size="sm"
                               variant="link"
                               class="privacy-button text-decoration-none">Hide</b-btn>
                    </b-input-group-append>
                </b-input-group>
            </b-form-group>
            <div class="text-area"><p class="p3">Warning: Never disclose this key. Anyone with your private keys can steal any assets help in your account.</p></div>
            <b-row style="margin-top: 20px;margin-bottom: 15px;">
                <b-col class="col-lef">
                    <b-button
                            class="btn-cancel"
                            block
                            variant="light"
                            size="lg"
                            @click="close">Cancel
                    </b-button>
                </b-col>
                <b-col class="col-rit">
                    <b-button
                            block
                            class="btn-confirm"
                            variant="warning"
                            size="lg"
                            :disabled="isSubmitDisabled"
                            @click="createAccount">Confirm
                    </b-button>
                </b-col>
            </b-row>
        </div>
    </b-modal>
</template>

<script>
export default {
    name: "Privacy"
}
</script>

<style scoped>
.close {
    margin-right: 3px;
}
.back {
    height: 40px;
}
.back-icon {
    width: 12px;
    height: 12px;
}
.back-link {
    width: 33px;
    height: 16px;
    font-size: 14px;
    font-family: SFProText-Regular, SFProText;
    font-weight: 400;
    color: rgba(169, 169, 176, 1);
    line-height: 16px;
    padding: 2px 0px;
    margin-bottom: 6px;
}
.privacy {
    text-align: center;
}
.p1 {
    height:24px;
    font-size:20px;
    font-family:SFProDisplay-Medium,SFProDisplay;
    font-weight:500;
    color:rgba(50,50,51,1);
    line-height:24px;
    margin-bottom: 6px;
}
.p2 {
    height:15px;
    font-size:13px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:15px;
    margin-bottom: 22px;
}
.input-t {
    height:56px;
    background:rgba(255,255,255,1);
}
#prvKeyPwd {
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
    height: 56px !important;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:16px;
    border-right: none;
}
#priKey {
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
    height: 56px !important;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:20px;
    border-right: none;
}
.private-form {
    text-align: left;
}
.private-form label {
    height:16px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
    margin-bottom: 12px;
}
.privacy-button {
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(255,136,55,1);
    line-height:16px;
    border-left: none;
}
.text-area {
    height:66px;
    background:rgba(255,245,247,1);
    border-radius:4px;
    padding: 12px;
    text-align: left;
}
.p3 {
    height:42px;
    font-size:12px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(246,0,46,1);
    line-height:14px;
}
.btn-cancel {
    font-size:16px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:19px;
    height:44px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(242,242,247,1);
}
.btn-confirm {
    font-size:16px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:19px;
    height:44px;
    background:rgba(255,136,55,1);
    border-radius:4px;
}
</style>
