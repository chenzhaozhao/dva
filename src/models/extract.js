import { Extract, ExtractAction } from '../services/manager'

export default {

  namespace: 'extract',

  state: {
    count: 0,
    columns: [],
    data: [],
    loading: false,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(Extract, payload)
      yield put({
        type: 'save',
        payload: response,
      })
    },
    *fetchExtractAction({ payload,callback }, { call, put }) {
      const response = yield call(ExtractAction, payload)
      yield put({
        type: 'saveExtract',
        payload: response,
      })
      if(callback) callback(response)
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
        list = [...action.payload.data.list]
      }
      return {
        ...state, 
        count: action.payload.data.count,
        data: list
      }
    },
    saveExtract(state, action) {
      
      return {
        ...state
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
