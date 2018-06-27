import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import startPad from './pads/startPad'

Vue.use(Router)

export default new Router({
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
      path: '/b/:iboardId',
      component: Home,
      props: true
    }
  ]
})
