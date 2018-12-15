import {
  LoginOut,
  Login1,
  Login2,
  Register1,
  Register2,
  CheckNickname,
  RegMailSend,
  userInfo,
  ForgetPwdSetp1,
  ForgetPwdSetp2,
  ForgetPwdResend,
  SecondAuthCode,
  CheckEmail,
    userYesterdayProfit
} from '../services/api'
import {getUserInfo,clearUserInfo,saveUserInfo} from '../utils'
import {Notification} from 'element-react'
import intl from 'react-intl-universal'

export default {

  namespace: 'user',

  state: {
    email: '',
    userPassword: '',
    loginStatus: false,
    userid: '',
    nickname: '',
    level: '',
    viptype: '',
    activeday: '',
    invitationnumber: '',
    code: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      const {userid,token}=getUserInfo();
      if (userid && token) {
        dispatch({
          type: 'fetchUserInfo',
          payload: {}
        })
      }
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'saveLogin',
        payload: payload
      });
    },
    *fetchLoginOut({ payload, callback }, { call, put }) {

      const response = yield call(LoginOut, payload)
      if (callback) callback(response)
    },
    *fetchLogin({ payload, callback }, { call, put }) {
        clearUserInfo();
      const response = yield call(Login1, payload)
      if (response.success) {
        yield put({
          type: 'saveLogin',
          payload: { ...response.data, success: response.success }
        })
        if (callback) callback(response)
      } else {
        yield put({
          type: 'saveLogin',
          payload:  response.success
        })
        if (callback) callback(response)
      }

    },
    *fetchLoginVerify({ payload, callback }, { call, put }) {
      const response = yield call(Login2, payload);
      if (response.success) {
          saveUserInfo('_token_', response.data.token);
          saveUserInfo('_userid_', response.data.userid);
        yield put({
          type: 'saveLogin',
          payload: response.data
        })
        if (callback) callback(response)
      } else {
        //window.localStorage.setItem('_token_','')
        //window.localStorage.setItem('_userid_','')
        Notification({
          title:intl.get('Reminder'),
          type: 'error',
          message: intl.get(response.msg),
          duration: 2000
        });
      }
    },
    *fetchUserInfo({ payload }, { call, put }) {
      const response = yield call(userInfo, payload);
      if (response.success) {
        yield put({
          type: 'saveLogin',
          payload: { ...response.data, login: response.success }
        })
          window.sessionStorage.setItem("NickName",response.data.nickname)
      } else if(response.code === '-1' || response.code === -1){
          clearUserInfo();
        window.localStorage.setItem('_favorite_','')
        setTimeout(()=>{
          window.location.reload()
        },200)
      }

    },
    *fetchRegisterEmailVerify({ payload, callback }, { call, put }) {
      const response = yield call(Register1, payload)
      if (response.success) {
        yield put({
          type: 'saveLogin',
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
    *fetchRegister({ payload, callback }, { call, put }) {
      const response = yield call(Register2, payload)
      if (response.success) {
        yield put({
          type: 'saveLogin',
          payload: response.data
        })
        Notification({
         title:intl.get('Reminder'),
          type: 'success',
          message: intl.get('Reg_success'),
          duration: 2000
        });
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
    *fetchRegisterUsername({ payload, callback }, { call, put }) {
      const response = yield call(CheckNickname, payload)
      if (response.success) {
        yield put({
          type: 'saveLogin',
          payload: response.data
        })
        if (callback) callback(response)
      } else {
        if (callback) callback(response)
      }
    },
    *fetchRegisterResendCode({ payload, callback }, { call, put }) {
      const response = yield call(RegMailSend, payload)
      if (response.success) {
        yield put({
          type: 'saveLogin',
          payload: response.data
        })
        if (callback) callback(response)
      } else {
        if (callback) callback(response)
      }
    },
    *fetchYesterdayProfit({ payload, callback }, { call, put }) {
      const response = yield call(userYesterdayProfit, payload)
      if (response.success) {
        yield put({
          type: 'saveLogin',
          payload: response.data
        })
      }
    },
    //忘记密码
    *fetchForgetPwdEmailVerify({ payload, callback }, { call, put }) {
      const response = yield call(ForgetPwdSetp1, payload)
      if (response.success) {
        yield put({
          type: 'saveLogin',
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
    *fetchForgetPwd({ payload, callback }, { call, put }) {
      const response = yield call(ForgetPwdSetp2, payload)
      if (response.success) {
        yield put({
          type: 'saveLogin',
          payload: response.data
        })
        Notification({
          title:intl.get('Reminder'),
          type: 'success',
          message: intl.get('Pass_change_success'),
          duration: 2000
        });
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
    *fetchForgetPwdResendCode({ payload, callback }, { call, put }) {
      const response = yield call(ForgetPwdResend, payload)
      if (response.success) {
        yield put({
          type: 'saveLogin',
          payload: response.data
        })
        if (callback) callback(response)
      } else {
        if (callback) callback(response)
      }
    },
    *fetchAuthCodes({ payload, callback }, { call, put }) {

      const response = yield call(SecondAuthCode, payload);
          console.log(response)
      if (response.success) {
        yield put({
          type: 'saveLogin',
          payload: response.data
        })
        if (callback) callback(response)
      } else {
        if (callback) callback(response)
      }
    },
    *fetchCheckEmail({ payload, callback }, { call, put }) {
      const response = yield call(CheckEmail, payload);
      console.log(response)
      if (response.success) {
        yield put({
          type: 'saveLogin',
          payload: response.data
        })
        if (callback) callback(response)
      } else {
        if (callback) callback(response)
      }
    }
  },
  reducers: {
    saveLogin(state, action) {
      return { ...state, ...action.payload };
    }
  },

}

