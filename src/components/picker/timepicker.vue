<template>
    <mt-popup v-model="visible" position="bottom" class="mint-datetime">
      <mt-picker
        :slots="slots"
        @change="onValuesChange" 
        :visibleItemCount="7"
        ref="picker"
        show-toolbar>
        <span class="mint-datetime-action mint-datetime-cancel" @click="visible = false;$emit('cancel')">{{ cancelText }}</span>
        <span class="mint-datetime-action mint-datetime-confirm" @click="confirm">{{ confirmText }}</span>      
      </mt-picker>
    </mt-popup>
</template>

<script>
  import { Popup,Picker } from 'mint-ui';

  export default {
    methods: {
      open(){
        this.openPicker();
      },
      close(){
        this.closePicker();
      },     
      openPicker(){
        this.visible = true;
        this.setCurrentValue(this.currentValue);
      },
      closePicker(){
        this.visible = false;
      },
      FillPrefixZero(str) {
          return (str + "").replace(/(\d+)/g, function (a, b) {
              return b.length == 1 ? "0" + b : b;
          });
      },
      onValuesChange(picker, values) {
        if (this.firstSet) {
          this.currentValue = this.FillPrefixZero(values[0])+this.slots[1].content+this.FillPrefixZero(values[1]);
          this.$emit('input',this.currentValue);
        }else{
          this.firstSet = true;
        }
      },
      confirm() {
        this.visible = false;
        this.$emit('confirm', this.currentValue);
      },
      setSlotsByValues(values) {
        this.$refs.picker.setSlotValue(0, values[0]);
        this.$refs.picker.setSlotValue(1, values[1]);
        [].forEach.call(this.$refs.picker.$children, child => child.doOnValueChange());
      }, 
      setCurrentValue(val){
        let val1 = val.substring(0,2);
        let val2 = val.substring(3,5); 
        if (val2!=='00' && val2 !== '30') {
          val2 = '00';
        }
        this.setSlotsByValues([val1,val2]);
      },
      filterTimeValue(val){
        let val1 = val.substring(0,2) === undefined ? '00' : val.substring(0,2);
        let val2 = val.substring(3,5) === undefined ? '00' :val.substring(3,5); 
        if (val2!=='00' && val2 !== '30') {
          val2 = '00';
        }   
        return val1+':'+val2;
      }           
    },
    mounted(){
      this.currentValue = this.value ? this.filterTimeValue(this.value) :'00:00';
      this.setCurrentValue(this.currentValue);
    },
    watch: {
      value:{
        handler(val) {
          this.filterTimeValue(val);
          this.currentValue = val;
        }
      }
    },
    props: {
      value: { // 必须要使用value
        type:String,
　　　　default: '00:00'
　　　},
      leftArr: {
        type: Array,
        default(){
          return ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
        } 
      },
      rightArr:{
        type:Array,
        default(){
          return ['00','30']; 
        }
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      confirmText: {
        type: String,
        default: '确定'
      }     
    },
    data() {
      return {
        visible:false,
        currentValue:'',
        firstSet:false,
        slots: [
          {
            flex:1,
            values:this.leftArr
          }, {
            divider: true,
            content: ':'
          }, {
            flex:1,
            values: this.rightArr
          }
        ]
      }
    }
  }
</script>
