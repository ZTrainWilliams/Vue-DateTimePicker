<template>
  <div calss="main">
    <headerComponent :props="{title:'时间控件'}"></headerComponent>
      <rangeTimePicker rangeType="day" :data="{startTitle:'外出时间',endTitle:'外出时间'}" v-model="startTimeValue0"></rangeTimePicker>
      <br/>
      <rangeTimePicker rangeType="date" :data="{startTitle:'开始时间',endTitle:'结束时间'}" v-model="startTimeValue1"></rangeTimePicker>
      <br/>
      <rangeTimePicker rangeType="datetime" :data="{startTitle:'开始时间',endTitle:'结束时间'}" v-model="startTimeValue2"></rangeTimePicker><br/>
      <rangeTimePicker rangeType="datetimeSpan" :data="{startTitle:'开始时间',endTitle:'结束时间'}" v-model="startTimeValue3"></rangeTimePicker>
    </div>
  </div>
</template>
<script>
  import headerComponent from '../components/header/header.vue'
  import rangeTimePicker from '../components/rangetimepicker/rangetimepicker.vue'

  export default {
    data() {
      return {
        startTimeValue0 :'',
        startTimeValue1:{
          "starttime": "",
          "endtime": ""
        },
        startTimeValue2:{
          "starttime": "",
          "endtime": ""
        },
        startTimeValue3:{
          "starttime": "2016-08-17 08:30",
          "endtime": "2016-08-25 17:30"
        }            
      };
    },
    components:{headerComponent,rangeTimePicker},
    methods: {}
  }
</script>
<style type="text/css">
  .main{
    font-size: 16px;
  }
  .item_t{
    padding:0 0.186667rem;
    font-size:0.186667rem;
    color:#999;
    height:0.346667rem;
    line-height: 0.346667rem;
    display: flex;
    justify-content: space-between;
  }
  .item_t span:nth-child(2){
    text-align: right;
  }
  .item_t .close{
    color:red;
  }
  .item{
    font-size:0.213333rem;    
    line-height:0.596667rem;
    color:#333;
    overflow: hidden;
    display:flex;
    opacity:1;
    padding:0 0 0 0.186667rem;
    background-color: #fff  ; 
  }
  .item_padding{
    padding:0;
  }
  .item_main .item:last-child>label , .item .borderNone{
    border:0;
  }
  .item>label{
    width: 100%;
    display: flex;
    border-bottom:1px solid #EDEDED;
  }
  .item label:empty {
    border:0;
  }
  .item>label:nth-child(2),.item>label select{
    flex-grow: 1;
  }
  .item>label>input ,.item>label textarea{
    flex-grow: 1;
  } 
  .item p{
    width:1.333333rem; 
  }
  .item>label>p{
    position: relative;
    font-size: 0.2rem;
    line-height: 0.3rem;
      padding: 0.16rem 0;
      box-sizing: border-box;
  }
  .item>label>p>span{
    display: block;
    width:0.16rem;
    position: absolute;
    left: -0.16rem;
    top:0.04rem;
    color:#FE3824;
    font-size:0.24rem;
    line-height: 0.346667rem;
    height: 0.346667rem;
    padding:0.133333rem 0;
    vertical-align:center;
  }
  .item>label input{
    border:0;
    font-size:0.213333rem;
    line-height: 0.32rem;
    padding: 0.146667rem 0;
    word-wrap:break-word; 
    word-break:break-all; 
    overflow: hidden;
  }
  .item>label .bgcolor8{
    background-color: rgba(239,239,244,0.5);
  }
  .item>label textarea{
    font-size:0.213333rem;
    margin: 0.16rem 0;
    line-height: 0.293333rem;
    padding-right: 0.053333rem;
  }
  .item>label a{
    font-size:0.396667rem;
    color:#969494;
    line-height: 0.576667rem;
    display: flex;
      align-items: center
  }
  .item>label>span{
    margin-right:0.16rem;
    color:#969494;
  }
  .from_main .item>div>p{
    width:2.8rem;
    font-size: 0.186667rem;
    line-height: 0.24rem;
    color:#ccc;
  }
  .item .item_radio{
    display: flex;
    flex-wrap: wrap;
    padding:0.133333rem 0 0 0;
  }
</style>
