import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

const Colors = () => import('@/views/theme/Colors')

const Charts = () => import('@/views/charts/Charts')



// Views - Pages

const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'theme',
          redirect: '/theme/colors',
          name: 'Theme',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'colors',
              name: 'Colors',
              component: Colors
            },
          ]
        },
        {
          path: '/pages',
          redirect: '/pages/404',
          name: 'Pages',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'login',
              name: 'Login',
              component: Login
            },
            {
              path: 'register',
              name: 'Register',
              component: Register
            }
          ]
        }
      ] 
    }
  ]
}

