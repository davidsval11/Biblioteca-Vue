import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')
const Books = () => import('@/views/library/Books')
const Loan = () => import('@/views/loan/Loan')
const Reader = () => import('@/views/library/Reader')
const Colors = () => import('@/views/theme/Colors')

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
          path: '/library',
          redirect: '/library/Books',
          name: 'Library',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'books',
              name: 'books',
              component: Books
            },
            {
              path: 'reader',
              name: 'reader',
              component: Reader
            }
          ]
        },
        {
          path: '/loan',
          redirect: '/lona/Loan',
          name: 'Library',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'loan',
              name: 'loan',
              component: Loan
            }
          ]
        }
      ] 
    }
  ]
}

