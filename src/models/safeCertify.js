import {
  SafeCertifyPwd,
  SafeCertifyTradePwd,
  SafeCertifyTradePwdResend,
  SafeCertifyBindPhone,
  GoogleVerifyStatus,
  GoogleVerifyStatusChange,
  GoogleVerifyKey
} from '../services/manager'
import {Notification} from 'element-react'
import intl from 'react-intl-universal'

export default {

  namespace: 'safeCertify',

  state: {
    count: 0,
    columns: [],
    data: [],
    loading: false,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      //   // debugger
      //   yield put({ type: 'loading', payload: true })
      // //   const response = yield call(TransactionReco, payload)
      //   yield put({
      //     type: 'save',
      //     payload: response,
      //   })
      yield put({ type: 'loading', payload: false })
    },
    *fetchPwd({ payload, callback }, { call, put }) {
      const response = yield call(SafeCertifyPwd, payload)
      if (response.success) {
        yield put({
          type: 'save',
          payload: response.data
        })
        if (callback) callback(response)
      } else {
        Notification({
          title:intl.get('Reminder'),
          type: 'error',
          message: intl.get(response.msg),
          duration: 2000
        });
      }
    },
    *fetchTradePwd({ payload, callback }, { call, put }) {
      const response = yield call(SafeCertifyTradePwd, payload)
      if (response.success) {
        yield put({
          type: 'save',
          payload: response.data
        })
        if (callback) callback(response)
      } else {
        Notification({
          title:intl.get('Reminder'),
          type: 'error',
          message: intl.get(response.msg),
          duration: 2000
        });
      }
    },
    *fetchTradeVerifyCode({ payload, callback }, { call, put }) {
      const response = yield call(SafeCertifyTradePwdResend, payload)
      if (response.success) {
        yield put({
          type: 'save',
          payload: response.data
        })
        if (callback) callback(response)
      } else {
        Notification({
          title:intl.get('Reminder'),
          type: 'error',
          message: intl.get(response.msg),
          duration: 2000
        });
      }
    },
    *fetchBindPhone({ payload, callback }, { call, put }) {
      const response = yield call(SafeCertifyBindPhone, payload)
      if (response.success) {
        yield put({
          type: 'save',
          payload: response.data
        })
        if (callback) callback(response)
      } else {
        Notification({
          title:intl.get('Reminder'),
          type: 'error',
          message: intl.get(response.msg),
          duration: 2000
        });
      }
    },
    *fetchGoogleVerifyStatus({ payload, callback }, { call, put }) {
      const response = yield call(GoogleVerifyStatus, payload)
      if (callback) callback(response)
    },
    *fetchGoogleVerifyStatusChange({ payload, callback }, { call, put }) {
      const response = yield call(GoogleVerifyStatusChange, payload)
      if (callback) callback(response)
    },
    *fetchGoogleVerifyKey({ payload, callback }, { call, put }) {
      const response = yield call(GoogleVerifyKey, payload)
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
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // console.log(history)
    },
    setupHistory({ dispatch, history }) {

    },
  },

}
