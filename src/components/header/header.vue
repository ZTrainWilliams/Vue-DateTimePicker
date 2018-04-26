<template>
	<div class="header">
		<div class="header_l">
			<a v-if="props.a" class="iconfont icon-jiantou-copy" @touchstart.prevent.stop="goBack"></a>
		</div>
		<p>{{props.title}}</p>
		<div class="header_r"></div>		
	</div>	
</template>

<script type="text/javascript">
	import './header.css'	

	export default {
		data(){
			return{}
		},
		props:['props'],		
		methods:{
			goBack(){
				this.$router.go(-1);
			}
		}
	}
</script>