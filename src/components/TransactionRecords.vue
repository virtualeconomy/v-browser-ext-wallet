<template>
    <div class="records">
        <div class="his-pane">
            <span class="his-txt">History</span>
            <span class="exp-txt">View on Explorer</span>
            <img class="btn-exp" src="../../static/icons/ic_arrow_right@3x.png">
        </div>
        <transaction-record class="transaction-record"></transaction-record>
    </div>
</template>

<script>
import TransactionRecord from './TransactionRecord.vue'
export default {
    name: "TransactionRecords",
    components: {
        TransactionRecord
    }
}
</script>

<style>
.records {
    background:rgba(255,255,255,1);
    border:1px solid rgba(240,240,245,1);
}
.his-pane {
    width:328px;
    height:48px;
    border:1px solid rgba(240,240,245,1);
}
.his-txt {
    display:inline-block;
    margin-left: 12px;
    margin-top: 14px;
    width:58px;
    height:19px;
    font-size:16px;
    font-family:SFProText-Semibold,SFProText;
    font-weight:600;
    color:rgba(50,50,51,1);
    line-height:19px;
}
.exp-txt {
    display:inline-block;
    margin-left: 134px;
    margin-top: 17px;
    width:98px;
    height:14px;
    font-size:12px;
    font-family:SFProText-Medium,SFProText;
    font-weight:500;
    color:rgba(169,169,176,1);
    line-height:14px;
}
.btn-exp {
    display:inline-block;
    width:6px;
    height:10px;
}
.transaction-record {
    z-index:1000;
    width:328px;
    height:64px;
}
.btn {
    width:6px;
    height:10px;
}
</style>
