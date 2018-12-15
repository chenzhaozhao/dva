import intl from 'react-intl-universal'
import React, { PureComponent } from 'react'
import { Link } from 'dva/router'
import { connect } from 'dva'
import styles from './index.less'
import images from '../../common/images'
import SelecteLanguage from '../SelectLanguage'
import { tokenVerify, formatTime,clearUserInfo } from '../../utils'
// import Icon from '../../components/Icon'
import Avatar from '../../components/Avatar'
import TopCommon from '../../components/TopCommon'
import VipType from '../../components/VipType'
import pdf from '../../assets/ct.pdf'
import pdf_en from '../../assets/ct_en.pdf'
import weixin from '../../assets/images/wexin.png'
import { Button, Dialog, Message ,Notification,Dropdown} from 'element-react'
import Icon from '../Icon'

@connect(({ user, global }) => ({
    user,
    global,
}))
export default class Header extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            modelStatus: false,
            vipType: 0,
            rechargeTabShowIndex: 1,
            rechargeDialogVisible: false,
            rechargeVipSelected: null,
            feeid: '',
            panelList: [],
        }
    }

    modelStatus() {
        this.setState({
            modelStatus: !this.state.modelStatus
        })
    }
    hiddenLanguageSelect() {
        this.setState({
            modelStatus: false
        })
    }

    vipTypeDisplay(type, endDate) {
        type = parseInt(type)
        if (type === 1) {
            return (
                <span
                    className={styles.openVip}
                    onClick={() => this.selectPanelList(2, '2')}
                >开通VIP加速升级</span>
            )
        } else {
            return (
                <span className={styles.vipType}>
                    <VipType vipType={type} />
                    <span className={styles.endDate}>{formatTime('yyyy-MM-dd', endDate)}</span>
                </span>

            )
        }
    }
    selectFeeType(index, feeid) {
        this.setState({
            rechargeVipSelected: index,
            feeid: feeid
        })
    }
    selectPanelList(type, open) {
        this.setState({
            rechargeTabShowIndex: (type - 1)
        })
        if (open === '2') {
            this.setState({ rechargeDialogVisible: true })
        } else if (open === '3') {
            this.setState({
                rechargeDialogVisible: true,
                rechargeTabShowIndex: 3
            })
        }

        this.props.dispatch({
            type: 'levelProfit/fetchVipList',
            payload: {
                viptype: type.toString()
            },
            callback: (data) => {
                if (data.success) {
                    this.state.panelList = data.data
                    this.setState({
                        panelList: [...this.state.panelList]
                    })
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
    rechargeActive() {
        if (!this.state.feeid.trim()) {
            Notification({
                title:intl.get('Reminder'),
                type: 'error',
                message: '请选择VIP种类及时间',
                duration: 2000
            });
            return
        }
        this.setState({ rechargeDialogVisible: false })
        this.props.dispatch({
            type: 'levelProfit/fetchVip',
            payload: {
                feeid: this.state.feeid
            },
            callback: (data) => {
                if (data.success) {
                    Notification({
                        title:intl.get('Reminder'),
                        type: 'success',
                        message: '充值成功!',
                        duration: 2000
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

    logout() {
        this.props.dispatch({
            type: 'user/fetchLoginOut',
            payload: {},
            callback: (data) => {
                clearUserInfo();
                if (data.success) {
                  Notification({
                        title:intl.get('Reminder'),
                        type: 'success',
                        message: intl.get('Logout_success'),
                        duration:1000,
                       onClose:()=>{
                        window.location.href = '/'
                      }
                    });
                }
            }
        })
    }

    computedActiveDays(level, type, viptype) {
        let speedup = 1
        const { user: userData = {} } = this.props;

        if (type === 'days') {
            let nextLevel = (parseInt(level) + 1) * (parseInt(level) + 1) + 4 * (parseInt(level) + 1)
            let curLevel = parseInt(level) * parseInt(level) + 4 * parseInt(level)
            let thisLevelDays = nextLevel - curLevel
            let needDays = ((nextLevel - parseInt(userData.activeday || 0)) / speedup).toFixed(0)
            return needDays
        }
    }

    render() {
        const { global: globalData = {}, user: userData = { nickname: '' } } = this.props;
        return (
            <div id="header" className={styles.basicNav} style={{ minWidth: this.props.headerWidth }}>
                <div style={{ width: this.props.headerContainerWidth }}>
                    <Dialog
                        title="充值"
                        visible={this.state.rechargeDialogVisible}
                        onCancel={() => this.setState({ rechargeDialogVisible: false })}
                        style={{ width: '524px' }}
                    >
                        <Dialog.Body>
                            <div className={styles.tabList}>
                                <div
                                    className={this.state.rechargeTabShowIndex === 1 ? styles.active : ''}
                                    onClick={() => this.selectPanelList(2)}
                                >
                                    <span className={styles.vipMember}>VIP会员</span>
                                    <span className={styles.vipSpeedUp}>享2倍加速</span>
                                </div>
                                <div
                                    className={this.state.rechargeTabShowIndex === 2 ? styles.active : ''}
                                    onClick={() => this.selectPanelList(3)}
                                >
                                    <span className={styles.vipMember}>年费VIP会员</span>
                                    <span className={styles.vipSpeedUp}>享3倍加速</span>
                                </div>
                                <div
                                    className={this.state.rechargeTabShowIndex === 3 ? styles.active : ''}
                                    onClick={() => this.selectPanelList(4)}
                                >
                                    <span className={styles.vipMember}>超级VIP会员</span>
                                    <span className={styles.vipSpeedUp}>享10倍加速</span>
                                </div>
                            </div>
                            <div className={styles.tabContent}>
                                <div className={styles.display}>
                                    <div>
                                        {
                                            (this.state.panelList || []).map((item, index) => {
                                                return (
                                                    <div
                                                        onClick={(e) => this.selectFeeType(index, item.feeid)}
                                                        className={this.state.rechargeVipSelected === index ? styles.active : ''}

                                                        key={index}
                                                    >
                                                        <div className={styles.panelBody}>
                                                            <p className={styles.amount}>{item.fee}<span>CT</span></p>
                                                        </div>
                                                        <div className={styles.panelFooter}>{item.month}个月</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>

                        </Dialog.Body>
                        <Dialog.Footer className="dialog-footer">
                            <Button
                                type="primary"
                                onClick={this.rechargeActive.bind(this)}
                            >充 值</Button>
                        </Dialog.Footer>
                    </Dialog>
                    <a href={`/?lang=${window.currentLocale}`} className={styles.icon}>
                        <img className={styles.penguin} src={images.logo} alt="logo" />
                    </a>
                    <div className={styles.secNav}>
                        {/* <Link className={styles.secNavItem} to='/transaction'></Link> */}
                        {/* <div className={styles.transactionCenter}>
                            <span className={styles.title}>{intl.get('TRADING_CENTER')}</span>
                            <ul className={styles.modelPanel}>
                                <li>
                                    <Link to={
                                        `/transaction/${globalData.pathCoinid}/${globalData.pathPaycoinid}`
                                    }>标准版</Link>
                                </li>
                                <li>
                                    <Link to={`/transactionAdvanced/${globalData.pathCoinid}/${globalData.pathPaycoinid}`}>专业版</Link>
                                </li>
                            </ul>
                        </div> */}

                        <Link
                            className={styles.secNavItem}
                            to={`/transactionAdvanced/${globalData.pathCoinid}/${globalData.pathPaycoinid}`}
                        >{intl.get('TRADING_CENTER')}</Link>
                        <Link className={styles.secNavItem} to='/levelprofit'>{intl.get('GRADE_DIVIDEND')}</Link>
                        <a className={styles.secNavItem} href={window.currentLocale==="en-US"?pdf_en:pdf} target='_blank'>{intl.get('WHITEOAOER')}</a>
                        {/*<Link className={styles.secNavItem} to='/qqgame'>{intl.get('CT_SOLITAIRE')}</Link>*/}
                        {/* <Link className={styles.secNavItem} to='/consensus'>{intl.get('CT_CONSENSUS')}</Link> */}
                    </div>
                    <div className={styles.secNavInteractive}>
                          <TopCommon loginStatus={tokenVerify()} />
                        <div style={{ display: tokenVerify() ? 'block' : 'none' }} className={styles.userInfo}>
                            <div className={styles.userInfoContainer}>
                                <Avatar level={userData.level} />
                                <span className={styles.userName}>{userData.nickname.trim() || ''}</span>
                                <span className={styles.userPanel}>
                                    <span className={styles.userPanelBody}>
                                        <Avatar avatarSize='50' level={userData.level} />
                                        <span className={styles.infomation}>
                                            <span className={styles.username}>
                                                {userData.nickname.trim() || ''}
                                                <span className={styles.level}>
                                                    <img src={images.level} />
                                                    <span className={styles.levelNumber}>{userData.level}</span>
                                                </span>
                                            </span>
                                            <span className={styles.email}>{userData.email}</span>
                                            <span className={styles.activeDays}>{intl.get("CURRENTLY_ACTIVE")}：{userData.activeday}{intl.get("DAY")}</span>
                                            <span className={styles.activeDays}>{intl.get("UPGRADE_REQUIRES")}：{this.computedActiveDays(userData.level, 'days', 1)}{intl.get("DAY")}</span>
                                            {/* <span className={styles.vip}>
                                                {this.vipTypeDisplay(userData.viptype, userData.overduetime)}
                                            </span> */}
                                        </span>
                                    </span>
                                    <span className={styles.userPanelFooter}>
                                        <Link to='/manager'>{intl.get("USER_CENTER")}</Link>
                                        <span
                                            to='/'
                                            onClick={(e) => { this.logout() }}
                                        >{intl.get("SIGN_OUT")}</span>
                                    </span>
                                </span>
                                {/* <span className={styles.logout}>退出</span> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
