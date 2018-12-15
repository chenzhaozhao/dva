import { RollOutFee } from '../services/api'

export default {

    namespace: 'handlingfee',
  
    state: {
        handlingfeeList : []
    },
  
    subscriptions: {
      
    },
  
    effects: {
      // test api
      *fetchFeeList({ payload }, { call, put }) {
        const response = yield call(RollOutFee, payload)
        yield put({ 
            type: 'save',
            payload: response
        })
      },
    },
  
    reducers: {
        save(state, action) {
            let data
            if (!action.payload.success) {
                data = []
            } else {
                data = action.payload.data
            }
            console.log(data)
            return { 
                ...state, 
                handlingfeeList : data
            }
        }
    },
  
  }
