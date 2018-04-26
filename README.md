# mobile-vue-datetimepicker

> Vue.js 移动端滚动日期时间范围组件

<a href="https://github.com/ZTrainWilliams/Vue-DateTimePicker" target="_blank">
    <img src="https://github.com/ZTrainWilliams/Vue-DateTimePicker/tree/master/src/assets/img/1.jpg" alt="默认选择前"/>
</a>
<a href="https://github.com/ZTrainWilliams/Vue-DateTimePicker" target="_blank">
    <img src="https://github.com/ZTrainWilliams/Vue-DateTimePicker/tree/master/src/assets/img/2.jpg" alt="日期选择"/>
</a>
<a href="https://github.com/ZTrainWilliams/Vue-DateTimePicker" target="_blank">
    <img src="https://github.com/ZTrainWilliams/Vue-DateTimePicker/tree/master/src/assets/img/3.jpg" alt="时间选择"/>
</a>
<!-- ![ZTrain](https://github.com/ZTrainWilliams/Vue-DateTimePicker/tree/master/src/assets/img/1.jpg "默认选择前")
![ZTrain](https://github.com/ZTrainWilliams/Vue-DateTimePicker/tree/master/src/assets/img/2.jpg "日期选择")
![ZTrain](https://github.com/ZTrainWilliams/Vue-DateTimePicker/tree/master/src/assets/img/3.jpg "时间选择") -->

```vue
	<rangeTimePicker rangeType="day" :data="{startTitle:'开始时间',endTitle:'结束时间'}" v-model="startTimeValue0"></rangeTimePicker>
```

## 模式(Available mode)
* day : 单选
* date : 日期范围
* datetime : 日期时间范围
* datetimeSpan : 日期时间(["00","30"])范围

------------------------------------
rangeType		|	说明
--------------- | ------------
day 			| 	单选
date 			| 	日期范围
datetime 		| 	日期时间范围
datetimeSpan 	| 	日期时间(["00","30"])范围	

## 不足(insufficient)
*向上滚动容易有抖动，向下滚动过快不够流程
*时间选择未提供范围时间模式

## 依赖(dependent on)
* mint-ui -> datetime-picker 、 picker

## 复用(multiplex)
* timepicker 由mint-ui -> picker 组装成，实现["00","30"]的选择
* calendar （核心）可单独拆解使用

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

```
###借鉴
	[https://github.com/jinzhe/vue-calendar](https://github.com/jinzhe/vue-calendar "组件编写借鉴基础")
	