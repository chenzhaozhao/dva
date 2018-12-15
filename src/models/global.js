import { CoinTypes } from '../services/manager'

export default {

  namespace: 'global',

  state: {
    coinTypes: [],
    pathCoinid: '3',
    pathPaycoinid: '2'
  },

  subscriptions: {
    setup({ dispatch, history }) {
      console.log(history);
      // if (history.location.pathname !== '/home') {
        dispatch({
          type: 'fetchCoinType',
        })
      // }
    },
    pathListen({ dispatch, history }) {
      history.listen((pathname) => {
        dispatch({
          type: 'pathUpdate',
          payload: pathname
        })
      })
    }

  },

  effects: {
    *fetchCoinType({ payload }, { call, put }) {
      const response = yield call(CoinTypes, payload)
      yield put({ type: 'saveCoinType', payload: response })
    },
    *pathUpdate({ payload }, { call, put }) {
      let path = payload.pathname.split('/')
      yield put({ type: 'savePath', payload: path })
    }
  },

  reducers: {
    saveCoinType(state, action) {
      // debugger
      let coinTypes = []
      if (action.payload.code === '1') {
        coinTypes = action.payload.data
      }
      // debugger
      return {
        ...state,
        coinTypes
      }
    },
    savePath(state, action) {
      let coinid = '3'
      let paycoinid = '2'
      if (action.payload[1].indexOf('transaction') >= 0) {

        coinid = action.payload[2]
        paycoinid = action.payload[3]
      }
      return {
        ...state,
        pathCoinid: coinid,
        pathPaycoinid: paycoinid
      }
    }
  },

}
