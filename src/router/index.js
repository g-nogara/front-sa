import Vue from 'vue'
import Router from 'vue-router'

import Register from '../components/Register'
import Validate from '../components/Validate'
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(Router)

const routes = [
  {
    name: 'register',
    path: '/register',
    component: Register
  },
  {
    name: 'validate',
    path: '/validate',
    component: Validate
  }, 
  {
    name: 'login',
    path: '/login',
    component: Login
  },
  {
    name: 'home',
    path: '/home',
    component: Home
  }
]

const router = new Router({ routes })

export default router