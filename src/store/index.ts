import Vue from 'vue'
import Vuex, { ActionTree, MutationTree } from 'vuex'
import userModule from './modules/user'
import caseModule from './modules/case'
import roomModule from './modules/room'
import evidenceModule from './modules/evidence'
import playerModule from './modules/player'
import websocketModule from './modules/websocket'
import courtModule from './modules/court'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    userModule,
    caseModule,
    roomModule,
    evidenceModule,
    playerModule,
    websocketModule,
    courtModule
  }
})
