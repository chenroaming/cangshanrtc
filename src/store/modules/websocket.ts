import { Commit } from 'vuex'
import store from '../index'
import types from '../types'
import RWS from '../../utils/rws'

interface State {
  websocket: RWS | null
}

const state: State = {
  websocket: null
}

const getters = {
  getWebsocket: (state: State) => state.websocket
}

const actions = {
  setWebsocket (context: { commit: Commit, state: State }) {
    var protocolStr = document.location.protocol;
    if(protocolStr == "http:")
    {
       console.log("protocol = " + protocolStr);
      //  store.commit(types.SET_WEBSOCKET, new RWS('ws://' + location.host + '/api/voice/ws.jhtml'))
      store.commit(types.SET_WEBSOCKET, new RWS('ws://' + location.host + '/api/web/webSocket.jhtml'))
    }
    else if(protocolStr == "https:")
    {
       console.log("protocol = " + protocolStr);
      //  store.commit(types.SET_WEBSOCKET, new RWS('wss://' + location.host + '/api/voice/ws.jhtml'))
      store.commit(types.SET_WEBSOCKET, new RWS('wss://' + location.host + '/api/web/webSocket.jhtml'))
    }
    // store.commit(types.SET_WEBSOCKET, new RWS('wss://' + location.host + '/api/voice/ws.jhtml'))
  },
  websocketSend (context: { commit: Commit, state: State }, content: any) {
    state.websocket.send(content)
  }
}

const mutations = {
  [types.SET_WEBSOCKET] (state: State, websocket: RWS) {
    state.websocket = websocket
  }
}

// state.websocket.onclose = () => {
//   console.log('websocket断开')
// }
// state.websocket.onerror = () => {
//   console.log('websocket错误')
// }
// state.websocket.onopen = () => {
//   console.log('websocket链接')
// }

export default {
  state,
  getters,
  actions,
  mutations
}
