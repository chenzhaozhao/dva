import { AssetBalance } from '../services/manager'

export default {

  namespace: 'assetBalance',

  state: {
    count: 0,
    columns: [],
    data: [],
    loading: false,
  },
  effects: {
    *reset({ payload }, { call, put }) {
      yield put({
        type: 'resets',
        payload: {},
      })
    },
    *fetch({ payload,callback }, { call, put }) {
      // debugger
      yield put({ type: 'loading', payload: true })
      const response = yield call(AssetBalance, payload)
      yield put({
        type: 'save',
        payload: response,
      })
      if(callback) callback(response)
      yield put({ type: 'loading', payload: false })
    },
  },
  reducers: {
    loading(state, action) {
      return {
        ...state,
        loading: action.payload
      }
    },
    resets(state, action){
      return {
        ...state,
        data:[]
      }
    },
    save(state, action) {
      // debugger
      let list = []
      let count;
      if (action.payload.success) {
        list = action.payload.data.list
      }
      if (action.payload.data) {
        count = action.payload.data.count
      } else {
        count = 0
      }
      return {
        ...state, 
        count: count,
        data:list
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
