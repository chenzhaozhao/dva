import { socket } from '../services/socket'
import { WS_URL as socketUrl } from '../common/global'

export default {

  namespace: 'socket',

  state: {
    socketData: null,
  },
  effects: {
    *webSocket({ payload }, { put }) {
      // debugger
      yield put({
        type: 'saveSocketData',
        payload: payload
      })
    }
  },
  reducers: {
    saveSocketData(state, action) {
      return {
        ...state,
        socketData: action.payload
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) { 
      // console.log(history)
    },
    setupHistory ({ dispatch, history }) {
      
    },
    saveSocketData ({ dispatch, history }) {
      console.log(socketUrl)
      history.listen((location) => {
        if ('/home' === location.pathname) {
          socket(data => {
            console.log(`这里是ws推过来的消息：`, data)
            // dispatch({
            //   type: 'webSocket',
            //   payload: data
            // })
          }, {
            url: socketUrl,
            params: {
              type: 'index'
            },
          })
        }
      })
    }
  },

}
