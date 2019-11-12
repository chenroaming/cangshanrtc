import Vue, { AsyncComponent } from 'vue'
import VueRouter, { Location, Route, RouteConfig } from 'vue-router'
import { makeHot, reload } from '../utils/hot-reload'
import store from '../store/index'

const loginPage = () => import('../views/LoginPage').then(({ LoginPage }) => LoginPage)
const roomPage = () => import('../views/RoomPage').then(({ RoomPage }) => RoomPage)
const recordRoom = () => import('../views/RecordRoom').then(({ RecordRoom }) => RecordRoom)
// const clerkRoom = () => import('../views/ClerkRoom').then(({ ClerkRoom }) => ClerkRoom)
// const faceCheck = () => import('../components/FaceCheck').then(({ FaceCheck }) => FaceCheck)
if (process.env.ENV === 'development' && module.hot) {
  makeHot('../views/LoginPage', loginPage, module.hot.accept('../views/LoginPage', () => reload('../views/LoginPage', (require('../views/LoginPage') as any).LoginPage)))
  makeHot('../views/RoomPage', roomPage, module.hot.accept('../views/RoomPage', () => reload('../views/RoomPage', (require('../views/RoomPage') as any).RoomPage)))
  makeHot('../views/RecordRoom', recordRoom, module.hot.accept('../views/RecordRoom', () => reload('../views/RecordRoom', (require('../views/RecordRoom') as any).RecordRoom)))
  // makeHot('../views/ClerkRoom', clerkRoom, module.hot.accept('../views/ClerkRoom', () => reload('../views/ClerkRoom', (require('../views/ClerkRoom') as any).ClerkRoom)))
  // makeHot('../components/FaceCheck', faceCheck, module.hot.accept('../components/FaceCheck', () => reload('../components/FaceCheck', (require('../components/FaceCheck') as any).FaceCheck)))
}

Vue.use(VueRouter)

export const createRoutes: () => RouteConfig[] = () => [
  {
    name: 'loginPage',
    path: '/',
    component: loginPage
  },
  {
    name: 'roomPage',
    path: '/roomPage',
    component: roomPage
  },
  {
    name: 'recordRoom',
    path: '/recordRoom',
    component: recordRoom
  },
  // {
  //   name: 'faceCheck',
  //   path: '/faceCheck',
  //   component: faceCheck
  // }
]

export const router = new VueRouter({ mode: 'hash', routes: createRoutes() })

// router.beforeEach((to, from, next) => {
//   if (to.name === 'loginPage') {
//     store.dispatch('getUserInfo')
//     next()
//   }
//   if (to.name !== 'loginPage' && !store.getters.getLoginState) {
//     next({
//       name: 'loginPage'
//     })
//   } else {
//     next()
//   }
// })
