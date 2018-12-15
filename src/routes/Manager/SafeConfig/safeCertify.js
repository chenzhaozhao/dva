// 安全认证
import React, {PureComponent} from 'react'
import {connect} from 'dva'
import {routerRedux, Link} from 'dva/router'
import styles from './safeCertify.less'
import {getPwdVerify, clearUserInfo, checkMobile} from '../../../utils'
import {Layout, Button, Form, Input} from 'element-react'
import {Dialog, Notification} from 'element-react'
import googleVerify_01 from '../../../assets/images/googleVerify_01.png'
import googleVerify_02 from '../../../assets/images/googleVerify_02.png'
import googleVerify_04 from '../../../assets/images/googleVerify_04.png'
import warning from '../../../assets/images/warning.png'
import QRCode from 'qrcode.react'
//import { GoogleVerifyStatus } from '../../../services/manager';
import intl from 'react-intl-universal'

@connect(state => ({
    user: state.user
}))
export default class SafeCertify extends PureComponent {
    state = {
        bindPhoneDialogVisible: false,
        modifyPasswordDialogVisible: false,
        resetTransPasswordDialogVisible: false,
        bindPhoneForm: {},
        modifyPasswordForm: {},
        resetTransPasswordForm: {},
        bindPhone: false,
        bindGoogleDialogVisible: false,
        openGoogleDialogVisible: false,
        closeGoogleDialogVisible: false,
        googleVerifyStep: 1,
        phoneFocus: false,
        phoneNumber: '',
        phoneNumberVerify: true,
        newPwd: '',
        confirmPwd: '',
        currentPwd: '',
        firstType: true,
        passwordVerify: true,
        confirmPwdVerify: true,
        newTradePwd: '',
        newTradePwdVerify: true,
        confirmTradePwd: '',
        tradeFirstType: true,
        emailVerify: true,
        verificationcode: '',
        verificationCodeFirstType: true,
        googleVerifyCode: '',
        loginPwd: '',
        googleVerifyCodeValue: '',
        GoogleVerifyStatus: false
    }

    componentDidMount() {
        this.fetchGoogleVerifyStatus()
        this.fetchGoogleVerifyKey()
    }

    fetchGoogleVerifyStatus() {
        this.props.dispatch({
            type: 'safeCertify/fetchGoogleVerifyStatus',
            payload: {},
            callback: (data) => {
                if (data.success) {
                    this.setState({
                        openGoogleDialogVisible: false,
                        GoogleVerifyStatus: true
                    })
                } else {
                    this.setState({
                        openGoogleDialogVisible: true,
                        GoogleVerifyStatus: false
                    })
                }
            }
        })
    }

    fetchGoogleVerifyKey() {
        this.props.dispatch({
            type: 'safeCertify/fetchGoogleVerifyKey',
            payload: {},
            callback: (data) => {
                if (data.success) {
                    console.log(data)
                    this.setState({
                        googleVerifyCode: data.data.loginsecret
                    })
                }
            }
        })
    }

    fetchGoogleVerifyStatusChange(status) {
        this.props.dispatch({
            type: 'safeCertify/fetchGoogleVerifyStatusChange',
            payload: {
                status: status,
                password: this.state.loginPwd,
                code: this.state.googleVerifyCodeValue
            },
            callback: (data) => {
                if (data.success) {
                    // Notification({
                    //     title: intl.get('Reminder'),
                    //     type: 'success',
                    //     message: intl.get(data.msg),
                    //     duration: 2000
                    // });
                    this.setState({
                        bindGoogleDialogVisible: false
                    });
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                } else {
                    Notification({
                        title: intl.get('Reminder'),
                        type: 'error',
                        message: intl.get(data.msg),
                        duration: 2000
                    });
                }
            }
        })
    }

    passwordHandle() {
        this.setState({passwordVerify: getPwdVerify(this.state.newPwd)})
    }

    tradePasswordHandle() {
        this.setState({newTradePwdVerify: getPwdVerify(this.state.newTradePwd)})
    }

    changePwd(e) {
        if (getPwdVerify(this.state.newPwd) && (this.state.newPwd === this.state.confirmPwd)
            && this.state.currentPwd.trim()) {
            this.props.dispatch({
                type: 'safeCertify/fetchPwd',
                payload: {
                    oldpassword: this.state.currentPwd,
                    newpassword: this.state.newPwd,
                    repeatnewpassword: this.state.confirmPwd
                },
                callback: (data) => {
                    this.setState({modifyPasswordDialogVisible: false}, () => {
                        Notification({
                            title: intl.get('Reminder'),
                            type: 'success',
                            message: intl.get('Modified_success'),
                            duration: 2000
                        });
                        setTimeout(() => {
                            clearUserInfo();
                            this.props.dispatch(routerRedux.push('/newlogin'))
                        }, 2300);
                    })



                }
            })

        } else {
            this.setState({passwordVerify: getPwdVerify(this.state.newPwd)})
        }
        // this.setState({modifyPasswordDialogVisible: false})
    }

    tradeVerifyCode() {
        this.props.dispatch({
            type: 'safeCertify/fetchTradeVerifyCode',
            payload: {},
            callback: (data) => {
                Notification({
                    title: intl.get('Reminder'),
                    type: 'success',
                    message: intl.get('Code_send_email'),
                    duration: 2000
                });
            }
        })
    }

    changeTradePwd(e) {
        if (getPwdVerify(this.state.newTradePwd) && (this.state.newTradePwd === this.state.confirmTradePwd) && this.state.verificationcode.trim()) {
            this.props.dispatch({
                type: 'safeCertify/fetchTradePwd',
                payload: {
                    safepassword: this.state.newTradePwd,
                    repeatsafepassword: this.state.confirmTradePwd,
                    verificationcode: this.state.verificationcode
                },
                callback: (data) => {
                    this.setState({modifyPasswordDialogVisible: false})
                    Notification({
                        title: intl.get('Reminder'),
                        type: 'success',
                        message: intl.get('Trade_password_reset_success'),
                        duration: 2000
                    });
                }
            })
        }
        this.setState({resetTransPasswordDialogVisible: false})
    }

    phoneNumber(val) {
        this.setState({
            phoneNumber: val
        })
    }

    phoneNumberVerify() {
        this.setState({
            phoneFocus: false,
            phoneNumberVerify: checkMobile(this.state.phoneNumber)
        })
    }

    bindPhoneAction() {
        if (checkMobile(this.state.phoneNumber)) {
            this.props.dispatch({
                type: 'safeCertify/fetchBindPhone',
                payload: {
                    phone: this.state.phoneNumber
                },
                callback: (data) => {
                    Notification({
                        title: intl.get('Reminder'),
                        type: 'success',
                        message: intl.get('Phone_binding_success'),
                        duration: 2000
                    });
                }
            })
            this.setState({bindPhoneDialogVisible: false})
        }
    }

    verificationcodeChange(val) {
        this.setState({
            verificationcode: val,
            verificationCodeFirstType: false
        })
    }

    verificationcodeFocus() {
        this.setState({
            verificationCodeFirstType: false
        })
    }

    setGoogleVerifyStep(step) {
        this.setState({
            googleVerifyStep: step
        })
    }

    handleLoginPwd(e) {
        this.setState({
            loginPwd: e.target.value
        })
    }

    handleGoogleVerifyCodeValue(e) {
        this.setState({
            googleVerifyCodeValue: e.target.value
        })
    }

    setDialogStatus(type) {
        if (type === 'open') {
            this.setState({
                bindGoogleDialogVisible: true,
                openGoogleDialogVisible: false
            })
        } else if (type === 'close') {
            this.setState({
                openGoogleDialogVisible: false
            })
        }
    }

    render() {
        return (
            <div className={styles.safeCertify}>
                <div className="title">
                    {intl.get("SECUITY_VERIFICATION")}
                </div>
                <Dialog
                    title={intl.get("BINDING_PHONE")}
                    visible={this.state.bindPhoneDialogVisible}
                    onCancel={() => this.setState({bindPhoneDialogVisible: false})}
                >
                    <p className="safeWarning">*{intl.get("FOR_THE_SECURITY_OF_YOUR_ASSETS")}</p>
                    <Dialog.Body>
                        <Form model={this.state.bindPhoneForm}>
                            <Form.Item className={['m-form-item', styles.formItem,].join(' ')}>
                                {/* <label
                  className={[styles.label, this.state.phoneFocus ? styles.focus : ''].join(' ')}>
                  手机号
                </label> */}
                                <div className={styles.iptItem}>
                                    <Input placeholder={intl.get("PHONE_NUMBER")}
                                           onBlur={e => {
                                               this.phoneNumberVerify()
                                           }}
                                           onFocus={e => {
                                               this.setState({phoneFocus: true})
                                           }}
                                           onChange={(value) => this.phoneNumber(value)}
                                    />
                                    <p
                                        className={this.state.phoneNumberVerify ? styles.commonError : styles.error}
                                    >{intl.get("PLEASE_ENTER_A_VALID_PHONE_NUMBER")}</p>
                                </div>
                            </Form.Item>
                            <Form.Item>
                                <Input placeholder="短信验证码"></Input>
                                <span className="sendCertifyCode">{intl.get("SEND_SEND_VERIFCARTION_CODE")}</span>
                            </Form.Item>
                        </Form>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button
                            type="primary"
                            onClick={() => this.bindPhoneAction()}
                        >{intl.get("SUBMIT_SPACE")}</Button>
                    </Dialog.Footer>
                </Dialog>
                <Dialog
                    title={intl.get("TURN_OFF_GOOLE_VERIFICATION")}
                    visible={this.state.closeGoogleDialogVisible}
                    onCancel={() => this.setState({closeGoogleDialogVisible: false})}
                >
                    <Dialog.Body>
                        <div className={styles.closeGoogleVerify}>
                            <div className={styles.section4}>
                                <div className={styles.content}>
                                    <div className={styles.item}>
                                        <input
                                            value={this.state.loginPwd}
                                            onChange={(e) => this.handleLoginPwd(e)}
                                            className={styles.inputInfo}
                                            placeholder={intl.get("LOGIN_PASSWORD")}
                                            type='password'
                                        />
                                    </div>
                                    <div className={styles.item}>
                                        <input
                                            value={this.state.googleVerifyCodeValue}
                                            onChange={(e) => this.handleGoogleVerifyCodeValue(e)}
                                            className={styles.inputInfo}
                                            placeholder={intl.get("GOOLE_VERIFICATION")}
                                            type='text'
                                            maxLength='8'
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className={styles.section2Footer}>

                                <div className={styles.stepFooter}>
                                    {
                                        this.state.loginPwd.trim() && this.state.googleVerifyCodeValue.trim() ?
                                            <Button
                                                type="primary"
                                                onClick={(e) => this.fetchGoogleVerifyStatusChange(0)}
                                            > {intl.get("TURN_OFF_GOOLE_VERIFICATION")} </Button> :
                                            <button
                                                className={styles.disabled}
                                            > {intl.get("TURN_OFF_GOOLE_VERIFICATION")} </button>
                                    }

                                </div>
                            </div>
                        </div>
                    </Dialog.Body>
                </Dialog>
                <Dialog
                    title={intl.get("VERIFICATION")}
                    visible={this.state.openGoogleDialogVisible}
                    onCancel={() => this.setState({openGoogleDialogVisible: false})}
                >
                    <Dialog.Body>
                        <div className={styles.openGoogleVerify}>
                            <div className={styles.verifyIcon}>
                                <img src={googleVerify_04}/>
                            </div>
                            <p className={styles.title}>{intl.get("VERIFICATION")}</p>
                            <p className={styles.info}>
                                <img src={warning}/>
                                <span className={styles.textWarning}>{intl.get("FOR_YOUR_ACCOUNT_SECURITY")}</span>
                            </p>
                            <div className={styles.buttonGroup}>
                <span
                    className={styles.span}
                    onClick={(e) => this.setDialogStatus('close')}
                >{intl.get("I_M_FAMILIAR_WITH_THE_RISKS")}</span>
                                <Button
                                    type='primary'
                                    onClick={(e) => this.setDialogStatus('open')}
                                >{intl.get("SET")}</Button>
                            </div>
                        </div>

                    </Dialog.Body>
                </Dialog>
                <Dialog
                    title={intl.get("SET_GOOGLE_VERIFICATION")}
                    visible={this.state.bindGoogleDialogVisible}
                    onCancel={() => this.setState({bindGoogleDialogVisible: false})}
                    style={{width: '654px'}}
                >
                    <p className={styles.googleVerifyStep}>
            <span
                className={this.state.googleVerifyStep === 1 ? styles.googleVerifyStepItem + ' ' + styles.actived : styles.googleVerifyStepItem}
                onClick={(e) => this.setGoogleVerifyStep(1)}
            >1、{intl.get("DOWNLOAD_APP")}</span>
                        <span
                            className={this.state.googleVerifyStep === 2 ? styles.googleVerifyStepItem + ' ' + styles.actived : styles.googleVerifyStepItem}
                            onClick={(e) => this.setGoogleVerifyStep(2)}
                        >2、{intl.get("SCAN_QR_CODE")}</span>
                        <span
                            className={this.state.googleVerifyStep === 3 ? styles.googleVerifyStepItem + ' ' + styles.actived : styles.googleVerifyStepItem}
                            onClick={(e) => this.setGoogleVerifyStep(3)}
                        >3、{intl.get("BACK-UP_PRIVATE_KEY")}</span>
                        <span
                            className={this.state.googleVerifyStep === 4 ? styles.googleVerifyStepItem + ' ' + styles.actived : styles.googleVerifyStepItem}
                            onClick={(e) => this.setGoogleVerifyStep(4)}
                        >4、{intl.get("SET_GOOGLE_VERIFICATION")}</span>
                    </p>
                    <Dialog.Body>
                        <div className={this.state.googleVerifyStep === 1 ? styles.stepItem : styles.hiddenStep}>
                            <div className={styles.section1}>
                                <p className={styles.tips}>{intl.get("DOWNLOAD_AND_INSTALL_COOGLE_AUTENTICATOR")}</p>
                                <div className={styles.links}>
                                    <a href='https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8'
                                       target='_blank'>
                                        <img src={googleVerify_01}/>
                                    </a>
                                    <a href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'
                                       target='_blank'>
                                        <img src={googleVerify_02}/>
                                    </a>
                                </div>
                            </div>
                            <div className={styles.stepFooter}>
                                <span className={styles.info}>{intl.get("INSTALLED")}</span>
                                <Button
                                    type="primary"
                                    onClick={(e) => this.setGoogleVerifyStep(2)}
                                    style={{marginLeft: '20px'}}
                                > {intl.get("NEXT")} </Button>
                            </div>
                        </div>
                        <div className={this.state.googleVerifyStep === 2 ? styles.stepItem : styles.hiddenStep}>
                            <div className={styles.section2}>
                                <div className={styles.left}>
                                    <p className={styles.tips}>{intl.get("SCAN_THE_QR_CODE_WIDTH_COOGLE")}</p>
                                    <div style={{padding: "20px", background: '#ededed'}}>
                                        <QRCode
                                            size={170}
                                            value={'otpauth://totp/' + this.props.user.email + '?secret=' + this.state.googleVerifyCode + '&issuer=' + ('localhost:3000'==window.location.host?'testsocket.crebe.io':window.location.host)}
                                        />
                                    </div>
                                    {console.log('otpauth://totp/' + this.props.user.email + '?secret=' + this.state.googleVerifyCode + '&issuer=' + (window.location.host))}
                                </div>

                                <div className={styles.right}>
                                    <p className={styles.googleVerifyCode}>{this.state.googleVerifyCode}</p>
                                    <p>{intl.get("IF_YOU_ARE_NOT_ABLE_TO_SCAN_THE_QR")}</p>
                                </div>
                            </div>
                            <div className={styles.section2Footer}>
                                <button
                                    type="text"
                                    onClick={(e) => this.setGoogleVerifyStep(1)}
                                    className={styles.preStep}
                                > {intl.get("PREVIOUS")} </button>
                                <div className={styles.stepFooter}>
                                    <span className={styles.info}>{intl.get("I_HAVE_COMPLETE_THIS_STEP")}</span>
                                    <Button
                                        type="primary"
                                        onClick={(e) => this.setGoogleVerifyStep(3)}
                                        style={{marginLeft: '20px'}}
                                    > {intl.get("NEXT")} </Button>
                                </div>
                            </div>
                        </div>
                        <div className={this.state.googleVerifyStep === 3 ? styles.stepItem : styles.hiddenStep}>
                            <div className={styles.section3}>
                                <div className={styles.left}>
                                    {this.state.googleVerifyCode}
                                </div>

                                <div className={styles.right}>
                                    <p>{intl.get("PLEASE_RECORD_THE_16-BIT")}</p>
                                    <p className={styles.waring}>{intl.get("RESETTING_YOUR_GOOGLE_VERIFICATION")}</p>
                                </div>
                            </div>
                            <div className={styles.section2Footer}>
                                <button
                                    onClick={(e) => this.setGoogleVerifyStep(2)}
                                    className={styles.preStep}
                                > {intl.get("PREVIOUS")} </button>
                                <div className={styles.stepFooter}>
                                    <span className={styles.info}>{intl.get("ALREADY_INPUT")}</span>
                                    <Button
                                        type="primary"
                                        onClick={(e) => this.setGoogleVerifyStep(4)}
                                        style={{marginLeft: '20px'}}
                                    >{intl.get("NEXT")} </Button>
                                </div>
                            </div>
                        </div>
                        <div className={this.state.googleVerifyStep === 4 ? styles.stepItem : styles.hiddenStep}>
                            <div className={styles.section4}>
                                <div className={styles.content}>
                                    <div className={styles.item}>
                                        <input
                                            value={this.state.loginPwd}
                                            onChange={(e) => this.handleLoginPwd(e)}
                                            className={styles.inputInfo}
                                            placeholder={intl.get("CREBE_PASSWORD")}
                                            type='password'
                                        />
                                    </div>
                                    <div className={styles.item}>
                                        <input
                                            value={this.state.googleVerifyCodeValue}
                                            onChange={(e) => this.handleGoogleVerifyCodeValue(e)}
                                            className={styles.inputInfo}
                                            placeholder={intl.get("GOOLE_VERIFICATION")}
                                            type='text'
                                            maxLength='8'
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className={styles.section2Footer}>
                                <button
                                    onClick={(e) => this.setGoogleVerifyStep(3)}
                                    className={styles.preStep}
                                > {intl.get("PREVIOUS")} </button>
                                <div className={styles.stepFooter}>
                                    {
                                        this.state.loginPwd.trim() && this.state.googleVerifyCodeValue.trim() ?
                                            <Button
                                                type="primary"
                                                onClick={(e) => this.fetchGoogleVerifyStatusChange(1)}
                                            > {intl.get("SET_GOOGLE_VERIFICATION")} </Button> :
                                            <button
                                                className={styles.disabled}
                                            > {intl.get("SET_GOOGLE_VERIFICATION")} </button>
                                    }

                                </div>
                            </div>
                        </div>
                    </Dialog.Body>
                </Dialog>
                <Dialog
                    title={intl.get("IDENTITY_VERIFICATION")}
                    visible={false}
                    onCancel={() => this.setState({bindPhoneDialogVisible: false})}
                >
                    <p className="safeWarning">*{intl.get("FOR_THE_SECURITY_OF_YOUR_ASSETS")}</p>
                    <Dialog.Body>
                        <Form model={this.state.bindPhoneForm}>

                            <Form.Item>
                                <Input placeholder="原手机号" value='18547874987' className="defaultContent"
                                       readOnly={true}></Input>
                            </Form.Item>
                            <Form.Item>
                                <Input placeholder="短信验证码"></Input>
                                <span className="sendCertifyCode">发送验证码</span>
                            </Form.Item>
                        </Form>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button
                            type="primary"
                            onClick={() => this.setState({bindPhoneDialogVisible: false})}
                        >{intl.get("SUBMIT_SPACE")}</Button>
                    </Dialog.Footer>
                </Dialog>
                <Dialog
                    title={intl.get("MODIFY_PASSWORD")}
                    visible={this.state.modifyPasswordDialogVisible}
                    onCancel={() => this.setState({modifyPasswordDialogVisible: false})}
                >
                    <Dialog.Body>
                        <Form model={this.state.modifyPasswordForm}>
                            <Form.Item>
                                <Input type='password' placeholder={intl.get("CURRENT_PASSWORD")}
                                       onChange={(e) => this.setState({currentPwd: e})}
                                ></Input>
                            </Form.Item>
                            <Form.Item>
                                <Input type='password' placeholder={intl.get("NEW_PASSWORD")}
                                       onChange={(e) => this.setState({newPwd: e})}
                                       onBlur={() => this.passwordHandle()}
                                ></Input>
                                <p
                                    className={this.state.passwordVerify ? styles.commonError : styles.error}
                                >密码不符合要求，请重新输入</p>
                            </Form.Item>
                            <Form.Item>
                                <Input type='password' placeholder={intl.get("CONFIRM_PASSWORD")}
                                       onChange={(e) => this.setState({confirmPwd: e})}
                                       onBlur={(e) => this.setState({firstType: false})}
                                ></Input>
                                <p
                                    className={this.state.firstType || (this.state.newPwd === this.state.confirmPwd)
                                        ? styles.commonError : styles.error}
                                >两次密码输入不一致，请重新输入密码</p>
                            </Form.Item>
                        </Form>
                        <p className="infoRequest">{intl.get("PASSWORD_REQUIREMENTS")}</p>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button type="primary"
                                onClick={(e) => this.changePwd(e)}
                        >{intl.get("SUBMIT_SPACE")}</Button>
                    </Dialog.Footer>
                </Dialog>

                <Dialog
                    title="重置交易密码"
                    visible={this.state.resetTransPasswordDialogVisible}
                    onCancel={() => this.setState({resetTransPasswordDialogVisible: false})}
                >
                    <Dialog.Body>
                        <Form model={this.state.resetTransPasswordForm}>
                            <Form.Item>
                                <Input type='password' placeholder="新交易密码"
                                       onChange={(e) => this.setState({newTradePwd: e})}
                                       onBlur={() => this.tradePasswordHandle()}
                                ></Input>
                                <p
                                    className={this.state.newTradePwdVerify ? styles.commonError : styles.error}
                                >密码不符合规范，请重新输入</p>
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    type='password' placeholder="确认交易密码"
                                    onChange={(e) => this.setState({confirmTradePwd: e})}
                                    onBlur={(e) => this.setState({tradeFirstType: false})}
                                ></Input>
                                <p
                                    className={this.state.tradeFirstType || (this.state.newTradePwd === this.state.confirmTradePwd)
                                        ? styles.commonError : styles.error}
                                >两次密码输入不一致，请重新输入密码</p>
                            </Form.Item>
                            <Form.Item>
                                <Input type='text'
                                       placeholder="邮件验证码"
                                       onChange={(val) => this.verificationcodeChange(val)}
                                       onBlur={(e) => this.verificationcodeFocus(e)}
                                ></Input>
                                <span
                                    className="sendCertifyCode"
                                    onClick={(e) => this.tradeVerifyCode(e)}
                                >发送验证码</span>
                                <p
                                    className={this.state.verificationcode.trim() || this.state.verificationCodeFirstType ? styles.commonError : styles.error}
                                >必填</p>
                            </Form.Item>
                        </Form>
                        <p className="infoRequest">密码要求： 8 - 32个字符，至少一个小写字母，至少一个大写字母，至少一个数字，至少一个特殊字符~!@#$%^&*()_+</p>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button type="primary" onClick={() => this.changeTradePwd()}>{intl.get("SUBMIT_SPACE")}</Button>
                    </Dialog.Footer>
                </Dialog>

                <Layout.Row className={styles.row}>
                    <Layout.Col span="3">{intl.get("EMAIL")}</Layout.Col>
                    <Layout.Col span="15"><span className={styles.intent}>{this.props.user.email}</span></Layout.Col>
                    <Layout.Col span="6"></Layout.Col>
                </Layout.Row>
                <Layout.Row className={styles.row}>
                    <Layout.Col span="3">{intl.get("VERIFICATION")}</Layout.Col>
                    <Layout.Col span="15">
            <span className={(this.state.bindPhone ? '' : styles.passwordIngredient) + " " + styles.intent}>
              {this.state.GoogleVerifyStatus ? intl.get("VERIFIED") : intl.get("NOT_VERIFIED")}
            </span>
                    </Layout.Col>
                    <Layout.Col span="6">
                        {
                            this.state.GoogleVerifyStatus ? (
                                <Button type="default" className={styles.buttonWidth} onClick={() => {
                                    this.setState({
                                        closeGoogleDialogVisible: true
                                    })
                                }}>{intl.get("CLOSE")}</Button>
                            ) : (
                                <Button type="default" className={styles.buttonWidth} onClick={() => {
                                    this.setState({
                                        bindGoogleDialogVisible: true
                                    })
                                }}>{intl.get("OPEN")}</Button>
                            )
                        }

                    </Layout.Col>
                    {/* <Layout.Col span="6">
            <Button type="default" onClick={() => {
              this.setState({
                bindPhoneDialogVisible: true
              })
            }}>绑定</Button>
          </Layout.Col> */}
                </Layout.Row>
                {/* <Layout.Row className={styles.row}>
          <Layout.Col span="3">手机</Layout.Col>
          <Layout.Col span="15">
            <span className={this.state.bindPhone ? '' : styles.passwordIngredient} >
              {this.props.user.phone ? this.props.user.phone : '未绑定' }
            </span>
          </Layout.Col>
          <Layout.Col span="6">
            <Button type="default" onClick={() => {
              this.setState({
                bindPhoneDialogVisible: true
              })
            }}>绑定</Button>
          </Layout.Col>
        </Layout.Row> */}
                <Layout.Row className={styles.row}>
                    <Layout.Col span="3">{intl.get("LOGIN_PASSWORD")}</Layout.Col>
                    <Layout.Col span="15">
                        <div className={[styles.pwdStrong, styles.middle].join(' ')}>
                            <p className={styles.passwordIngredient}>
                                <span className={styles.intent}>{intl.get("CHANGING_YOUR_PASSWORD")}</span>
                            </p>
                        </div>
                    </Layout.Col>
                    <Layout.Col span="6">
                        <Button type="default" className={styles.buttonWidth} onClick={() => {
                            this.setState({
                                modifyPasswordDialogVisible: true
                            })
                        }}>{intl.get("MODIFY")}</Button>
                    </Layout.Col>
                </Layout.Row>
                {/* <Layout.Row className={styles.row}>
          <Layout.Col span="3">交易密码</Layout.Col>
          <Layout.Col span="15">
            <div className={[styles.pwdStrong, styles.high].join(' ')}>
              <p className={styles.passwordIngredient}>
                <span>交易或修改账户信息时输入，保护账户资金安全，请确保登录密码与支付密码不同！</span>
              </p>
            </div>
          </Layout.Col>
          <Layout.Col span="6">
            <Button type="default" onClick={() => {
              this.setState({
                resetTransPasswordDialogVisible: true
              })
            }}>重置</Button>
          </Layout.Col>
        </Layout.Row> */}
            </div>
        )
    }
}
