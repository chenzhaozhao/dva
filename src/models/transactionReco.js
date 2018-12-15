import { TransactionReco } from '../services/manager'

export default {

  namespace: 'transactionReco',

  state: {
    count: 0,
    columns: [],
    data: [],
    loading: false,
  },
  effects: {
    *fetch({ payload,cb}, { call, put }) {
      // debugger
      yield put({ type: 'loading', payload: true })
      const response = yield call(TransactionReco, payload)
      yield put({
        type: 'save',
        payload: response,
      })
      yield put({ type: 'loading', payload: false })
        if (cb) cb();
    },
    *reset({ payload,cb}, { call, put }) {
      yield put({
        type: 'resets',
        payload: {},
      });
        if (cb) cb();
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
      let list = [];
      if (action.payload.success) {
        list = action.payload.data.list
      }
        state.data=[];
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
