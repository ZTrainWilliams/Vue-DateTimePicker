<template>
	<div class="rangedatetimeBox" @click.stop.prevent="" @select.prevent.stop="" :class="{'pointer_none':disabled}">
		<!-- <div> 时间选择   ui组件标签无法包裹-->
            <mt-datetime-picker
            	v-if="rangeType==='datetime'"
            	@confirm="startTimeConfirm"
            	@cancel="startTimeConfirm"
            	ref="datetimestart"
			    type="time"
			    v-model="startTimeValue">
			</mt-datetime-picker>
			<mt-datetime-picker
				v-if="rangeType==='datetime'"
            	@confirm="endTimeCancel"
            	@cancel="endTimeCancel"
            	ref="datetimeend"
			    type="time"
			    v-model="endTimeValue">
			</mt-datetime-picker>

			<timeSpanPicker 
				v-if="rangeType=='datetimeSpan'"
				@confirm="startTimeConfirm"
		        @cancel="startTimeConfirm"
            	ref="datetimeSpanstart"
			    v-model="startTimeValue">
			</timeSpanPicker>
			<timeSpanPicker
				v-if="rangeType=='datetimeSpan'"
				@confirm="endTimeCancel"
		        @cancel="endTimeCancel"
            	ref="datetimeSpanend"
			    v-model="endTimeValue">
			</timeSpanPicker>
	    <!-- </div>		 -->
		<transition v-if="calendarShow">
			<div class="calendar-dialog">
				<!-- 头部 -->
				<div class="header">
					<div class="header_l">
						<a href="javascript:;" class="iconfont icon-jiantou-copy" @click.prevent="cancel"></a>
					</div>
					<p>日期选择</p>
					<div class="header_r">
						<a href="javascript:;" v-if="rangeType !== 'day'" @click.prevent="finishOut">完成</a>
					</div>
				</div>
		        <!-- 日期范围显示 -->
		        <div class="rangetimeTab" v-if="rangeType !== 'day'">
		        	<div class="tabevent" @click.prevent="TimeShowClick('start')">
		        		<p>{{data.startTitle}}</p>
		        		<p :class="{color5:startTimeShow}"><span>{{startdate}}</span><span v-if="rangeTimeType">{{startTimeValue}}</span></p>
		        	</div>
		        	<div class="rangeDay">{{rangeDays}}天</div>
		        	<div class="tabevent" @click.prevent="TimeShowClick('end')">
						<p>{{data.endTitle}}</p>
		        		<p :class="{color5:endTimeShow}"><span>{{enddate}}</span><span v-if="rangeTimeType">{{endTimeValue}}</span></p>
		        	</div>
		        </div>
		        <!-- 星期title -->
				<ul class="calendar_weekTitle">
					<li v-for="(day,index) in weekArr" :class="{fcolor9:index==0||index==6}" :key="day">{{day}}</li>
				</ul>
				<!-- 日期选择 -->
				<calendar :zero="calendar.zero" :range="calendar.range" :value="calendar.value" @select="calendar.select" @selectBegin="calendar.selectBegin"></calendar>
			    <!-- 底部 开始结束 时间段选择 -->
			    <div class="rangeTime" v-if="rangeTimeType">
			    	<div :class="{color5:startTimeShow}"  @click.prevent="TimeShowClick('start')">
			    		<p>开始时段</p>
			    		<p><span>{{startTimeValue}}</span></p>
			    	</div>
			    	<div :class="{color5:endTimeShow}" @click.prevent="TimeShowClick('end')">
			    		<p>结束时段</p>
			    		<p><span>{{endTimeValue}}</span></p>
			    	</div>
			    </div>
		    </div>
		</transition>
				
		<!-- 输出显示框 -->
		<div class="item">
			<label @click.prevent="inputClick">
				<p><span v-if="required">{{'*'}}</span>{{data.startTitle}}</p>
				<input type="text" :placeholder="'请输入'+data.startTitle+'(必填)'" :dataTitle="data.startTitle" name="startDate" :value="startValue"
				  :required="required" :readonly="readonly"/>
				<a href="javascript:;" class="iconfont icon-menu-right"></a>
			</label>
		</div>
		<div class="item" v-if="rangeType !== 'day'">
			<label @click.prevent="inputClick">
				<p><span v-if="required">{{'*'}}</span>{{data.endTitle}}</p>
				<input type="text" :placeholder="'请输入'+data.endTitle+'(必填)'" :dataTitle="data.endTitle" name="endDate" :value="endValue" :required="required" :readonly="readonly"/>
				<a href="javascript:;" class="iconfont icon-menu-right"></a>
			</label>
		</div>
	</div>
</template>

<script type="text/javascript">
	import calendar from './calendar.vue'
	import timeSpanPicker from '../../components/picker/timepicker.vue'
	import "./rangetimepicker.css"
	import { DatetimePicker } from 'mint-ui'

	export default{		
		components:{calendar,timeSpanPicker},
		props:{
			data :{
				type : Object,
				default : {}
			},
			rangeType:{
				type:String,
				default:'date'
				// 'day' 单天
				// 'datetime' 范围日期+时间
				// datetimeSpan 范围日期+时间（分钟只能选择0分 30分）
			},
			DateValue: {
	        	default:{
					starttime:'',
					endtime:''
	        	}
	        },
	        disabled:{
	        	type:Boolean,
	        	default:false
	        },
	        required:{
	        	type:Boolean,
	        	default:false
	        },
	        readonly:{
				type:Boolean,
	        	default:true
	        }
		},
		model: {
		      prop: 'DateValue',
		      event: 'pushRangeDate'
	    },	
		data(){
			var date = new Date();
			return {
				weekArr:['日','一','二','三','四','五','六'],
				calendarShow:false,
				endTimeShow:false,
				startTimeShow:false,

				startValue:'',//显示的开始日期时间
				startdate:(date.getMonth()+1)+"月"+date.getDate()+"日",//开始日期
				startTimeValue:'08:30',//开始时间
				endValue:'',//显示的结束日期时间
				enddate:(date.getMonth()+1)+"月"+date.getDate()+"日",//结束日期
				endTimeValue:'17:30',//结束时间

				rangeDays:1,//范围天数
	 			calendar:{
	                value:[[date.getFullYear(),date.getMonth()+1,date.getDate()],[date.getFullYear(),date.getMonth()+1,date.getDate()]], //默认日期(当前月份)
	                show:true,
	                zero:true,
	                range:true,
	                selectBegin:(begin,end)=>{//处理显示点击开始日期显示
						this.startValue  = begin.join("-");
						if (this.rangeType === "day") {
							this.$emit('pushRangeDate', this.startValue);
							this.cancel();
						}else{
							this.endValue = end.join("-");
							this.rangeDays = 1;//因为是第一次点击 故永远为 1 天
							this.$emit('pushRangeDays',this.rangeDays);
							this.filterDateValue();
						}
	                },
	                select:(begin,end)=>{
						this.startValue = begin.join("-") ;
						this.endValue = end.join("-");
	                    // 开始与结束的时间天数
						let startTime = new Date(Date.parse(this.startValue)).getTime();     
					    let endTime = new Date(Date.parse(this.endValue)).getTime();
						this.rangeDays = Math.abs((startTime - endTime))/(1000*60*60*24) + 1;
						this.$emit('pushRangeDays', this.rangeDays);
						this.filterDateValue();
	                }
	            }
			}
		},
		computed:{
			rangeTimeType(){
				let type = this.rangeType.indexOf('time') !== -1;
				return type;
			}
		},
		watch:{  
            DateValue:{
                handler(val){
                	if (!val) {return false;}
					if(this.DateValue.starttime && this.DateValue.endtime){
						this.startValue = this.DateValue.starttime;
						this.endValue = this.DateValue.endtime;
						let start = this.startValue.substring(0,10).split('-');
						let end = this.endValue.substring(0,10).split('-');						
						if (this.rangeTimeType) {
							this.startTimeValue = this.filterTime(this.DateValue.starttime.split(' ')[1]);
							this.endTimeValue = this.filterTime(this.DateValue.endtime.split(' ')[1]);
						}
						this.startdate = start[1]+"月"+start[2]+"日";
	                	this.enddate = end[1]+"月"+end[2]+"日";
						this.$set(this.calendar,'value',[start,end]);
					}else if(this.rangeType === 'day') {
						this.startValue = !!val ? val : "";
						this.endValue = !!val ? val : "";
						this.calendar.value = [val.split("-"),val.split("-")] ;
					}
                },  
                deep:true, 
                immediate:true
			}
		},
		methods:{
			cancel(){
				this.calendarShow = false;
			},
			// 完成退出
			finishOut(){
				// this.takeScrolling('from_main','touch');
				this.calendarShow = false;
				this.filterDateValue(true);
				this.$emit('pushRangeDate', this.DateValue);
			},
			filterDateValue(type){
				if (this.rangeTimeType && !type) {
					this.startValue = this.startValue + ' ' + this.startTimeValue;
					this.endValue = this.endValue + ' ' + this.endTimeValue;
				}
				this.$emit('pushRangeDate', {starttime : this.startValue , endtime : this.endValue});			
			},
			filterTime(value){
				let i = value.indexOf(':');
				return value.substring(i-2,i+3);
			},
			// 开始时间取消 、 确定
			startTimeConfirm(){
				this.startTimeShow = false ;
			},
			// 结束时间取消 、 确定
			endTimeCancel(){
				this.endTimeShow = false ;
			},
			TimeShowClick(t){
				if (!this.rangeTimeType) {return false;}
				this[ t + 'TimeShow'] = true;
				t = this.rangeType === 'datetimeSpan' ? 'Span'+t : t;
				this.$refs['datetime' + t].open();
			},
			inputClick(){
				// 进入日期时间选择
				if (!this.disabled) {
					this.calendarShow = true ;
					// this.takeScrolling('from_main','auto');
				}
			},
			takeScrolling(box,scrollingType){//处理 ios scrolling：touch 与 fixed的不兼容
			    if (document.getElementById(box)) {//id
			        document.getElementById(box).style['-webkit-overflow-scrolling'] = scrollingType;   
			    }else{//class
			         document.getElementsByClassName(box)[0].style['-webkit-overflow-scrolling'] = scrollingType;
			    }
			}
		}
	}
</script>
