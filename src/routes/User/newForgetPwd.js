import React, { PureComponent, createElement } from 'react'
import { connect } from 'dva'
import { routerRedux, Link } from 'dva/router'
import { emailVerify, getPwdVerify } from '../../utils'
import styles from './newForgetPwd.less'
import { Notification } from 'element-react';
import logo_01 from '../../assets/images/logo.png'
import SelectLanguage from '../../components/SelectLanguage'
import intl from 'react-intl-universal'

let countDownInterval
@connect(state => ({}))
export default class NewForgetPwd extends PureComponent {
    static aa = () => { }
    state = {
        step: 1,
        email: '',
        emailEmpty: false,
        emailVerify: true,
        emailFillFinish: false,
        emailFocus: false,
        username: '',
        usernameVerify: true,
        password: '',
        passwordVerify: true,
        confirmPassword: '',
        confirmPasswordVerify: true,
        emailExist: true,
        token: '',
        verifyCode: '',
        passwordFocus: false,
        confirmPasswordFocus: false,
        verifyCodeFocus: false,
        countDown: 60
    }

    componentWillUnmount() {
        if (countDownInterval) {
            clearInterval(countDownInterval)
        }
        document.removeEventListener('keyup', this.keyupHandle, false);
    }

    componentDidMount() {
        document.addEventListener('keyup', this.keyupHandle, false);
    }

    keyupHandle = (evt) => {
        if (evt.keyCode === 13) {
            if (this.state.step === 1) this.emailExistVerify();
            if (this.state.step === 2) this.forgetPwdSubAction();
        }
    }

    emailChangeHandle(e) {
        this.setState({ email: e.target.value })
        if (emailVerify(this.state.email)) {
            this.setState({ emailFillFinish: true })
        }
    }
    emailHandle(e) {
        this.setState({
            emailFocus: false
        })
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
        this.setState({
            passwordVerify: getPwdVerify(this.state.password),
            passwordFocus: false
        })
    }
    confirmPasswordHandle() {
        this.state.password === this.state.confirmPassword
            ? this.setState({ confirmPasswordVerify: true }) : this.setState({ confirmPasswordVerify: false })
        this.setState({
            confirmPasswordFocus: false
        })
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
                        title:intl.get('Reminder'),
                        type: 'success',
                        message: intl.get('Verification_sent'),
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
                <div className={styles.language}>
                    <SelectLanguage />
                </div>
                <div className={styles.logo}>
                    <Link to='/'>
                        <img src={logo_01} />
                    </Link>

                </div>
                <div className={styles.sectionTitles}>
                    <div className={styles.sectionTitle}>
                        <span
                            className={this.state.sectionIndex === 1 ? styles.active : ''}
                            onClick={() => this.setState({ sectionIndex: 1 })}
                        >{intl.get("FORGET_PASSWORD")}</span>
                        {/* <span
                            className={this.state.sectionIndex === 2 ? styles.active : ''}
                            onClick={() => this.setState({ sectionIndex: 2 })}
                        >注册</span> */}
                        <p className={styles.loginBottomLine}></p>
                    </div>

                </div>
                <div className={styles.register}>
                    <div className={styles.userPanel}>

                        <div className={styles.panelBody} >
                            <div className={this.state.step == 1 ? styles.firstStep : ''}>
                                <div className={styles.email}>

                                    <input type="email"
                                        onChange={(e) => this.emailChangeHandle(e)}
                                        onBlur={e => this.emailHandle(e)}
                                        onFocus={(e) => this.setState({ emailFocus: true })}
                                    />
                                    <p className={this.state.emailFocus || this.state.email.trim() ? styles.focusTitle : styles.title}>{intl.get("EMAIL")}*</p>
                                    <p className={(!this.state.emailVerify && this.state.email.length > 0) ? styles.error : ''}>{intl.get("EMAIL_FORMAT_IS_INCORRECT")}</p>
                                    <p className={this.state.emailEmpty ? styles.error : ''}>{intl.get("REQUIRED")}</p>
                                </div>
                                <div className={styles.userAction} >
                                    <button
                                        onClick={this.emailExistVerify.bind(this)}
                                        className={styles.infoFillOut}
                                    >{intl.get("CONFIRM")}</button>
                                </div>
                            </div>
                            <div className={this.state.step == 2 ? styles.secondStep : ''}  >
                                <div className={styles.password}>

                                    <input type="password"
                                        onChange={(e) => { this.setState({ password: e.target.value }) }}
                                        onBlur={e => this.passwordHandle(e)}
                                        onFocus={(e) => this.setState({ passwordFocus: true })}
                                    />
                                    <p className={this.state.passwordFocus || this.state.password.trim() ? styles.focusTitle : styles.title}>{intl.get("NEW_PASSWORD")}*</p>
                                    <p className={this.state.passwordVerify ? '' : styles.error} >{intl.get("IT_CONTAINS_AT_LEAST_ONE")}</p>
                                </div>
                                <div className={styles.confirmPassword}>

                                    <input type="password"
                                        onChange={(e) => this.confirmPwdVerify(e)}
                                        onBlur={e => this.confirmPasswordHandle(e)}
                                        onFocus={(e) => this.setState({ confirmPasswordFocus: true })}
                                    />
                                    <p className={this.state.confirmPasswordFocus || this.state.confirmPassword.trim() ? styles.focusTitle : styles.title}>{intl.get("CONFIRM_PASSWORD")}*</p>
                                    <p className={this.state.confirmPasswordVerify ? '' : styles.error}>{intl.get("INCONSISTENT_PASSWORD")}</p>
                                </div>
                                <div className={styles.verificationCode}>

                                    <input
                                        type="text"
                                        onChange={(e) => this.setState({ verifyCode: e.target.value })}
                                        onBlur={e => this.setState({ verifyCodeFocus: false })}
                                        onFocus={(e) => this.setState({ verifyCodeFocus: true })}
                                    />
                                    <p className={this.state.verifyCodeFocus || this.state.verifyCode.trim() ? styles.focusTitle : styles.title}>{intl.get("VERIFICATION_CODE")}*</p>
                                    {
                                        this.state.countDown <= 0 ? (<span
                                            className={styles.resend}
                                            onClick={(e) => this.resendEmailCode()}
                                        >{intl.get("RESEND")}</span>) : (
                                                <span
                                                    className={styles.resend + " " + styles.disabled}
                                                >{this.state.countDown}s{intl.get("RESEND_AFTER_S")}</span>
                                            )
                                    }

                                </div>
                                <div className={styles.userAction + " " + styles.userActionSec} >
                                    <button
                                        className={
                                            this.state.emailVerify && this.state.passwordVerify && !this.state.emailEmpty && (this.state.password.length > 0)
                                                && this.state.confirmPasswordVerify && this.state.verifyCode.trim() ? styles.infoFillOut : ''}
                                        onClick={() => this.forgetPwdSubAction()}
                                    >{intl.get("CONFIRM")}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
