import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Buycar from '@//components/buycar'
import Home from '@//components/home'
import Learn from '@/components/learnbuycar'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/buycar',
      name: 'burcar',
      component: Buycar
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },    
    {
      path: '/learn',
      name: 'learn',
      component: Learn
    },   
  ]
})
