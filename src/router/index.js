import Vue from 'vue'
import Router from 'vue-router'

import Register from '../components/Register'

Vue.use(Router)

const routes = [
  {
    name: 'register',
    path: '/register',
    component: Register
  }
]

const router = new Router({ routes })

export default router