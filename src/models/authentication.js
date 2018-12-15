import { VerifyPersonalInfomation, VerifyPersonalStatus } from '../services/manager'

export default {

    namespace: 'authentication',
  
    state: {
        authenticationList : []
    },
  
    subscriptions: {
      
    },
  
    effects: {
      // test api
      *fetchVerifyInfomation({ payload, callback }, { call, put }) {
        const response = yield call(VerifyPersonalInfomation, payload)
        yield put({ 
            type: 'save',
            payload: response
        })
        if (callback) callback(response)
      },
      *fetchVerifyStatus({ payload, callback }, { call, put }) {
        const response = yield call(VerifyPersonalStatus, payload)
        yield put({ 
            type: 'save',
            payload: response
        })
        if (callback) callback(response)
      },
    },
  
    reducers: {
        save(state, action) {
            
            return { 
                ...state
            }
        }
    },
  
  }
