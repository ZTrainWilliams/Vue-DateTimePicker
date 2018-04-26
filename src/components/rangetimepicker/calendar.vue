<template>
    <div class="calendar" ref="calendar" @scroll="scrollTop">
        <div v-for="(value , k) in dates" :key="k">         
            <table cellpadding="5" ref="month">
                <thead>         
                    <tr class="calendar-ym">
                        <td style="font-size: 0.213333rem;" colspan="7">{{value.year +'年'+(Number(value.month)+1)+'月'}}</td>
                    </tr>
                </thead>
                <tr v-for="(day,k1) in value.days" :key="k+k1">
                    <td v-for="(child,k2) in day" 
                    :class="{'selected':child.selected,'disabled':child.disabled,'startdate':child.startdate,'enddate':child.enddate,'today':child.today}"
                     :key="k+k1+k2"
                    @click.stop.prevent="select(k,k1,k2,child.day)">
                        <div>
                        <span :class="{'red':k2==0||k2==6}">{{child.day}}</span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Array,
            default: ()=>[]//多选，拆分begin end两个时间数组放入
        },
        range:{
            type: Boolean,
            default: true
        },
        zero:{
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            year: 0,
            month: 0,
            day: 0,
            rangeBegin:[],
            rangeEnd:[],
            rangeEndTemp:1,//记录rang的选择状态
            dates:[],//总时间集合
            monthRange:4,//初始月份浮动
            lineHeight:48,//一列的高度
            currentPushMonth:'',//当前在增加的月份
            topValue:false,//初始已滚动高度
            scrollType:false,//up down 滚动状态
            calendarTop:null
        }
    },  
    mounted() {
        this.init();
    },
    methods: {
        // 初始化
        init(){
            if (this.value.length>0) {// 没有默认值
                if (this.range) {
                    this.year = parseInt(this.value[0][0]);
                    this.month = parseInt(this.value[0][1]) - 1;
                    this.day = parseInt(this.value[0][2]);

                    let year2 = parseInt(this.value[1][0]);
                    let month2 = parseInt(this.value[1][1]) - 1;
                    let day2 = parseInt(this.value[1][2]);
                    this.rangeBegin = [this.year, this.month,this.day];
                    this.rangeEnd = [year2, month2 , day2];
                }else{
                    this.year = parseInt(this.value[0]);
                    this.month = parseInt(this.value[1]) - 1;
                    this.day = parseInt(this.value[2]); 
                }
            }else{
                let now = new Date();
                this.year = now.getFullYear();
                this.month = now.getMonth();
                this.day = now.getDate();
            }
            this.render(this.year, this.month);
        },
        // 渲染日期
        render(y, m) {
            let beginTime = Number(this.range ? new Date(this.rangeBegin[0], this.rangeBegin[1], this.rangeBegin[2]):new Date(this.value[0], this.value[1], this.value[2]));
            let endTime = Number(this.range ? new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2]):new Date(this.value[0], this.value[1], this.value[2]));         
            if (this.range) {
                let months = Math.ceil((endTime-beginTime)/(1000*3600*24*30)) + 1;
                this.monthRange = months>this.monthRange ? months : this.monthRange;
            }
            let mm = m-this.monthRange;
            function computedPrevMonth(month){//补月
                let val=month ;
                if(month-1<0){
                    val= 12-(-(month-1)%13);
                }else if (month>12) {
                    val = month%13;
                }else{
                    val-- ;
                }      
                return val;
            }   
            function computedPrevYear(year,month){//补年份
                let valu=year
                if(month-1<0){
                    valu--;
                }else if (month>12) {
                    valu = valu + parseInt(month/13);//+1年
                }
                return valu;
            }   
            let Bigday = [];
            for (var l = mm ; l <= m+this.monthRange; l++) {
                let yy = computedPrevYear(y,l+1);
                let mmm = computedPrevMonth(l+1);
                let mmfirstDayOfMonth = new Date(yy, mmm, 1).getDay() ;        //当月第一天  为星期几
                let mmlastDateOfMonth = new Date(yy, mmm + 1, 0).getDate() ;   //下个月最后一天
                let mmlastDayOfLastMonth = new Date(yy, mmm, 0).getDate();     //最后一月的最后一天
                let line = 0,temps = [],nextMonthPushDays = 1;
                for (let i = 1; i <= mmlastDateOfMonth; i++) {
                    let day = new Date(yy, mmm, i).getDay() //返回星期几（0～6）
                    let k;
                    // 第一行
                    if (day == 0) {
                        temps[line] = []
                    } else if (i == 1) {
                        temps[line] = [];
                        k = mmlastDayOfLastMonth - mmfirstDayOfMonth  + 1;
                        for (let j = 0; j < mmfirstDayOfMonth ; j++) {
                            temps[line].push(Object.assign(
                                {day: ''},
                            ))
                            k++;
                        }  
                    }
                    let options = Object.assign(
                        {day: i,selected:false},
                    )
                    if (this.rangeBegin.length > 0) {
                        let stepTime = Number(new Date(yy, mmm, i));
                        if (stepTime == Number( new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate() ) )) {
                            options.today = true;
                        } 
                        if (beginTime <= stepTime && endTime >= stepTime) {
                            options.selected = true
                            if (beginTime == stepTime&&endTime == stepTime) {//处理单选
                                options.startdate = true;
                                options.enddate = true;
                            }else if (beginTime == stepTime) {//赋值开始class
                                options.startdate = true;
                            }else if (endTime == stepTime) {//赋值结束class
                                options.enddate = true;
                            }
                        }
                    }
                    temps[line].push(options);
                    if (day == 6 && i < mmlastDateOfMonth) {// 到周六换行
                        line++
                    }
                }
                Bigday.push({'year':yy,'month':mmm,'days':temps});
            }
            this.dates = Bigday;
            this.$nextTick(()=>{//设置当前位置为已选的开始日期
                this.lineHeight = document.getElementsByClassName('startdate')[0].clientHeight || 48 ;//一行rem=>(50px)
                this.$refs.calendar.scrollTop = this.currentScrollTop('start');// 一行50px，一个月6行，12个月
                setTimeout(()=>{
                    this.topValue = this.$refs.calendar.scrollTop;
                },0)
            });
        },
        //计算滚动将加入的月份
        pushMonth(type,dates){
            this.currentPushMonth = false;
            let mmm , yy = dates.year ;
            if (type === 'up') {
                mmm = dates.month-1;
                if (mmm === -1) {
                    mmm = 11;
                    yy -= 1;
                }          
            }else if(type === 'down') {
                mmm = dates.month+1;
                if (mmm === 12) {
                    mmm = 0;
                    yy += 1;
                }               
            }      
            let mmfirstDayOfMonth = new Date(yy, mmm, 1).getDay();         //当月第一天  为星期几
            let mmlastDateOfMonth = new Date(yy, mmm + 1, 0).getDate();    //下个月最后一天
            let mmlastDayOfLastMonth = new Date(yy, mmm, 0).getDate();     //最后一月的最后一天
            let line = 0,temps = [],nextMonthPushDays = 1;
            for (let i = 1; i <= mmlastDateOfMonth; i++) {
                let day = new Date(yy, mmm, i).getDay() ;//返回星期几（0～6）
                let k;
                // 第一行
                if (day == 0) {
                    temps[line] = []
                } else if (i == 1) {
                    temps[line] = []
                    k = mmlastDayOfLastMonth - mmfirstDayOfMonth  + 1;
                    for (let j = 0; j < mmfirstDayOfMonth ; j++) {
                        temps[line].push(Object.assign(
                            {day: ''},
                        ))
                        k++;
                    }  
                } 
                let options = Object.assign({day: i,selected:false},)  
                temps[line].push(options)
                if (day == 6 && i < mmlastDateOfMonth) {// 到周六换行
                    line++
                }
            }
            setTimeout(()=>{
                this.currentPushMonth = mmm;
            },300);
            return {'year':yy,'month':mmm,'days':temps};
        },
        scrollTop(event){
            if (this.topValue !== false) {//记录滚动动作向上or向下
                var top = 0;  
                top = event.target.scrollTop;
                if(top <= this.topValue){
                    this.scrollType = 'up';
                    this.currentPushMonth = this.dates[0].month;
                }else{
                    this.scrollType = 'down';
                    this.currentPushMonth = this.dates[this.dates.length-1].month;
                }  
                setTimeout(()=>{this.topValue=top;},0);

                let scrollHeight = event.target.scrollHeight;
                let scrollTop = event.target.scrollTop;
                let lineHeight = this.lineHeight ;
                let bHeight = this.lineHeight*16;
                if (scrollTop <= bHeight && this.scrollType === 'up') {
                    var dates = this.dates[0];
                    if (this.currentPushMonth === dates.month) {
                        let unshiftDates = this.pushMonth('up',dates);
                        this.dates.unshift(unshiftDates);
                        this.$el.scrollTop = unshiftDates.days.length*this.lineHeight + event.target.scrollTop;
                    }
                }else if((scrollHeight-scrollTop) <= bHeight && this.scrollType === 'down'){
                    var dates = this.dates[this.dates.length-1];
                    if (this.currentPushMonth === dates.month){
                        this.dates.push(this.pushMonth('down',dates));
                    }              
                }
            }
        },
        // 选中日期
        select(k,k1,k2,day) {
            if (!day) {return false;}
                // 日期范围
            if (this.range) {
                if (this.rangeBegin.length === 0 || this.rangeEndTemp !== 0) {
                    this.rangeBegin = [this.dates[k].year, this.dates[k].month,this.dates[k].days[k1][k2].day];
                    this.rangeEnd = [this.dates[k].year, this.dates[k].month, this.dates[k].days[k1][k2].day];
                    this.rangeEndTemp = 0;
                    this.clearInt(k,k1,k2);              
                    this.$emit('selectBegin',this.formatDate(this.rangeBegin),this.formatDate(this.rangeEnd));//点击开始也回调显示
                } else {
                    this.rangeEnd = [this.dates[k].year, this.dates[k].month,this.dates[k].days[k1][k2].day];
                    this.rangeEndTemp = 1;
                    // 判断结束日期小于开始日期则自动颠倒过来
                    if (+new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2]) < +new Date(this.rangeBegin[0], this.rangeBegin[1], this.rangeBegin[2])) {
                        let rangeBeginTemp = this.cloneObj(this.rangeBegin);//开始结束时间转换
                        this.rangeBegin = this.rangeEnd;
                        this.rangeEnd = rangeBeginTemp;
                    }
                    let beginTime = Number(new Date(this.rangeBegin[0], this.rangeBegin[1], this.rangeBegin[2]));
                    let endTime = Number(new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2]));
                    this.dates.forEach((v, l)=>{
                        v.days.forEach((vv, m)=>{
                            vv.forEach((vvv, n)=>{
                                if (vvv.selected) {vvv.startdate = vvv.enddate = vvv.selected = false;}
                                if (!!vvv.day) {
                                   let stepTime = Number(new Date(v.year, v.month, vvv.day));  
                                    if (beginTime <= stepTime && endTime >= stepTime) {
                                        vvv.selected = true;
                                        if (beginTime === stepTime) {//赋值开始class
                                            vvv.startdate = true;
                                        }else if (endTime === stepTime) {//赋值结束class
                                            vvv.enddate = true;
                                        }
                                    }
                                }
                            });                         
                        });
                    });
                    this.$emit('select',this.formatDate(this.rangeBegin),this.formatDate(this.rangeEnd));
                }
            } else {
                this.clearInt(k,k1,k2);
                this.$emit('selectBegin',this.formatDate([this.dates[k].year,this.dates[k].month,this.dates[k].days[k1][k2].day]));
            }
        },
        //计算 当前top
        currentScrollTop(seType){
            let scrollTop = 0;
            let lineHeight = this.lineHeight;
            let dates = this.dates;
            let range = [];
            if (seType == 'start') {
                range = this.rangeBegin;
            }else if(seType == 'end'){
                range = this.rangeEnd;
            }
            for (var i = 0; i < dates.length; i++) {
                if (dates[i].year === range[0] && dates[i].month === range[1]) {
                    let calendarTop = this.calendarTop || this.$refs.calendar.offsetTop ;
                    return this.$refs.month[i].offsetTop - calendarTop;
                }
            }
        }, 
        // 日期补零
        zeroPad(n){
            return String(n < 10 ? '0' + n : n);
        },
        //格式化日期值
        formatDate(arr){
            let a = [];
            arr.forEach((v,k)=>{
                if(k==1){v=v+1;}
                a.push(this.zero ? this.zeroPad(v) : v);
            });
            return a;                
        },
        cloneObj(obj){//深拷贝
            var str, newobj = obj.constructor === Array ? [] : {};
            if(typeof obj !== 'object'){
                return;
            } else if(window.JSON){
                str = JSON.stringify(obj), //系列化对象
                newobj = JSON.parse(str); //还原
            } else {
                for(var i in obj){
                    newobj[i] = typeof obj[i] === 'object' ? 
                    this.cloneObj(obj[i]) : obj[i]; 
                }
            }
            return newobj;
        },
        clearInt(k,k1,k2){
            this.dates.forEach(v=>{
                v.days.forEach(vv=>{
                    vv.forEach(vvv=>{
                       vvv.startdate = vvv.enddate = vvv.selected = false;
                    });
                });
            });              
            ['selected','startdate','enddate'].forEach(item=>{
                this.dates[k].days[k1][k2][item] = true;
            });            
        }
    }
}

</script>

<style scoped>
.calendar {
    margin:auto;
    width: 100%;
    min-width:4.0rem;
    overflow-x:hidden;
    background: #fff;
    font-family: "PingFang SC","Hiragino Sans GB","STHeiti","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
    user-select:none;
    overflow:auto;
    -webkit-overflow-scrolling: touch;
    flex: 1;
}
 
.calendar table {
    clear: both;
    width: 100%;
    border-collapse: collapse;
    color: #444444;
}
.calendar table .calendar-ym{
    font-size:0.24rem ;
}
.calendar tr{
    box-sizing: border-box;
    overflow:hidden;
    height:0.666667rem; 
}
.calendar td {
    padding:0px 0;
    width: 14.28571429%;
    height:0.586667rem;
    text-align: center;
    vertical-align: middle;
    font-size:0.186667rem;
    line-height: 125%;
    cursor: pointer;
    position: relative;
    vertical-align: top;
    -webkit-tap-highlight-color:rgba(255,0,0,0);
}
.calendar td.week{
    font-size:0.133333rem;
    pointer-events:none !important;
    cursor: default !important;    
}
.calendar td.disabled {
    color: #ccc;
    pointer-events:none !important;
    cursor: default !important;
}
.calendar td div{
    display: block;
    height: 0.666667rem;
    width: 0.666667rem; 
    line-height: 0.666667rem;
    margin:auto;
}
.calendar td.disabled div{
    height: 0.666667rem;
    width: 0.666667rem; 
    line-height: 0.666667rem;   
    color: #ccc;
    position: relative;
}
.calendar td span{
    display:block;
    font-size: 0.213333rem;
    margin: 0px auto;
    border-radius: 50%;
    height: 0.666667rem;
    width: 0.666667rem;
    line-height:0.773333rem; 
    position:relative;
    z-index: 2;
}
.calendar td:not(.disabled) span.red{
    color:#999;
}
.calendar td:not(.disabled).startdate span.red{
    color:#fff;
}
.calendar .startdate:only-of-type span{
    left:0;
}
.calendar td.startdate span{
    /*兼容父级div 多出来的边*/
    position: relative;
}
.calendar td.enddate div span,
.calendar td.startdate div span,
.calendar td.enddate span.red,
.calendar td.startdatespan.red {
    background-color: rgb(85,161,249);
    color:#fff;
}
.calendar td.enddate span:before{
    content:'结束';
    position: absolute;
    top:10%;
    left:30%;
    font-size:0.133333rem;
    line-height:0.186667rem;      
}
.calendar td.startdate span:before{
    content:'开始';
    position: absolute;
    top:10%;
    left:30%;
    font-size:0.133333rem;
    line-height:0.186667rem;
}
.calendar td.enddate div:before{
    content:'';
    position: absolute;
    top:0%;
    right:0%;
    height:100%;
    width:50%; 
    background:#fff;
    z-index: 1;  
}
.calendar td.startdate div:after{
    content:'';
    position: absolute;
    top:0%;
    left:0%;
    height:100%;
    width:50%;    
    background:#fff;
    z-index: 1;
}
.calendar tr td.startdate div{
    border-top-left-radius:50%; 
    border-bottom-left-radius:50%; 
}
.calendar tr td.enddate div{
    border-top-right-radius:50%;  
    border-bottom-right-radius:50%;
}
.calendar tr td.startdate.enddate div{
    height: 0.666667rem;
    width: 0.666667rem;  
}
.calendar td.selected div{
    width:100%;
    height:100%;    
    background-color: rgba(85,161,249,0.4);
}
.calendar thead td {
  text-transform: uppercase;
  height:0.4rem;
  vertical-align: middle;
}
</style>
