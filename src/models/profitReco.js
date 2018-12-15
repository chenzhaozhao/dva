import { ProfitReco, siteDividend } from '../services/manager'

export default {

  namespace: 'profitReco',

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
      const response = yield call(ProfitReco, payload)
      yield put({
        type: 'saveList',
        payload: response,
      })
      yield put({ type: 'loading', payload: false })
    },
    *dividend({ payload }, { call, put }) {
      const response = yield call(siteDividend, payload)
      yield put({
        type: 'save',
        payload: response.data,
      })
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
    saveList(state, action) {
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
    save(state, action) {
      return {
        ...state, 
        ...action.payload
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
