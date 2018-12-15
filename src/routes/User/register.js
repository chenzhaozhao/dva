import React, { PureComponent, createElement } from 'react'
import { connect } from 'dva'
import { Link, routerRedux } from 'dva/router'
import { emailVerify, getPwdVerify } from '../../utils'
import styles from './register.less'
import images from '../../common/images'
import { Notification} from 'element-react'
import intl from 'react-intl-universal'

let countDownInterval
@connect(state => ({
  user: state.user
}))
export default class Register extends PureComponent {
  static aa = () => { }
  state = {
    step: 1,
    email: '',
    emailEmpty: false,
    emailVerify: true,
    username: '',
    usernameVerify: true,
    usernameLengthVerify: true,
    password: '',
    passwordVerify: {result:true,content:''},
    confirmPassword: '',
    confirmPasswordVerify: true,
    read: false,
    invitationnumber: '',
    repeatVerify: true,
    token: null,
    verifyCode: '',
    countDown: 60
  }

  componentDidMount() {
    if (this.props.match.params.fid && this.props.match.params.fid.trim()) {
      this.setState({ invitationnumber: this.props.match.params.fid })
    }
  }

  componentWillUnmount() {
    if (countDownInterval) {
      clearInterval(countDownInterval)
    }
  }

  hasRead() {
    this.setState({
      read: !this.state.read
    })
  }
  emailVerify() {
    if (this.state.email.length == 0) {
      this.setState({
        emailEmpty: true
      })
      return
    } else {
      this.setState({
        emailEmpty: false,
        countDown: 60
      })
      this.setState({ emailVerify: emailVerify(this.state.email) })
      //邮箱验证提交
      if (this.state.emailVerify) {
        this.props.dispatch({
          type: 'user/fetchRegisterEmailVerify',
          payload: {
            email: this.state.email
          },
          callback: (data) => {
            this.setState({
              step: 2,
              token: data.data.token
            })
            Notification({
              title:intl.get('Reminder'),
              type: 'success',
              message: intl.get('Code_send_email'),
              duration: 10000
            });
          }
        })

      }
    }
    countDownInterval = setInterval(() => {
      this.setState({
        countDown: this.state.countDown - 1
      })
    }, 1000)
  }
  emailHandle(e) {
    if (this.state.email.length == 0) {
      this.setState({
        emailEmpty: true
      })
      return
    } else {
      this.setState({ emailEmpty: false })
      this.setState({ emailVerify: emailVerify(this.state.email) })
    }
  }
  usernameHandle() {
    if (this.state.username.length < 4) {
      this.setState({ usernameLengthVerify: false })
      return
    }
    if (!this.state.usernameLengthVerify) {
      return
    }
    if (this.state.username.trim().length > 0) {
      this.setState({ usernameVerify: true })
      this.props.dispatch({
        type: 'user/fetchRegisterUsername',
        payload: {
          nickname: this.state.username
        },
        callback: (data) => {
          if (data.success) {
            this.setState({ repeatVerify: true })
          } else {
            this.setState({ repeatVerify: false })
          }
        }
      })
    } else {
      this.setState({ usernameVerify: false })
    }
  }
  usernameValueHandle(e) {
    let usernameLengthValue = this.state.username.length
    this.setState({ username: e.target.value })
    if (this.state.username.length < 15) {
      this.setState({ usernameLengthVerify: true })
      if (usernameLengthValue > e.target.value.length && this.state.username.length < 5) {
        this.setState({ usernameLengthVerify: false })
      }
    } else {
      this.setState({ usernameLengthVerify: false })
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
      type: 'user/fetchRegisterEmailVerify',
      payload: {
        email: this.state.email
      },
      callback: (data) => {
        Notification({
          title:intl.get('Reminder'),
          type: 'success',
          message: intl.get('RESEND'),
          duration: 10000
        });
        this.setState({
          step: 2,
          token: data.data.token
        })
      }
    })
  }

  //提交注册信息
  registerAction() {
    if (this.state.usernameVerify && this.state.passwordVerify
      && this.state.confirmPasswordVerify && this.state.repeatVerify
      && this.state.verifyCode.trim() && this.state.usernameLengthVerify) {
      this.props.dispatch({
        type: 'user/fetchRegister',
        payload: {
          email: this.state.email,
          token: this.state.token,
          nickname: this.state.username,
          password: this.state.password,
          ref: this.state.invitationnumber,
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
//密码校验
  passwordHandle() {
    const VerifyResult=getPwdVerify(this.state.password);
    this.setState({ passwordVerify: VerifyResult });
    console.log(this.state.passwordVerify)
  }
  confirmPasswordHandle() {
    this.state.password === this.state.confirmPassword ? this.setState({ confirmPasswordVerify: true }) : this.setState({ confirmPasswordVerify: false })
  }
  verificationCodeHandle() { }
  invitationnumberChange(e) {
    this.setState({ invitationnumber: e.target.value })
  }
  render() {
    return (
      <div className={styles.userBg}>
        <div className={styles.register}>
          <div className={styles.userPanel}>
            <p className={styles.panelTitle} >
              注册Crebe账号
            </p>
            <div className={styles.panelBody} >
              <div className={this.state.step == 1 ? styles.firstStep : ''}>
                <div className={styles.email}>
                  <p className={styles.title}>邮箱*</p>
                  <input
                    type="email"
                    onChange={(e) => { this.setState({ email: e.target.value }) }}
                    onBlur={e => this.emailHandle(e)}
                    value={this.state.email}
                  />
                  <p
                    className={(!this.state.emailVerify && this.state.email.length > 0) ? styles.error : ''}
                  >邮箱格式不正确</p>
                  <p className={this.state.emailEmpty ? styles.error : ''}>必填</p>
                </div>
                <div className={styles.userAction} >
                  <button
                    onClick={this.emailVerify.bind(this)}
                  >注册</button>
                </div>
              </div>
              <div className={this.state.step == 2 ? styles.registerInfo : ''}>
                <div className={styles.email} >
                  <p className={styles.title}>邮箱*</p>
                  <input type="email" value={this.state.email} readOnly="readOnly" />
                </div>
                <div className={styles.username}>
                  <p className={styles.title}>昵称*</p>
                  <input
                    type="text"
                    onChange={(e) => { this.usernameValueHandle(e) }}
                    onBlur={e => this.usernameHandle(e)}
                  />
                  <p className={this.state.usernameVerify ? '' : styles.error}>必填</p>
                  <p className={this.state.usernameLengthVerify ? '' : styles.error}>长度无效,不能少于4个字符,也不能多于15个字符</p>
                  <p className={(!this.state.usernameVerify || this.state.repeatVerify) ? '' : styles.error}>昵称已被使用</p>
                </div>
                <div className={styles.password}>
                  <p className={styles.title}>密码*</p>
                  <input type="password"
                    onChange={(e) => { this.setState({ password: e.target.value }) }}
                    onBlur={e => this.passwordHandle(e)} />
                  <p
                    className={this.state.passwordVerify.result ? '' : styles.error}
                  >{this.state.passwordVerify.content}</p>
                </div>
                <div className={styles.confirmPassword}>
                  <p className={styles.title}>确认密码*</p>
                  <input type="password"
                    onChange={(e) => { this.setState({ confirmPassword: e.target.value }) }}
                    onBlur={e => this.confirmPasswordHandle(e)}
                  />
                  <p className={this.state.confirmPasswordVerify ? '' : styles.error}>密码不一致</p>
                </div>
                <div className={styles.verificationCode}>
                  <p className={styles.title}>验证码*</p>
                  <input
                    type="text"
                    onBlur={e => this.verificationCodeHandle(e)}
                    onChange={(e) => { this.setState({ verifyCode: e.target.value }) }}
                  />
                  {
                    this.state.countDown <= 0 ?
                      (<span
                        className={styles.resend}
                        onClick={this.resendEmailCode.bind(this)}
                      >重新发送</span>) : (
                        <span
                          className={styles.resend + " " + styles.disabled}
                        >{this.state.countDown}s后重新发送</span>
                      )
                  }

                </div>
                <div className={styles.invitationCode}>
                  <p className={styles.title}>邀请码(选填)</p>
                  <input
                    type="text"
                    value={this.state.invitationnumber}
                    onChange={(e) => this.invitationnumberChange(e)}
                  />
                </div>
                <div className={styles.userAction + " " + styles.userActionSec} >
                  <div>
                    <img
                      onClick={this.hasRead.bind(this)}
                      src={this.state.read ? images.checkbox_select : images.checkbox_default}
                    />我已阅读并同意
                      <Link target='_blank' to='/protocol'>用户协议</Link> 和 <Link target='_blank' to='/privacy'>隐私政策</Link>
                  </div>
                  <button
                    className={
                      this.state.read && this.state.usernameVerify
                        && this.state.passwordVerify && this.state.confirmPasswordVerify
                        && this.state.repeatVerify && this.state.verifyCode.trim() && this.state.usernameLengthVerify ?
                        '' : styles.infoFillOut}
                    onClick={this.registerAction.bind(this)}
                  >注册</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}


Register.propTypes = {
}
