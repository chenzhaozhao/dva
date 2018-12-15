import { 
    vipBuy,
    vipList
} from '../services/api'

export default {

    namespace: 'levelProfit',
  
    state: {
        data : []
    },
  
    subscriptions: {
      
    },
  
    effects: {
      // test api
        *fetchVipList({ payload, callback }, { call, put }) {
            const response = yield call(vipList, payload)
            yield put({ 
                type: 'saveList',
                payload: response
            })
            if (callback) callback(response)
        },
        *fetchVip({ payload, callback }, { call, put }) {
            const response = yield call(vipBuy, payload)
            yield put({ 
                type: 'save',
                payload: response
            })
            if (callback) callback(response)
        },
      
    },
  
    reducers: {
        saveList(state, action) {
            let data
            if (!action.payload.success) {
                data = []
            } else {
                data = action.payload.data
            }
            return { 
                ...state, 
                data : data
            }
        },
        save(state, action) {
            return { 
                ...state, 
            }
        }
        
    },
  
  }
