import {
  EntrustRevoke,
  EntrustMarket,//当前
  EntrustMarketHistory,//历史
  EntrustTracsactionReco,//成功
  newTransReco, // 最新成交,
  commissionList, // 委托列表
  trade,
  cancelCommission,
  CoinExchangeRate
} from '../services/api'
import { socket } from '../services/socket'
import { objectAttrSort, antiObjectAttrSort, replArrayItem } from '../utils'
import { WS_URL as socketUrl } from '../common/global';
import intl from 'react-intl-universal'

export default {

  namespace: 'transaction',

  state: {
    dataEntrustRevoke: [],
    dataEntrustMarket: [],
    dataEntrustMarketHistory: [],
    dataEntrustTracsactionReco: [],
    newTransReco: [], // 最新成交
    commissionListBuy: [],
    commissionListSell: [],
    transactionDetailListSell: [],
    loading: false
  },
  effects: {
    *webSocket({ payload }, { put }) {
      yield put({
        type: 'saveSocketData',
        payload: payload
      })
    },
    *fetchCommissionList({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: true })
      const response = yield call(commissionList, payload)
      yield put({
        type: 'saveCommissionList',
        payload: response,
      })
      yield put({ type: 'loading', payload: false })
    },
    *fetchNewTransReco({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: true })
      const response = yield call(newTransReco, payload)
      yield put({
        type: 'saveNewTransReco',
        payload: response,
      })
      yield put({ type: 'loading', payload: false })
    },
    *fetchEntrustRevoke({ payload, callback }, { call, put }) {
      const response = yield call(EntrustRevoke, payload)
      if (callback) callback(response)
    },
    *fetchEntrustMarket({ payload }, { call, put }) {
      const response = yield call(EntrustMarket, payload)
      yield put({
        type: 'saveEntrustMarket',
        payload: response,
      })
      yield put({ type: 'loading', payload: false })
    },
    *fetchEntrustMarketHistory({ payload }, { call, put }) {
      const response = yield call(EntrustMarketHistory, payload)
      yield put({
        type: 'saveEntrustMarketHistory',
        payload: response,
      })
    },
    *fetchEntrustTracsactionReco({ payload }, { call, put }) {
      const response = yield call(EntrustTracsactionReco, payload)
      yield put({
        type: 'saveEntrustTracsactionReco',
        payload: response,
      })
    },
    *fetchBuy({ payload, callback }, { call, put }) {
      const response = yield call(trade, payload)
      if (callback) callback(response)
    },
    *fetchSell({ payload, callback }, { call, put }) {
      const response = yield call(trade, payload)
      if (callback) callback(response)
    },
    *fetchCoinExchangeRate({ payload, callback }, { call, put }) {
      const response = yield call(CoinExchangeRate, payload)
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

    saveSocketData(state, action) {
      var data = JSON.parse(action.payload)

      let buyList = []
      let sellList = []
      let tradeList = []
      let transactionDetail = []
      if (data.newentrust && Array.isArray(data.newentrust)) {

        data.newentrust.forEach((item) => {
          if (item.type == '1') {
            buyList.push(item)

          } else if (item.type == '2') {
            sellList.push(item)
          }
        })
        buyList = buyList.filter(item => item.volume != '0')

        let sellListData = sellList.filter(item => item.volume != '0')
        sellList = [...sellListData]
        //buyList = buyList.sort(objectAttrSort)
        transactionDetail = sellListData.sort(antiObjectAttrSort)
      } else {
        buyList = state.commissionListBuy
        sellList = state.commissionListSell
        transactionDetail = state.transactionDetailListSell
      }

      if (data.newtrade) {
        // data.newtrade.forEach((item) => {
        //   if (state.newTransReco.length > 80) {
        //     tradeList = state.newTransReco.splice(state.newTransReco.length - 1, 1)
        //     tradeList.unshift(item)
        //   } else {
        //     tradeList.unshift(item)
        //   }
        // })
        tradeList = data.newtrade
      }
      state.commissionListBuy=[];
      state.commissionListSell=[];
      state.transactionDetailListSell=[];
      state.newTransReco=[];
      return {
        ...state,
        commissionListBuy: buyList,
        commissionListSell: sellList,
        transactionDetailListSell: transactionDetail,
        newTransReco: [...tradeList]
      }
    },
    saveEntrustRevoke(state, action) {
      return {
        ...state
      }
    },
    saveEntrustMarket(state, action) {
      let list = []
      if (action.payload.success) {
        list = action.payload.data.list
      }
      return {
        ...state,
        dataEntrustMarket: list
      }
    },
    saveEntrustMarketHistory(state, action) {
      let list = []
      if (action.payload.success) {
        list = action.payload.data.list
      }
      return {
        ...state,
        dataEntrustMarketHistory: list
      }
    },
    saveEntrustTracsactionReco(state, action) {
      let list = []
      if (action.payload.success) {
        list = action.payload.data.list
      }
      return {
        ...state,
        dataEntrustTracsactionReco: list
      }
    },
    saveNewTransReco(state, action) {
      let list = []
      if (action.payload.success) {
        list = action.payload.data.list_trade
      }
      state.newTransReco=[];
      return {
        ...state,
        newTransReco: list
      }
    },
    saveCommissionList(state, action) {
      let list1 = []
      let list2 = []
      let transactionDetail = []
      if (action.payload.success) {
        list1 = action.payload.data.list_buy
        list2 = [...action.payload.data.list_sell]
        transactionDetail = (action.payload.data.list_sell).sort(antiObjectAttrSort)
      }
      return {
        ...state,
        commissionListBuy: list1,
        commissionListSell: list2,
        transactionDetailListSell: transactionDetail
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
    setupHistory({ dispatch, history }) {

    },
    saveSocketData({ dispatch, history }) {

    }
  },

}
