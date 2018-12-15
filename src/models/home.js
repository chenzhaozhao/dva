import {
    Announce,
    UserYesterdayProfit,
    profitNewsBoard,
    profitNewsTopBoard,
    riseList,
    declinesList,
    market,
    Favorites,
    AddFavorites,
    DelFavorites,
    profitYesterdayTopBoard,
    getRange,
    getFrank,
    getissue,
    getNews
} from '../services/api'
// import { getRange } from '../services/manager'
// import { socket } from '../services/socket'
import { replArrayItem, saveFavorite, fluctuationObjectAttrSort, antiFluctuationObjectAttrSort } from '../utils'
import config from '../utils/config';
export default {

    namespace: 'home',

    state: {
        announceList: [],
        newBoards: [],
        myYesterdayProfit: '',
        yesterday: '',
        today: '',
        profitTopList: [],
        yesterdayProfitTopList: [],
        increaseBillboards: [],
        decreaseBillboards: [],
        qqMarket: [],
        usdtMarket: [],
        btcMarket: [],
        ethMarket: [],
        favorite: [],
        MarketMain:[],
        allTradepair: [],
        coinid: '',
        paycoinid: '',
        currentTradepair: {
            high: '',
            low: '',
            nowprice: '',
            tradepair: '',
            volume: '',
            wave: '',
            fullname: '',
            change:''
        }
    },

    subscriptions: {
        pathListen({ dispatch, history }) {

        },
        saveSocketData({ dispatch, history }) {
            history.listen((location) => {
                if (-1 !== location.pathname.indexOf('/transaction')) {

                    let arr = location.pathname.split('/')
                    dispatch({
                        type: 'fetchTradePair',
                        payload: {
                            coinid: arr[2],
                            paycoinid: arr[3]
                        }
                    })
                }
            })
        },
    },

    effects: {
        *webSocket({ payload, callback }, { call, put }) {
            //
            if (typeof payload === String) {
                payload = JSON.parse(payload)
            }
            if (payload && Array.isArray(payload)) {
                yield put({
                    type: 'updateMarket',
                    payload: payload
                })
            }

        },
        *fetchTradePair({ payload }, { call, put }) {
            yield put({
                type: 'updateTradePair',
                payload: payload
            })
        },
        *editFavorites({ payload }, { call, put }) {
            yield put({
                type: 'editFavorite',
                payload
            })
            let response;
            if (payload.cmd === 'add') {
                response = yield call(AddFavorites, { tradepairid: payload.item.id })
            } else if (payload.cmd === 'del') {
                response = yield call(DelFavorites, { tradepairid: payload.item.id })
            }
        },
        *fetchFavorites({ payload, callback }, { call, put }) {
            const response = yield call(Favorites, payload)
            if (callback){
                callback(response)
            }
            // debugger
            // yield put({
            //     type: 'saveFavorites',
            //     payload: response
            // })
            // yield put({
            //     type: 'reqFavorites',
            //     payload: response
            // })
        },
        *fetchMarket({ payload, callback }, { call, put }) {
            const response = yield call(market, payload)
            // debugger
            yield put({
                type: 'saveMarket',
                payload: response
            })
            if (callback) { callback(response) }
        },
        *fetchAnnounce({ payload }, { call, put }) {
            const response = yield call(Announce, payload)

            yield put({
                type: 'saveList',
                payload: response
            })
        },
        *fetchYesterdayProfit({ payload, callback }, { call, put }) {
            const response = yield call(UserYesterdayProfit, payload)
            yield put({
                type: 'yesterdayProfit',
                payload: response
            })
            if (callback) callback(response)
        },
        *profitNewsBoard({ payload, callback }, { call, put }) {
            const response = yield call(profitNewsBoard, payload)
            yield put({
                type: 'save',
                payload: response
            })
            if (callback) callback(response)
        },
        *fetchProfitNewsTopBoard({ payload, callback }, { call, put }) {
            const response = yield call(profitNewsTopBoard, payload)
            yield put({
                type: 'saveProfitTop',
                payload: response
            })
            if (callback) callback(response)
        },
        *fetchProfitYesterdayTopBoard({ payload, callback }, { call, put }) {
            const response = yield call(profitYesterdayTopBoard, payload)
            yield put({
                type: 'saveYesterdayProfitTop',
                payload: response
            })
            if (callback) callback(response)
        },
        *getRanges({ payload, callback }, { call, put }){
            const response = yield call(getRange, payload)
            // yield put({
            //     type: 'saveYesterdayProfitTop',
            //     payload: response
            // });
            if (callback) callback(response)
        },
        *getFranks({ payload, callback }, { call, put }){
            const response = yield call(getFrank, payload)
            // yield put({
            //     type: 'saveYesterdayProfitTop',
            //     payload: response
            // });
            if (callback) callback(response)
        },
        *getissues({ payload, callback }, { call, put }){
            const response = yield call(getissue, payload)
            // yield put({
            //     type: 'saveYesterdayProfitTop',
            //     payload: response
            // });
            if (callback) callback(response)
        },
        *getBannerNews({ payload, callback }, { call, put }){
            const response = yield call(getNews, payload);
            // yield put({
            //     type: 'saveYesterdayProfitTop',
            //     payload: response
            // });
            if (callback) callback(response)
        },
    },

    reducers: {

        // updateDeclineslist(state, action) {
        //     const list = replArrayItem(state.decreaseBillboards, action.payload[0])
        //     if (action.callback) {
        //         action.callback({
        //             decreaseBillboards: list
        //         })
        //     }
        //     return {
        //         ...state,
        //         decreaseBillboards: list
        //     }
        // },
        // updateRiselist(state, action) {
        //     const list = replArrayItem(state.increaseBillboards, action.payload[0])
        //     if (action.callback) {
        //         action.callback({
        //             increaseBillboards: list
        //         })
        //     }
        //     return {
        //         ...state,
        //         increaseBillboards: list
        //     }
        // },
        updateTradePair(state, action) {
            let coinid = ''
            let paycoinid = ''
            if (action.payload) {
                coinid = action.payload.coinid
                paycoinid = action.payload.paycoinid
            }
            return {
                ...state,
                coinid: coinid,
                paycoinid: paycoinid
            }
        },
        updateFavorite(state, action) {
            let list = replArrayItem(state.favorite, action.payload[0])
            list = list.map(item => {
                const fav = localStorage.getItem('_favorite_')
                item.selfChoose = fav && fav.includes(item.id) ? true : false
                return item
            })
            return {
                ...state,
                favorite: list
            }
        },
        updateMarket(state, action) {
            // debugger

            let alllist = [];
            let list1 = [];
            let list2 = [];
            let list3 = [];
            let list4 = [];
            let list5 = [];
            let riseList = [];
            let decreaseList = [];
            let currentTradepair = null;
            let MarketMain=[];
            let tradepairCt=[];
            let tradepairOther=[];
            const fav = localStorage.getItem('_favorite_');
            if (action.payload && action.payload.length > 0) {
                alllist = replArrayItem(state.allTradepair, action.payload);
                alllist.forEach((item, index) => {
                    if (parseFloat(item.fluctuation) >= 0) {
                        riseList.push(item)
                    } else if (parseFloat(item.fluctuation) < 0) {
                        decreaseList.push(item)
                    }
                    if (fav && fav.includes(item.id)) {
                        item.selfChoose = true
                        list5.push(item)
                    } else {
                        item.selfChoose = false
                    }

                    if (state.coinid == item.coinid && state.paycoinid == item.paycoinid) {
                        currentTradepair = item
                    }

                    if (config.MarketMain.includes(item.tradepair)){
                        if (item.tradepair.split("/")[0]==="CT"){
                            tradepairCt.push(item)
                        } else {
                            tradepairOther.push(item)
                        }

                    }
                    if (item.paycoinid == '1') {
                        list1.push(item)
                    } else if (item.paycoinid == '2') {
                        list2.push(item)
                    } else if (item.paycoinid == '3') {
                        list3.push(item)
                    } else if (item.paycoinid == '4') {
                        list4.push(item)
                    }
                });
                riseList = riseList.sort(fluctuationObjectAttrSort)
                decreaseList = decreaseList.sort(antiFluctuationObjectAttrSort)

            }
            return {
                ...state,
                qqMarket: list1,
                usdtMarket: list2,
                btcMarket: list3,
                ethMarket: list4,
                favorite: list5,
                MarketMain:[...tradepairCt,...tradepairOther],
                allTradepair: alllist,
                increaseBillboards: riseList,
                decreaseBillboards: decreaseList,
                currentTradepair: { ...currentTradepair }
            }
        },
        editFavorite(state, action) {
            // debugger
            const arr = state.favorite
            const item = action.payload.item

            if (action.payload.cmd === 'add') {

                saveFavorite('add', arr, item)
            }
            else if (action.payload.cmd === 'del') {

                saveFavorite('del', arr, item)
            }
            return {
                ...state,
                favorite: arr
            }
        },
        saveFavorites(state, action) {
            // debugger
            let list = []
            if (action.payload.success) {
                list = action.payload.data[1]
                list = list.map(item => {
                    const fav = localStorage.getItem('_favorite_')
                    item.selfChoose = fav && fav.includes(item.id) ? true : false
                    return item
                })
            }
            return {
                ...state,
                favorite: list
            }
        },
        saveMarket(state, action) {
            let list1 = []
            let list2 = []
            let list3 = []
            let list4 = []
            let list5 = []
            let list6 = []
            let riseList = []
            let decreaseList = [];
            let MarketMain=[];
            let tradepairCt=[];
            let tradepairOther=[];
            let currentTradepair = null;
            if (action.payload.success) {
                const fav = localStorage.getItem('_favorite_')
                
                action.payload.data.forEach((item, index) => {
                    if (parseFloat(item.fluctuation) >= 0) {
                        riseList.push(item)
                    } else if (parseFloat(item.fluctuation) < 0) {
                        decreaseList.push(item)
                    }
                    if (fav && fav.includes(item.id)) {
                        item.selfChoose = true
                        list6.push(item)
                    } else {
                        item.selfChoose = false
                    }

                    if (state.coinid == item.coinid && state.paycoinid == item.paycoinid) {
                        currentTradepair = item
                    }

                    if (config.MarketMain.includes(item.tradepair)){
                        if (item.tradepair.split("/")[0]==="CT"){
                            tradepairCt.push(item)
                        } else {
                            tradepairOther.push(item)
                        }

                    }
                    if (item.paycoinid == '1') {
                        list1.push(item)
                    } else if (item.paycoinid == '2') {
                        list2.push(item)
                    } else if (item.paycoinid == '3') {
                        list3.push(item)
                    } else if (item.paycoinid == '4') {
                        list4.push(item)
                    }
                });
                riseList = riseList.sort(fluctuationObjectAttrSort)
                decreaseList = decreaseList.sort(antiFluctuationObjectAttrSort)
                list5 = [
                    ...list1,
                    ...list2,
                    ...list3,
                    ...list4
                ]
            }
            return {
                ...state,
                qqMarket: list1,
                usdtMarket: list2,
                btcMarket: list3,
                ethMarket: list4,
                favorite: list6,
                MarketMain:[...tradepairCt,...tradepairOther],
                allTradepair: list5,
                increaseBillboards: riseList,
                decreaseBillboards: decreaseList,
                currentTradepair: { ...currentTradepair }
            }
        },
        saveList(state, action) {
            let data
            if (!action.payload.success) {
                data = []
            } else {
                data = action.payload.data
            }
            return {
                ...state,
                announceList: data
            }
        },
        save(state, action) {
            let data
            if (!action.payload.success) {
                data = []
            } else {
                data = action.payload.data.list
            }
            return {
                ...state,
                newBoards: data,
                yesterday: action.payload.data.yesterday,
                today: action.payload.data.today,
            }
        },
        saveProfitTop(state, action) {
            let data
            if (!action.payload.success) {
                data = []
            } else {
                data = action.payload.data
            }
            return {
                ...state,
                profitTopList: data,
            }
        },
        saveYesterdayProfitTop(state, action) {
            let data
            if (!action.payload.success) {
                data = []
            } else {
                data = action.payload.data
            }
            return {
                ...state,
                yesterdayProfitTopList: data,
            }
        },
        yesterdayProfit(state, action) {
            let myYesterdayProfit = action.payload.data
            return {
                ...state,
            }
        },

    },

}
