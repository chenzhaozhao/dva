import React, {PureComponent, createElement} from 'react'
import {connect} from 'dva'
import {Link, routerRedux} from 'dva/router'
import {emailVerify, getPwdVerify, tokenVerify,saveUserInfo} from '../../utils'
import styles from './newLogin.less'
import logo_01 from '../../assets/images/logo.png'
import images from '../../common/images'
import SelectLanguage from '../../components/SelectLanguage'
import {Notification} from 'element-react'
import intl from 'react-intl-universal'

let countDownInterval;

@connect(state => ({
    user: state.user
}))
export default class NewLogin extends PureComponent {
    constructor() {
        super()
        this.state = {
            loginStep: 1,
            loginEmail: '',
            emailEmpty: false,
            emailVerify: true,
            loginEmailFocus: false,
            pwd: '',
            pwdVerify: true,
            loginPwdFocus: false,
            firstLogin: true,
            loginVerifycode: '',
            emailResponseVerify: false,
            sectionIndex: 1,
            step: 1,
            //注册相关
            email: '',
            regemailEmpty: false,
            regemailVerify: true,
            regEmailFocus: false,
            username: '',
            usernameVerify: true,
            usernameLengthVerify: true,
            regUsernameFocus: false,
            password: '',
            passwordVerify: {result: true, content: ''},
            regPwdFocus: false,
            confirmPassword: '',
            confirmPasswordVerify: true,
            regConfirmPwdFocus: false,
            read: false,
            invitationnumber: '',
            regInvitationnumberFocus: false,
            repeatVerify: true,
            token: null,
            verifyCode: '',
            regVerifyCodeFocus: false,
            countDown: 60,
        };
        this.verifyIsTrure = this.verifyIsTrure.bind(this);
    }


    componentWillMount() {
        //let flag = IsPC()

        if (tokenVerify()) {
            this.props.dispatch(routerRedux.push(`/home`))
        }
        //判断是注册还是登录
        if (this.props.match.params.tab) {
            this.state.sectionIndex = this.props.match.params.tab.trim()
            console.log(`注册传参接收1`, this.props.match.params.tab)
            console.log(`注册传参接收2`, this.state.loginStep)
        }
    }

    handle(e) {
        this.setState({loginEmailFocus: false})
        if (this.state.loginEmail.length == 0) {
            this.setState({
                emailEmpty: true
            })
            return
        } else {
            this.state.emailEmpty = false
            this.setState({emailVerify: emailVerify(this.state.loginEmail)})
        }
    }

    pwdHandle(e) {
        let status = this.state.pwd && this.state.pwd.trim() ? true : false
        this.setState({
            pwdVerify: status,
            loginPwdFocus: false
        })
    }

    cancleForgetPwdAction() {
        this.setState({
            loginStep: 1
        })
    }

    changeEmailValue(e) {
        if ((/\s/g).test(e.target.value)) {
            return
        }
        this.setState({
            loginEmail: (e.target.value).trim()
        }, () => this.handle(e))
    }

    login() {

        if (this.verifyIsTrure()) {
            return
        }
        if (this.state.loginEmail.length == 0) {
            this.state.emailEmpty = true
            return
        } else if (!emailVerify(this.state.loginEmail)) {
            this.state.emailVerify = false
            return
        }
        if (!this.state.pwd.trim()) {
            this.state.pwdVerify = false
            return
        }

        this.props.dispatch({
            type: 'user/fetchLogin',
            payload: {
                email: this.state.loginEmail,
                password: this.state.pwd
            },
            callback: (data) => {
                this.setState({firstLogin: false})
                if (data.success) {
                    if (data.data.code === 1) {
                        saveUserInfo('_token_', data.data.token);
                        saveUserInfo('_userid_', data.data.userid);
                        this.props.dispatch({
                            type: 'user/fetchUserInfo',
                            payload: {}
                        })
                        this.props.dispatch(routerRedux.push('/manager/safeConfig/safeCertify'))

                    } else if (data.data.code === -1) {
                        // Notification({
                        //   title:intl.get('Reminder'),
                        //   message: intl.get(data.msg),
                        //   type: 'error'
                        // });
                        this.setState({
                            loginStep: 2
                        })
                    }

                } else {
                    Notification({
                        title: intl.get('Reminder'),
                        message: intl.get(data.msg),
                        type: 'error'
                    });
                }

            }
        })

    }

    loginVerify() {
        if (!this.state.loginVerifycode.trim()) {
            return
        }
        this.props.dispatch({
            type: 'user/fetchLoginVerify',
            payload: {
                secondcode: this.state.loginVerifycode,
                token: this.props.user.token,
                userid: this.props.user.userid
            },
            callback: (data) => {
                if (data.success) {
                    this.props.dispatch({
                        type: 'user/fetchUserInfo',
                        payload: {}
                    })
                    this.props.dispatch(routerRedux.push('/manager/safeConfig/safeCertify'))

                }
            }
        })
    }

    //注册相关
    componentDidMount() {
        if (this.props.match.params.fid && this.props.match.params.fid.trim()) {
            this.setState({invitationnumber: this.props.match.params.fid})
        }
        document.addEventListener('keyup', this.keyupHandle, false);
    }

    componentWillUnmount() {
        if (countDownInterval) {
            clearInterval(countDownInterval)
        }
        document.removeEventListener('keyup', this.keyupHandle, false);
    }

    keyupHandle = (evt) => {
        if (evt.keyCode === 13) {
            if (this.state.sectionIndex === 1) {
                this.state.step === 1 ? this.login() : this.loginVerify();
            }
            if (this.state.sectionIndex === 2) {
                this.state.step === 1 ? this.regemailVerify() : this.registerAction();
            }
        }
    }

    hasRead() {
        this.setState({
            read: !this.state.read
        })
    }

    getRegemailVerifyResult() {
        if (this.state.email.length == 0) {
            return false
        } else {
            console.log(emailVerify(this.state.email));
            return emailVerify(this.state.email)
        }
    }

    regemailVerify() {
        if (this.state.email.length == 0) {
            this.setState({
                regemailVerify: true
            })
            return
        } else {
            this.setState({
                regemailVerify: false,
                countDown: 60
            })
            this.setState({regemailVerify: emailVerify(this.state.email)})
            //邮箱验证提交
            if (this.state.regemailVerify) {
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
                        // Message({
                        //   type: 'success',
                        //   message: '邮箱验证码已发送',
                        //   duration: 10000
                        // });
                        Notification({
                            title: intl.get('Reminder'),
                            message: intl.get('Code_send_email'),
                            type: 'success'
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
        this.setState({
            regEmailFocus: false
        })
        if (this.state.email.length == 0) {
            this.setState({
                regemailEmpty: true
            })
            return
        } else {
            this.setState({regemailEmpty: false})
            this.setState({regemailVerify: emailVerify(this.state.email)})
        }
    }

    usernameHandle() {
        this.setState({
            regUsernameFocus: false
        })
        if (this.state.username.length < 4) {
            this.setState({usernameLengthVerify: false})
            return
        }
        if (!this.state.usernameLengthVerify) {
            return
        }
        if (this.state.username.trim().length > 0) {
            this.setState({usernameVerify: true})
            this.props.dispatch({
                type: 'user/fetchRegisterUsername',
                payload: {
                    nickname: this.state.username
                },
                callback: (data) => {
                    if (data.success) {
                        this.setState({repeatVerify: true})
                    } else {
                        this.setState({repeatVerify: false})
                    }
                }
            })
        } else {
            this.setState({usernameVerify: false})
        }
    }

    usernameValueHandle(e) {
        const {username} = this.state;
        if ((/\s/g).test(e.target.value)) {
            this.setState({username})
            return
        }
        // let usernameLengthValue = this.state.username.length
        const val = (e.target.value).trim().replace(/\s/g, "");
        this.setState({username: (e.target.value).trim().replace(/\s/g, "")});
        /* if (this.state.username.length < 15) {
          this.setState({ usernameLengthVerify: true })
          if (usernameLengthValue > e.target.value.length && this.state.username.length < 5) {
            this.setState({ usernameLengthVerify: false })
          }
        } else {
          this.setState({ usernameLengthVerify: false })
        } */
        if (val.length >= 4 && val.length < 15) {
            this.setState({usernameLengthVerify: true})
        } else {
            this.setState({usernameLengthVerify: false})
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
                    title: intl.get('Reminder'),
                    type: 'success',
                    message: intl.get('RESEND'),
                    duration: 1000
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
        // this.props.history.push('/newlogin');
        if (this.state.usernameVerify && this.state.passwordVerify.result
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
                        // let flag = IsPC();
                        // if (!flag) {
                        //   this.props.dispatch(routerRedux.push(`/posterPage/${data.data.userid}`))
                        // } else {
                        setTimeout(() => {
                            this.props.history.push('/newlogin');
                            window.location.reload();
                        }, 1000)
                        // }

                    } else {

                    }
                }
            })
        }
    }

    passwordHandle(password) {
        const VerifyResult = getPwdVerify(password);
        this.setState({
            passwordVerify: VerifyResult,
            regPwdFocus: false,
            password
        })
    }

    confirmPasswordHandle() {
        this.state.password === this.state.confirmPassword ? this.setState({confirmPasswordVerify: true}) : this.setState({confirmPasswordVerify: false});
        this.setState({
            regConfirmPwdFocus: false
        })
    }

    invitationnumberChange(e) {
        this.setState({invitationnumber: (e.target.value).trim()})
    }

    verificationCodeHandle() {
        this.setState({
            regVerifyCodeFocus: false
        })
    }

    verifyIsTrure() {
        const {pwd, loginEmail} = this.state;
        if (pwd && loginEmail) {
            return ((!this.state.emailVerify && this.state.loginEmail.length > 0) && (!this.state.emailEmpty || this.state.loginEmail.trim()) && this.state.pwdVerify) && (this.props.user.success || this.state.firstLogin)
        } else {
            return true;
        }

    }

    render() {
        return (
            <div className={styles.userBg}>
                <div className={styles.language}>
                    <SelectLanguage/>
                </div>
                <div className={styles.logo}>
                    <Link to='/'>
                        <img src={logo_01}/>
                    </Link>

                </div>
                <div className={styles.sectionTitles}>
                    <div className={styles.sectionTitle}>
            <span
                className={this.state.sectionIndex === 1 ? styles.active : ''}
                onClick={() => this.setState({sectionIndex: 1})}
            >{intl.get("LOGIN")}</span>
                        <span
                            className={this.state.sectionIndex === 2 ? styles.active : ''}
                            onClick={() => this.setState({sectionIndex: 2})}
                        >{intl.get("REGISTER")}</span>
                        <p className={this.state.sectionIndex === 1 ? styles.loginBottomLine : styles.regBottomLine}></p>
                    </div>

                </div>

                <div className={this.state.sectionIndex === 1 ? styles.loginSection : styles.hidden}>
                    <div
                        className={this.state.loginStep == 1 ? styles.userPanel + " " + styles.display : styles.userPanel}>

                        <div className={styles.panelBody}>
                            <div className={styles.email}>

                                <input type="email"
                                       onChange={(e) => this.changeEmailValue(e)}
                                       onBlur={e => this.handle(e)}
                                       onFocus={(e) => this.setState({loginEmailFocus: true})}
                                       value={this.state.loginEmail}
                                       autoComplete="off"
                                />
                                <p
                                    className={this.state.loginEmailFocus || this.state.loginEmail.trim() ? styles.focusTitle : styles.title}
                                >{intl.get("EMAIL")}*</p>
                                <p
                                    className={(!this.state.emailVerify && this.state.loginEmail.length > 0) ? styles.error : ''}>{intl.get("EMAIL_FORMAT_IS_INCORRECT")}</p>
                                <p className={!this.state.emailEmpty || this.state.loginEmail.trim() ? '' : styles.error}>{intl.get("REQUIRED")}</p>
                                {/* <p className={this.state.emailResponseVerify? styles.error : ''}>必填</p> */}
                            </div>
                            <div className={styles.password}>

                                <input type="password"
                                       onChange={(e) => {
                                           if ((/\s/g).test(e.target.value)) {
                                               return
                                           }
                                           this.setState({pwd: (e.target.value).trim()})
                                       }}
                                       onBlur={e => this.pwdHandle(e)}
                                       onFocus={(e) => this.setState({loginPwdFocus: true})}
                                       value={this.state.pwd}
                                       autoComplete="off"
                                />

                                <p
                                    className={this.state.loginPwdFocus || this.state.pwd.trim() ? styles.focusTitle : styles.title}
                                >{intl.get("PASSWORD")}*</p>
                                <Link to='/newforgetpwd'
                                      className={styles.forgetPwd}>{intl.get("FORGET_PASSWORD")}</Link>
                                <p
                                    className={this.props.user.success || this.state.firstLogin ? '' : styles.error}
                                >{intl.get("MAIN_OR_PASSWORD_IS_INCORRECT")}</p>
                                <p
                                    className={this.state.pwdVerify ? '' : styles.error}
                                >{intl.get("REQUIRED")}</p>
                            </div>
                        </div>
                        <div className={styles.userAction}>
                            {/*<Button className={styles.green} loading={true}>登录</Button>*/}
                            <button
                                className={this.verifyIsTrure() ? styles.disabled : styles.green}
                                onClick={() => this.login()}
                            >{intl.get("LOGIN")}
                            </button>
                        </div>
                    </div>
                    <div

                        className={this.state.loginStep == 2 ? styles.verifyPanel + " " + styles.display : styles.verifyPanel}
                    >
                        <div className={styles.mask}></div>
                        <div
                            className={this.state.loginStep == 2 ? styles.userPanel + " " + styles.display : styles.userPanel}>
                            <p className={styles.panelTitle}>
                                {intl.get("VERIFICATION_CODE")}
                            </p>
                            <div className={styles.panelBody}>
                                <div className={styles.email}>
                                    <p className={styles.tips}>{intl.get("ENTER_YOUR_GOOLER_VERIFICATION_CODE")}</p>

                                    <input
                                        type="text"
                                        onChange={(e) => {
                                            if ((/\s/g).test(e.target.value)) {
                                                return
                                            }
                                            this.setState({loginVerifycode: (e.target.value).trim()})
                                        }}
                                        value={this.state.loginVerifycode}
                                        onFocus={(e) => this.setState({loginVerifycodeFocus: true})}
                                        onBlur={(e) => this.setState({loginVerifycodeFocus: false})}
                                        autoComplete="off"
                                    />
                                    <p
                                        className={this.state.loginVerifycodeFocus || this.state.loginVerifycode.trim() ? styles.focusTitle : styles.title}
                                    >{intl.get("VERIFICATION_CODE")}*</p>
                                    <p
                                        className={this.state.loginVerifycode.trim() ? '' : styles.error}
                                    >{intl.get("REQUIRED")}</p>
                                </div>
                                <div className={styles.action}>
                                    <button
                                        className={styles.defaultGreen}
                                        onClick={this.cancleForgetPwdAction.bind(this)}
                                    >{intl.get("CANCEL")}
                                    </button>
                                    <button
                                        className={styles.green}
                                        onClick={(e) => this.loginVerify()}
                                    >{intl.get("SUBMIT")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={this.state.sectionIndex == 2 ? styles.registerSection : styles.hidden}>
                    <div className={styles.register}>
                        <div className={styles.userPanel}>
                            <div className={styles.panelBody}>
                                <div className={this.state.step == 1 ? styles.firstStep : ''}>
                                    <div className={styles.email}>


                                        <input
                                            type="email"
                                            onChange={(e) => {
                                                if ((/\s/g).test(e.target.value)) {
                                                    return
                                                }
                                                this.setState({email: (e.target.value).trim()}, () => this.emailHandle(e))
                                            }}
                                            onBlur={e => this.emailHandle(e)}
                                            value={this.state.email}
                                            onFocus={(e) => this.setState({regEmailFocus: true})}
                                        />
                                        <p
                                            className={this.state.regEmailFocus || this.state.email.trim() ? styles.focusTitle : styles.title}
                                        >{intl.get("EMAIL")}*</p>
                                        <p
                                            className={(!this.state.regemailVerify && this.state.email.length > 0) ? styles.error : ''}
                                        >{intl.get("EMAIL_FORMAT_IS_INCORRECT")}</p>
                                        <p className={this.state.regemailEmpty ? styles.error : ''}>{intl.get("REGISTER")}</p>
                                    </div>
                                    <div className={styles.userAction}>
                                        <button
                                            className={!this.getRegemailVerifyResult() ? styles.disabled2 : ""}
                                            onClick={this.regemailVerify.bind(this)}
                                        >{intl.get("REGISTER")}
                                        </button>
                                    </div>
                                </div>
                                <div className={this.state.step == 2 ? styles.registerInfo : ''}>
                                    <div className={styles.email}>
                                        <p className={styles.title}>{intl.get("EMAIL")}*</p>
                                        <input type="email" value={this.state.email} readOnly="readOnly"/>
                                    </div>
                                    <div className={styles.username}>

                                        <input
                                            type="text"
                                            onChange={(e) => {
                                                if ((/\s/g).test(e.target.value)) {
                                                    return
                                                }
                                                this.usernameValueHandle(e)
                                            }}
                                            value={this.state.username}
                                            onBlur={e => this.usernameHandle(e)}
                                            onFocus={(e) => this.setState({regUsernameFocus: true})}
                                        />
                                        <p
                                            className={this.state.regUsernameFocus || this.state.username.trim() ? styles.focusTitle : styles.title}
                                        >{intl.get("NICK_NAME")}*</p>
                                        <p className={this.state.usernameVerify ? '' : styles.error}>{intl.get("REQUIRED")}</p>
                                        <p className={this.state.usernameLengthVerify ? '' : styles.error}>{intl.get("LESS_THAN_CHARACTERS_MORE_THAN_CHARACTERS")}</p>
                                        {<p
                                            className={(this.state.regUsernameFocus || this.state.repeatVerify) ? '' : styles.error}>{intl.get("NICK_NAME_HAS_BEEN_USED")}</p>}
                                    </div>
                                    <div className={styles.password}>

                                        <input
                                            type="password"
                                            onChange={e => {
                                                if ((/\s/g).test(e.target.value)) {
                                                    return
                                                }
                                                this.passwordHandle((e.target.value).trim())
                                            }}
                                            onBlur={e => {
                                                if ((/\s/g).test(e.target.value)) {
                                                    return
                                                }
                                                this.passwordHandle((e.target.value).trim())
                                            }}
                                            value={this.state.password}
                                            onFocus={(e) => this.setState({regPwdFocus: true})}
                                        />
                                        <p
                                            className={this.state.regPwdFocus || this.state.password.trim() ? styles.focusTitle : styles.title}
                                        >{intl.get("PASSWORD")}*</p>
                                        <p className={this.state.passwordVerify.result ? '' : styles.error}
                                        >{this.state.passwordVerify.content}</p>
                                    </div>
                                    <div className={styles.confirmPassword}>

                                        <input type="password"
                                               onChange={(e) => {
                                                   if ((/\s/g).test(e.target.value)) {
                                                       return
                                                   }
                                                   this.setState({confirmPassword: (e.target.value).trim()}, () => this.confirmPasswordHandle(e))
                                               }}
                                               value={this.state.confirmPassword}
                                               onBlur={e => this.confirmPasswordHandle(e)}
                                               onFocus={(e) => this.setState({regConfirmPwdFocus: true})}
                                        />
                                        <p
                                            className={this.state.regConfirmPwdFocus || this.state.confirmPassword.trim() ? styles.focusTitle : styles.title}
                                        >{intl.get("CONFIRM_PASSWORD")}*</p>
                                        <p className={this.state.confirmPasswordVerify ? '' : styles.error}>{intl.get("INCONSISTENT_PASSWORD")}</p>
                                    </div>
                                    <div className={styles.verificationCode}>

                                        <input
                                            type="text"
                                            onBlur={e => this.verificationCodeHandle(e)}
                                            value={this.state.verifyCode}
                                            onChange={(e) => {
                                                if ((/\s/g).test(e.target.value)) {
                                                    return
                                                }
                                                this.setState({verifyCode: (e.target.value).trim()})
                                            }}
                                            onFocus={(e) => this.setState({regVerifyCodeFocus: true})}
                                        />
                                        <p
                                            className={this.state.regVerifyCodeFocus || this.state.verifyCode.trim() ? styles.focusTitle : styles.title}
                                        >{intl.get("VERIFICATION_CODE")}*</p>
                                        {
                                            this.state.countDown <= 0 ?
                                                (<span
                                                    className={styles.resend}
                                                    onClick={this.resendEmailCode.bind(this)}
                                                >{intl.get("RESEND")}</span>) : (
                                                    <span
                                                        className={styles.resend + " " + styles.disabled}
                                                    >{this.state.countDown}{intl.get("RESEND_AFTER_S")}</span>
                                                )
                                        }

                                    </div>
                                    <div className={styles.invitationCode}>

                                        <input
                                            type="text"
                                            value={this.state.invitationnumber}
                                            onChange={(e) => this.invitationnumberChange(e)}
                                            onBlur={(e) => this.setState({regInvitationnumberFocus: false})}
                                            onFocus={(e) => this.setState({regInvitationnumberFocus: true})}
                                        />
                                        <p
                                            className={this.state.regInvitationnumberFocus || this.state.invitationnumber.trim() ? styles.focusTitle : styles.title}
                                        >{intl.get("INVICATION_CODE")}</p>
                                    </div>
                                    <div className={styles.userAction + " " + styles.userActionSec}>
                                        <div>
                                            <img
                                                onClick={this.hasRead.bind(this)}
                                                src={this.state.read ? images.checkbox_select : images.checkbox_default}
                                            />{intl.get("I_HAVE_READ_AND_AGREED")}
                                            <Link target='_blank'
                                                  to='/protocol'>{intl.get("USER_AGREEMENT")}</Link> {intl.get("AND")}
                                            <Link target='_blank' to='/privacy'>{intl.get("PRIVACY_POLICY")}</Link>
                                        </div>
                                        <button
                                            className={
                                                this.state.read && this.state.usernameVerify
                                                && this.state.passwordVerify.result && this.state.confirmPasswordVerify
                                                && this.state.repeatVerify && this.state.verifyCode.trim() && this.state.usernameLengthVerify ?
                                                    '' : styles.infoFillOut}
                                            onClick={this.registerAction.bind(this)}
                                        >{intl.get("REGISTER")}
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className={styles.retrunindex}>
                    {/*<button>返回首頁</button>*/}
                    <Link to="/">{intl.get("BACK_TO_HOME")}</Link>
                </div>
            </div>

        )
    }
}

NewLogin.propTypes = {}

//export default connect()(Login)
