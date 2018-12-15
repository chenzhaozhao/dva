import { socket } from '../services/socket'
import { dragonGameList, dragonBuy, dragonBuyFree, dragonBuyFreeTimes, dragonDetail } from '../services/api'
import { replArrayItem } from '../utils'
import { WS_URL as socketUrl } from '../common/global';

export default {

    namespace: 'game',

    state: {
        socketData: null,
        gameList: [],
        dragonInfo: {
            id: "",
            maxtime: "0",
            remainingtime: "0",
            endtime: "0",
            jackpot: "0",
            partakecount: "0",
            bounscount: "0",
            nownum: "0",
            dividends: "0",
            usdtpay: "0",
            btcpay: "0",
            ethpay: "0",
            user_partake_list: [],
            user_partakes: []
        }
    },
    effects: {
        *webSocket({ payload }, { put }) {
            // yield put({
            //     type: 'saveSocketData',
            //     payload: payload
            // })
            yield put({
                type: 'saveSocketDataNew',
                payload: payload
            })
        },
        *fetchGameList({ payload, callback }, { call, put }) {
            const response = yield call(dragonGameList, payload)
            yield put({
                type: 'saveList',
                payload: response
            })
            if (callback) callback(response)
        },
        *fetchBuy({ payload, callback }, { call, put }) {
            const response = yield call(dragonBuy, payload)
            yield put({
                type: 'save',
                payload: response
            })
            if (callback) callback(response)
        },
        *fetchFreeBuy({ payload, callback }, { call, put }) {
            const response = yield call(dragonBuyFree, payload)

            if (callback) callback(response)
        },
        *fetchFreeBuyTimes({ payload, callback }, { call, put }) {
            const response = yield call(dragonBuyFreeTimes, payload)

            if (callback) callback(response)
        },
        *fetchDragonDetail({ payload, callback }, { call, put }) {
            const response = yield call(dragonDetail, payload)

            yield put({
                type: 'saveDragonInfo',
                payload: response
            })
            if (callback) callback(response)
        },
    },
    reducers: {
        saveSocketData(state, action) {

            let data = []
            let origin = state.gameList
            if (action.payload && (typeof action.payload === 'string')) {
                data = JSON.parse(action.payload)
            }
            let list = []
            if (data && data.length > 0) {
                list = replArrayItem(origin, data)
            } else {
                list = state.gameList
            }

            return {
                ...state,
                gameList: [...list]
            }
        },
        saveSocketDataNew(state, action) {
            let data = {}
            if (action.payload && (typeof action.payload === 'string')) {
                data = JSON.parse(action.payload)
                console.log()
            }
            return {
                ...state,
                dragonInfo: { ...state.dragonInfo, ...data }
            }
        },
        saveList(state, action) {
            return {
                ...state,
                gameList: [...action.payload.data.list]
            }
        },
        save(state, action) {
            return {
                ...state,
            }
        },
        saveDragonInfo(state, action) {
            return {
                ...state,
                dragonInfo: { ...action.payload.data[0] }
            }
        },
    },

    subscriptions: {
        setup({ dispatch, history }) {
        },
        setupHistory({ dispatch, history }) {

        },
        saveSocketData({ dispatch, history }) {
            // history.listen((location) => {

            //     if ('/qqgame' === location.pathname) {
            //         let token = localStorage.getItem('_token_')
            //         socket(data => {
            //             dispatch({
            //                 type: 'webSocket',
            //                 payload: data
            //             })
            //         }, {
            //                 url: socketUrl,
            //                 params: {
            //                     "type": 'dragon',
            //                     "ctoin": "add",
            //                     "token" : token
            //                 },
            //             })
            //     }
            // })
        }
    },

}
