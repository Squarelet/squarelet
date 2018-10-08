import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import startPad from './pads/startPad'
import store from './store'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: { iboardId: 'defaultBoard' }
    },
    {
      path: '/about',
      name: 'About',
      component: Home,
      props: { iboardId: 'about', startPad: startPad }
    },
    {
      path: '/local/:iboardId',
      component: Home,
      props: true
    },
    {
      path: '/shared/:iboardId',
      component: Home,
      props: function (route) { return { iboardId: route.params['iboardId'], sharedPad: true} }
    }
  ]
})
