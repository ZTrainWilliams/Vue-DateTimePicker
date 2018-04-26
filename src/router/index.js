import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import TestComponent from '../page/textList.vue'

export default new Router({
	routes: [
		{
			path: '/',
			name: 'test',
			component: TestComponent,
			meta: {
	            title: '测试页',
	        },			
		}
	]
})
