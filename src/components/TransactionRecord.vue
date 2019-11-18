<template>
    <b-container class="record-unit">
        <b-row>
            <b-col class="record-icon"
                   cols="auto">
                <img src="../../static/icons/ic_sent@3x.png"
                     width="32px"
                     height="32px">
            </b-col>
            <b-col class="record-detail-1"
                   col="auto"
                   align-v="left">
                <b-row>
                    <b-col class="record-type">Send VSYS</b-col>
                </b-row>
                <b-row>
                    <b-col class="record-time">10/21/2019 at 18:32</b-col>
                </b-row>
            </b-col>
            <b-col class="record-detail-2"
                   col="auto"
                   align-v="right">
                <b-row>
                    <b-col class="record-amount">-800 VSYS</b-col>
                </b-row>
                <b-row>
                    <b-col><span class="record-status">CONDIRMED</span></b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    export default {
        name: "TransactionRecord"
    }
</script>

<style>
.record-unit {
    background:rgba(255,255,255,1);
}
.record-icon {
    margin-left: 12px;
    margin-top: 16px;
    display:inline-block;
}
.record-detail-1 {
    height: 64px;
    display:inline-block;
    text-align:left;
    border-bottom:1px solid rgba(240,240,245,1);
}
.record-type {
    margin-left: -15px;
    margin-top: 16px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
}
.record-time {
    margin-left: -15px;
    margin-top: 3px;
    font-size:11px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(169,169,176,1);
    line-height:13px;
    width: 102px;
    margin-right: 0px;
    white-space: nowrap;
}
.record-detail-2 {
    height: 64px;
    text-align:right;
    border-bottom:1px solid rgba(240,240,245,1);
}
.record-amount {
    margin-top: 16px;
    font-size:14px;
    font-family:Roboto-Regular,Roboto;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
}
.record-status {
    margin-top: 3px;
    font-size:10px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(113,145,0,1);
    line-height:12px;
    background-size:69px 16px;
    background:rgba(235,250,215,1);
    border-radius:2px;
    padding: 3px 3px;
}
</style>
