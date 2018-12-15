import { ExtractAddrManage, ExtractAddress, ExtractAddressDel } from '../services/manager'

export default {

  namespace: 'extractAddress',

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
    *fetchAdd({ payload }, { call, put }) {
      
      yield put({
        type: 'saveItem',
        payload: payload,
      })
    },
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: true })
      const response = yield call(ExtractAddrManage, payload)
      yield put({
        type: 'save',
        payload: response,
      })
      yield put({ type: 'loading', payload: false })
    },
    *fetchAddressAdd({ payload,callback }, { call, put }) {
      const response = yield call(ExtractAddress, payload)
      yield put({
        type: 'save',
        payload: response,
      })
      if (callback) {callback(response)}
    },
    *fetchAddressDel({ payload,callback }, { call, put }) {
      const response = yield call(ExtractAddressDel, payload)
      yield put({
        type: 'save',
        payload: response,
      })
      
      if (callback) {callback(response)}
    },
    *delAttress({ payload,callback }, { call, put }) {
      yield put({
        type: 'delAttr',
        payload: payload
      })
    }
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
    delAttr(state, action){
      state.data.splice(action.payload.index, 1)
      let list = state.data
      return {
        ...state,
        data: list
      }
    },
    save(state, action) {
      let list = []
      if (action.payload.success) {
        list = [...action.payload.data.list]
      }
      return {
        ...state, 
        count: action.payload.data.count,
        data:list
      }
    },
    saveItem(state, action){
      let list =[]
      if (action.payload.addItem ) {
        list = action.payload.addItem 
      }
      
      return {
        ...state, 
        data:list
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) { 
    },
    setupHistory ({ dispatch, history }) {
      
    },
  },

}
