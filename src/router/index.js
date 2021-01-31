import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/http/:funId',
    name: 'Http',
    component: () => import('../views/Http.vue'),
    props: true
  },
  {
    path: '/socket/:funId',
    name: 'Socket',
    component: () => import('../views/Socket.vue'),
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
