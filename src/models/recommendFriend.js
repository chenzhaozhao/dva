import { RecommendFriend } from '../services/manager'

export default {

    namespace: 'recommendFriend',
  
    state: {
      data: {},
      loading: false,
    },
    effects: {
      *fetch({ payload,callback }, { call, put }) {
      //   // debugger
        yield put({ type: 'loading', payload: true })
        const response = yield call(RecommendFriend, payload)
        // debugger
        yield put({
          type: 'save',
          payload: response,
        });
        yield put({ type: 'loading', payload: false })
          if (callback) callback(response)
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
        let data = {}
        if (action.payload.success) {
          data = action.payload.data
        }
        return {
          ...state,
          data
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
  