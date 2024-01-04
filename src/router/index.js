import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Frame',
    component: () => import('../components/Frame'),
    redirect: 'home',
    children:[
      {
        path: '/introduction',
        name: 'introduction',
        component: () => import(/* webpackChunkName: "about" */ '../views/introduction.vue')
      },
      {
        path: '/citizenScience',
        name: 'citizenScience',
        component: () => import('../views/Citizen Science')
      },
      {
        path: '/hoopla',
        name: 'Hoopla',
        component: () => import('../views/Hoopla')
      },
      {
        path: '/instruction',
        name: 'instruction',
        component: () => import('../views/instruction')
      },
      {
        path: '/teamAndTouch',
        name: 'TeamAndTouch',
        component: () => import('../views/TeamAndTouch')
      },
      {
        path: '/home',
        name: 'HomeView',
        component: () => import('../views/HomeView'),
      }
    ]
  },
  {
    path: '*',
    redirect: '/home'
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
