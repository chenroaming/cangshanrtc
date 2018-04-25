import { Commit } from 'vuex'
import store from '../index'
import types from '../types'
import { getRoomToken } from '../../api/case'
import Vue from 'vue'
import Sweetalert2 from 'sweetalert2'

interface State {
  roomToken: string,
  userId: string
}

// initial state
const state: State = {
  roomToken: '',
  userId: ''
}

// getters
const getters = {
  getRoomToken: (state: State) => state.roomToken,
  getUserId: (state: State) => state.userId
}

// action
const actions = {
  getRoomToken (context: { commit: Commit, state: State }, caseid: number) {
    return new Promise((resolve, reject) => {
      getRoomToken(caseid).then(res => {
        if (res.data.state === 100) {
          resolve(res)
          store.commit(types.SET_ROOM_TOKEN, res.data.result)
        } else {
          Sweetalert2({
            type: 'error',
            title: res.data.message
          })
          resolve(res)
        }
      }).catch(error => {
        Sweetalert2({
          type: 'error',
          title: '连接超时，请稍后再试'
        })
        reject(error)
      })
    })
  }
}

const mutations = {
  [types.SET_ROOM_TOKEN] (state: State, roomToken: string) {
    state.roomToken = roomToken
  },
  [types.SET_USERID] (state: State, userId: string) {
    state.userId = userId
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
