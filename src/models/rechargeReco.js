import { RechargeReco } from '../services/manager'

export default {

  namespace: 'rechargeReco',

  state: {
    count: 0,
    columns: [],
    data: [],
    loading: false,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      // debugger
      yield put({ type: 'loading', payload: true })
      const response = yield call(RechargeReco, payload)
      // debugger
      yield put({
        type: 'save',
        payload: response,
      })
      yield put({ type: 'loading', payload: false })
    },
    *reset({ payload }, { call, put }) {
      yield put({
        type: 'resets',
        payload: {},
      })
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
      if (action.payload.success) {
        list = action.payload.data.list
      }
      return {
        ...state, 
        count: action.payload.data.count,
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
