// import { CoinList } from '../services/api'

export default {

  namespace: 'coin',

  state: {
    list: [],
    data: [],
    loading: false,
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      // debugger
      //yield put({ type: 'loading', payload: true })
      // const response = yield call(CoinList, payload)
      // yield put({
      //   type: 'save',
      //   payload: response.data.data,
      // })
      //yield put({ type: 'loading', payload: false })
    },
  },
  reducers: {
    loading(state, action) {
      return {
        ...state,
        loading: action.payload
      }
    },
    save(state, action) {
      // debugger
      return { 
        ...state, 
        data: state.data.concat(action.payload)
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) { 
      // console.log(history)
    },
    setupHistory ({ dispatch, history }) {
      
    },
  },

}
