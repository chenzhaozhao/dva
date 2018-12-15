import React, { PureComponent, createElement } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { emailVerify, getPwdVerify } from '../../utils'
import styles from './forgetPwd.less'
import { Notification} from 'element-react';
import intl from 'react-intl-universal'

let countDownInterval
@connect(state => ({}))
export default class ForgetPwd extends PureComponent {
  static aa = () => { }
  state = {
    step: 1,
    email: '',
    emailEmpty: false,
    emailVerify: true,
    emailFillFinish: false,
    username: '',
    usernameVerify: true,
    password: '',
    passwordVerify: true,
    confirmPassword: '',
    confirmPasswordVerify: true,
    emailExist: true,
    token: '',
    verifyCode: '',
    countDown: 60
  }

  componentWillUnmount(){
    if (countDownInterval) {
      clearInterval(countDownInterval)
    }
  }

  emailChangeHandle(e) {
    this.setState({ email: e.target.value })
    if (emailVerify(this.state.email)) {
      this.setState({ emailFillFinish: true })
    }
  }
  emailHandle(e) {
    if (this.state.email.length == 0) {
      this.setState({
        emailEmpty: true
      })
      return
    } else {
      this.state.emailEmpty = false
      this.setState({ emailVerify: emailVerify(this.state.email) })

    }

  }
  passwordHandle(e) {
    this.setState({ passwordVerify: getPwdVerify(this.state.password) })
  }
  confirmPasswordHandle() {
    this.state.password === this.state.confirmPassword
      ? this.setState({ confirmPasswordVerify: true }) : this.setState({ confirmPasswordVerify: false })
  }
  confirmPwdVerify(e) {
    this.setState({
      confirmPassword: e.target.value
    })
  }
  emailExistVerify(e) {
    clearInterval(countDownInterval)
    this.setState({
      countDown: 60
    })
    if (this.state.email.length == 0) {
      this.setState({
        emailEmpty: true
      })
      return
    } else {
      this.state.emailEmpty = false
      this.setState({ emailVerify: emailVerify(this.state.email) })
      if (this.state.emailVerify) {
        this.props.dispatch({
          type: 'user/fetchForgetPwdEmailVerify',
          payload: {
            email: this.state.email
          },
          callback: (data) => {
            if (data.success) {
              Notification({
                title:intl.get('Reminder'),
                type: 'success',
                message: intl.get('Code_send_email'),
                duration: 10000
              });
              this.setState({
                step: 2,
                token: data.data.token
              })
            }
          }
        })
      }
      countDownInterval = setInterval(() => {
        this.setState({
          countDown: this.state.countDown - 1
        })
      }, 1000)
    }
  }

  //重发验证码
  resendEmailCode() {
    clearInterval(countDownInterval)
    this.setState({
      countDown: 60
    })
    countDownInterval = setInterval(() => {
      this.setState({
        countDown: this.state.countDown - 1
      })
    }, 1000)
    this.props.dispatch({
      type: 'user/fetchForgetPwdResendCode',
      payload: {
        email: this.state.email,
        token: this.state.token
      },
      callback: (data) => {
        if (data.success) {
          Notification({
            type: 'success',
            message: intl.get('RESEND'),
            duration: 10000
          });
        } else {
          Notification({
            title:intl.get('Reminder'),
            type: 'error',
            message: intl.get(data.msg),
            duration: 2000
          });
        }
      }
    })
  }

  //提交注册信息
  forgetPwdSubAction() {
    if (this.state.emailVerify && getPwdVerify(this.state.password) && (this.state.password === this.state.confirmPassword)
      && this.state.confirmPasswordVerify && this.state.verifyCode.trim()) {
      this.props.dispatch({
        type: 'user/fetchForgetPwd',
        payload: {
          email: this.state.email,
          token: this.state.token,
          pwd: this.state.password,
          repwd: this.state.confirmPassword,
          code: this.state.verifyCode
        },
        callback: (data) => {
          if (data.success) {
            this.props.dispatch(routerRedux.push('/newlogin'))
          } else {

          }
        }
      })
    }
  }

  render() {
    return (
      <div className={styles.userBg}>
        <div className={styles.register}>
          <div className={styles.userPanel}>
            <p className={styles.panelTitle} >
              {this.state.step == 1 ? intl.get("FORGET_PASSWORD") : intl.get("RESET_PASSWORD")}
            </p>
            <div className={styles.panelBody} >
              <div className={this.state.step == 1 ? styles.firstStep : ''}>
                <div className={styles.email}>
                  <p className={styles.title}>{intl.get("EMAIL")}*</p>
                  <input type="email"
                    onChange={(e) => this.emailChangeHandle(e)}
                    onBlur={e => this.emailHandle(e)}
                  />
                  <p className={(!this.state.emailVerify && this.state.email.length > 0) ? styles.error : ''}>邮箱格式不正确</p>
                  <p className={this.state.emailEmpty ? styles.error : ''}>{intl.get("REQUIRED")}</p>
                  <p className={this.state.emailExist ? '' : styles.error}>{intl.get("Email_nofind")}</p>
                </div>
                <div className={styles.userAction} >
                  <button
                    onClick={this.emailExistVerify.bind(this)}
                    className={this.state.emailFillFinish ? styles.infoFillOut : ''}
                  >{intl.get("CONFIRM")}</button>
                </div>
              </div>
              <div className={this.state.step == 2 ? styles.secondStep : ''}  >
                <div className={styles.password}>
                  <p className={styles.title}>{intl.get("PASSWORD")}*</p>
                  <input type="password"
                    onChange={(e) => { this.setState({ password: e.target.value }) }}
                    onBlur={e => this.passwordHandle(e)} />
                  <p className={this.state.passwordVerify ? '' : styles.error} >至少包含一个大写字母、特殊符号、小写字母和一个数字</p>
                </div>
                <div className={styles.confirmPassword}>
                  <p className={styles.title}>确认密码*</p>
                  <input type="password"
                    onChange={(e) => this.confirmPwdVerify(e)}
                    onBlur={e => this.confirmPasswordHandle(e)} />
                  <p className={this.state.confirmPasswordVerify ? '' : styles.error}>密码不一致</p>
                </div>
                <div className={styles.verificationCode}>
                  <p className={styles.title}>验证码*</p>
                  <input
                    type="text"
                    onChange={(e) => this.setState({ verifyCode: e.target.value })}
                  />
                  {
                    this.state.countDown <= 0 ? (<span
                      className={styles.resend}
                      onClick={(e) => this.resendEmailCode()}
                    >重新发送</span>) : (
                        <span
                          className={styles.resend +" "+ styles.disabled}
                        >{this.state.countDown}s后重新发送</span>
                      )
                  }

                </div>
                <div className={styles.userAction + " " + styles.userActionSec} >
                  <button
                    className={
                      this.state.emailVerify && this.state.passwordVerify && !this.state.emailEmpty && (this.state.password.length > 0)
                        && this.state.confirmPasswordVerify && this.state.verifyCode.trim() ? styles.infoFillOut : ''}
                    onClick={() => this.forgetPwdSubAction()}
                  >确认</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
