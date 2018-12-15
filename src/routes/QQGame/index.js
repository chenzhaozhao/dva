import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Link, routerRedux } from 'dva/router'
import styles from './index.less'
import Icon from '../../components/Icon'
import Share from 'social-share-react'
import QRCode from 'qrcode.react'
import { Notification } from 'element-react';
import { socket } from '../../services/socket'
import { formatTime, tokenVerify } from '../../utils'
import { WS_URL as socketUrl } from '../../common/global'
import Scrollbar from 'react-smooth-scrollbar'
import crown_01 from '../../assets/images/crown_01.png'
import checkbox_01 from '../../assets/images/checkbox_01.png'
import checkbox_select from '../../assets/images/checkbox_select.png'
import rechargeSelected from '../../assets/images/rechargeSelected.png'
import intl from 'react-intl-universal'

@connect(state => ({
    game: state.game,
    user: state.user
}))
export default class QQGame extends PureComponent {
    currentStamp = null

    state = {

        currentStamp: new Date().getTime(),
        coinType: 'BTC',
        panelList: [],
        showRules: false,
        freeBuyTimes: 0,
        endTime: 1541808000000,
        sectionIndex: 1,
        showAllList: true,
        showDragonList: false,
        remainingtime: null,
        dragonInfo: {
            id: "",
            maxtime: "0",
            remainingtime: "0",
            endtime: "0",
            jackpot: "0",
            partakecount: "0",
            bounscount: "0",
            nownum: "0",
            dividends: "0",
            usdtpay: "0",
            btcpay: "0",
            ethpay: "0",
            user_partake_list: [],
            user_partakes: []
        }
    }
    gameSocket = undefined
    requestStatus = {
        status: true
    }
    componentDidMount() {
        this.setState({
            sectionIndex: (this.props.game.dragonInfo.endtime > new Date().getTime() ? 1 : 3)
        });

        this.requestStatus.status = true
        //倒计时相关
        this.currentStamp = setInterval(() => {
          const {endtime,nowtime,id}=this.props.game.dragonInfo;
            if (this.props.game.dragonInfo &&id) {
                let remainingtime = parseInt(endtime) - (nowtime?nowtime: new Date().getTime());
                this.setState({
                    remainingtime: remainingtime
                })
            }
        }, 179)
        this.fetchList({})
        this.fetchFreeBuyTimes()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dragonInfo !== this.props.dragonInfo) {

        }
    }

    fetchList(params) {
        const _this = this
        this.props.dispatch({
            type: 'game/fetchGameList',
            payload: {},
            callback: (data) => {
                if (data.success) {
                    this.setState({
                        panelList: [...data.data.list]
                    })

                    let dragonid = this.props.match.params.dragonid ? this.props.match.params.dragonid : data.data.list[0].id

                    _this.props.dispatch({
                        type: 'game/fetchDragonDetail',
                        payload: {
                            dragonid: dragonid
                        },
                        callback: (data) => {
                            if (data.success) {
                                this.setState({
                                    dragonInfo: { ...data.data[0] }
                                })
                                let token = localStorage.getItem('_token_')
                                this.gameSocket = socket(data => {
                                    if (data) {
                                        // console.log(`这里是ws推过来的消息：`, JSON.parse(data))
                                        this.props.dispatch({
                                            type: 'game/webSocket',
                                            payload: data,
                                            callback: (res) => {
                                                // debugger

                                            }
                                        })
                                    }
                                }, {
                                        url: socketUrl,
                                        params: {
                                            "type": 'dragon_' + this.props.game.dragonInfo.id,
                                            "ctoin": "add"
                                        },
                                        requestStatus: _this.requestStatus
                                    })

                            }
                        }
                    })


                }
            }
        })
    }


    selectPanelList(panelList) {
        let res = []
        if (panelList && panelList.length > 0) {
            panelList.forEach((item, index) => {
                res.push(
                    <li
                        className={styles.selectListItem}
                        key={index}
                        onClick={(e) => this.selectDragon(item.id)}
                    >第{item.id}期</li>
                )
            })
        }

        if (panelList && panelList.length > 9) {
            res.push(
                <li
                    className={styles.selectListItem}
                    key={panelList.length}
                >&nbsp;</li>
            )
        }

        return res
    }

    selectDragon(id) {
        this.props.dispatch(routerRedux.push(`/qqgame/${id}`))
        setTimeout(() => {
            window.location.reload()
        }, 200)
    }

    //买入
    fetchBuy() {
        let userid = localStorage.getItem('_userid_')
        let token = localStorage.getItem('_token_')
        if (userid && userid.trim() && token && token.trim()) {
            this.props.dispatch({
                type: 'game/fetchBuy',
                payload: {
                    paycoinname: this.state.coinType,
                    dragonid: this.props.game.dragonInfo.id
                },
                callback: (data) => {
                    if (data.success) {
                      Notification({
                           title:intl.get('Reminder'),
                            type: 'success',
                            message: intl.get('Buy_success'),
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
        } else {
          Notification({
                title:intl.get('Reminder'),
                type: 'warning',
                message: intl.get('Login_please'),
                duration: 2000
            });
        }

    }

    fetchFreeBuy() {
        let userid = localStorage.getItem('_userid_')
        let token = localStorage.getItem('_token_')
        if (this.state.freeBuyTimes <= 0) {
          Notification({
                title:intl.get('Reminder'),
                type: 'warning',
                message: intl.get('Dragon_notfree'),
                duration: 2000
            });
            return
        }
        if (userid && userid.trim() && token && token.trim()) {
            this.props.dispatch({
                type: 'game/fetchFreeBuy',
                payload: {
                    dragonid: this.props.game.dragonInfo.id
                },
                callback: (data) => {
                    if (data.success) {
                      Notification({
                            title:intl.get('Reminder'),
                            type: 'success',
                            message: intl.get('Buy_success'),
                            duration: 2000
                        });
                        this.fetchFreeBuyTimes()
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
        } else {
          Notification({
                title:intl.get('Reminder'),
                type: 'warning',
                message: intl.get('Login_please'),
                duration: 2000
            });
        }
    }

    componentWillUnmount() {
        clearInterval(this.currentStamp)
        if (this.requestStatus.status) {
            this.requestStatus.status = false
        }
        if (this.gameSocket) {
            this.gameSocket.close()
        }

    }

    selectCoin = (type) => {
        this.setState({
            coinType: type
        })
    }

    //免费次数
    fetchFreeBuyTimes() {
        let userid = localStorage.getItem('_userid_')
        if (userid) {
            this.props.dispatch({
                type: 'game/fetchFreeBuyTimes',
                payload: {},
                callback: (data) => {
                    if (data.success) {
                        this.setState({
                            freeBuyTimes: data.data.number
                        })
                    }
                }
            })
        }
    }

    //购买
    buyPlay = (item, panelList) => {
        let userid = localStorage.getItem('_userid_')
        let token = localStorage.getItem('_token_')
        if (userid && userid.trim() && token && token.trim()) {
            item.status = 3
            this.setState({
                panelList: [...panelList]
            })
        } else {
          Notification({
                title:intl.get('Reminder'),
                type: 'warning',
                message: intl.get('Login_please'),
                duration: 2000
            });
        }

    }

    hourCompute(stamp) {
        //stamp = parseInt(stamp) - new Date().getTime()
        if (stamp >= 0) {
            let hour = parseInt(stamp / 1000 / 3600, 10)
            if (hour < 10) {
                return ('0' + hour)
            } else {
                return hour
            }
        } else {
            return '00'
        }
    }

    minuteCompute(stamp) {
        //stamp = parseInt(stamp) - new Date().getTime()
        if (stamp >= 0) {
            //let minute = Math.floor((stamp - this.state.currentStamp) / 1000 % 3600 / 60).toString()
            let minute = parseInt(stamp / 1000 % 3600 / 60, 10)
            if (minute < 10) {
                return ('0' + minute)
            } else {
                return minute
            }
        } else {
            return '00'
        }
    }

    secondCompute(stamp) {
        //stamp = parseInt(stamp) - new Date().getTime()
        if (stamp >= 0) {
            let second = parseInt(stamp / 1000 % 60, 10)
            if (second < 10) {
                return ('0' + second)
            } else {
                return second
            }
        } else {
            return '00'
        }
    }

    millisecondCompute(stamp) {
        //stamp = parseInt(stamp) - new Date().getTime()
        if (stamp >= 0) {
            let millisecond = parseInt(stamp % 1000, 10)
            if (millisecond >= 100) {
                let ms = parseInt(millisecond / 10, 10)
                return ms
            } else if (millisecond < 10) {
                return '00'
            } else {
                let ms = parseInt(millisecond / 10, 10)
                return ms + '0'
            }
        } else {
            return '00'
        }
    }

    dragonRecordList(partakeList, type) {
        let res = []
        if (partakeList && partakeList.length > 0) {
            partakeList.forEach((item, index) => {
                res.push(
                    <p
                        className={index === 0 && type === 'total' ? styles.firstTableItem : styles.tableItem}
                        key={index}
                    >
                        <span className={styles.nicknameItem}>
                            {(!item.nickname || !item.nickname.trim()) && type === 'mine' ? this.props.user.nickname : item.nickname}
                            <img src={index === 0 && type === 'total' ? crown_01 : ''} alt="" />
                        </span>
                        <span className={styles.timesItem}>{item.partake_count}</span>
                        <span className={styles.ctAmountItem}>{item.number}</span>
                        <span className={styles.prizePoolItem}>{item.bounscount}</span>
                        <span className={styles.timeItem}>{formatTime('yyyy-MM-dd hh:mm:ss', item.time)}</span>
                    </p>
                )

            })
        }else {
          res.push(<p className={styles.notRecord}>暂无记录</p>)
        }
        return res
    }

    render() {
        return (
            <div className={styles.qqgame}>
                <div className={styles.gameBg}>
                </div>
                <div className={styles.container}>
                    <div className={styles.gameHeader}>
                        <span className={styles.title}>
                            第 {this.props.game.dragonInfo.id} 期
                        </span>
                        <span
                            className={this.props.game.dragonInfo.endtime > new Date().getTime() ? styles.gameProcessing : styles.gameEnd}
                        >
                            {this.props.game.dragonInfo.endtime > new Date().getTime() ? '进行中' : '已结束'}

                        </span>
                        <div className={styles.selectPanel +' gameSelect'}>
                            <p
                                className={styles.selectContent}
                                onClick={(e) => this.setState({ showDragonList: !this.state.showDragonList })}
                            >
                                <span>第{this.props.game.dragonInfo.id}期</span>
                                <span><Icon type='xialajiantouxiangxia' size='14' color='#4d4d4d' /></span>
                            </p>
                            <div
                                className={this.state.showDragonList ? styles.selectListPanel : styles.selectListPanelHidden}
                                style={{ borderBottom : this.props.game.gameList.length >= 9 ? '1px solid #d8d8d8' : 'none' }}
                            >
                                <Scrollbar
                                    damping={0.1}
                                    thumbMinSize={2}
                                    renderByPixels={true}
                                    alwaysShowTracks={true}
                                    continuousScrolling={true}
                                >
                                    <ul className={styles.selectLists}>
                                        {this.selectPanelList(this.props.game.gameList)}
                                    </ul>
                                </Scrollbar>

                            </div>
                        </div>
                    </div>
                    <div className={styles.gameInfo}>
                        <div
                            className={styles.countdown}
                            style={{ color: this.props.game.dragonInfo.endtime > new Date().getTime() ? '#1d1d1d' : '#999999' }}
                        >
                            <Icon
                                size='48'
                                color={this.props.game.dragonInfo.endtime > new Date().getTime() ? '#07b097' : '#999999'}
                                type='time'
                            />
                            <span className={styles.time}>
                                {this.hourCompute(this.state.remainingtime)}
                            </span>
                            :
                            <span className={styles.time}>
                                {this.minuteCompute(this.state.remainingtime)}
                            </span>
                            :
                            <span className={styles.time}>
                                {this.secondCompute(this.state.remainingtime)}
                            </span>
                            :
                            <span className={styles.time}>
                                {this.millisecondCompute(this.state.remainingtime)}
                            </span>
                        </div>
                        <div className={styles.participateTimes}>
                            <span className={styles.title}>参与次数</span>
                            <span className={styles.numberInfo}>{this.props.game.dragonInfo.partakecount}&nbsp;</span>
                        </div>
                        <div className={styles.prizePool}>
                            <span className={styles.title}>当前奖池(CT)</span>
                            <span className={styles.numberInfo}>{this.props.game.dragonInfo.bounscount}&nbsp;</span>
                        </div>
                        <div
                            className={styles.myProfit}
                            style={{ display: tokenVerify() ? 'flex' : 'none' }}
                        >
                            <span className={styles.title}>我的分红(CT)</span>
                            <span className={styles.numberInfo}>{this.props.game.dragonInfo.dividends}&nbsp;</span>
                        </div>
                    </div>

                    <div className={styles.sectionTitle}>
                        <span
                            className={this.state.sectionIndex === 1 ? styles.active : ''}
                            onClick={(e) => this.setState({ sectionIndex: 1 })}
                            style={{ display: this.props.game.dragonInfo.endtime > new Date().getTime() ? 'inline-block' : 'none' }}
                        >购买</span>
                        <span
                            className={this.state.sectionIndex === 2 ? styles.active : ''}
                            onClick={(e) => this.setState({ sectionIndex: 2 })}
                            style={{ display: this.props.game.dragonInfo.endtime > new Date().getTime() ? 'inline-block' : 'none' }}
                        >免费参与</span>
                        <span
                            className={this.state.sectionIndex === 3 ? styles.active : ''}
                            onClick={(e) => this.setState({ sectionIndex: 3 })}
                        >接龙记录</span>
                        <span
                            className={this.state.sectionIndex === 4 ? styles.active : ''}
                            onClick={(e) => this.setState({ sectionIndex: 4 })}
                        >玩法规则</span>

                    </div>
                    <div className={this.state.sectionIndex === 1 ? styles.sectionDisplay : styles.hidden}>
                        <p className={styles.gameCoinAmount}>
                            当前接龙CT：
                            <span className={styles.numberInfo}>{this.props.game.dragonInfo.nownum}</span>个
                        </p>
                        <div className={styles.coinTypeList}>
                            <span
                                className={this.state.coinType === 'BTC' ? styles.selectedCoin : styles.coinType}
                                onClick={(e) => this.setState({ coinType: 'BTC' })}
                            >
                                <img src={this.state.coinType === 'BTC' ? rechargeSelected : ''} />
                                BTC: {this.props.game.dragonInfo.btcpay}个
                            </span>
                            <span
                                className={this.state.coinType === 'ETH' ? styles.selectedCoin : styles.coinType}
                                onClick={(e) => this.setState({ coinType: 'ETH' })}
                            >
                                <img src={this.state.coinType === 'ETH' ? rechargeSelected : ''} />
                                ETH: {this.props.game.dragonInfo.ethpay}个
                            </span>
                            <span
                                className={this.state.coinType === 'USDT' ? styles.selectedCoin : styles.coinType}
                                onClick={(e) => this.setState({ coinType: 'USDT' })}
                            >
                                <img src={this.state.coinType === 'USDT' ? rechargeSelected : ''} />
                                USDT: {this.props.game.dragonInfo.usdtpay}个
                            </span>
                        </div>
                        <div
                            className={styles.green + " " + styles.actionButton}
                            onClick={(e) => this.fetchBuy()}
                        >
                            立即参与
                        </div>
                    </div>
                    <div className={this.state.sectionIndex === 2 ? styles.sectionDisplay : styles.hidden}>
                        <p
                            className={styles.freeTimesTitle}
                            style={{ display: tokenVerify() ? 'block' : 'none' }}
                        >你有<span className={styles.freeTimes}>{this.state.freeBuyTimes}</span>次免费参与的机会</p>
                        <div
                            className={styles.green + " " + styles.actionButton}
                            onClick={(e) => this.fetchFreeBuy()}
                            style={{ display: tokenVerify() ? 'block' : 'none' }}
                        >
                            免费参与
                        </div>
                        <div className={styles.share}>
                            <p className={styles.shareTitle}>邀请好友</p>
                            <p className={styles.tips}>每成功邀请一个好友注册，您将获得免费参与接龙的机会，多邀多得</p>
                            <div className={styles.iconShare}>
                                <Share
                                    class="social-share"
                                    url={''+window.location.protocol+'//'+window.location.host+'/#/newlogin/' + this.props.user.refcode}
                                    title='玩CT接龙，赢千万大奖，享亿级分红'
                                    description='玩CT接龙，赢千万大奖，享亿级分红'
                                    sites={['qzone', 'qq', 'weibo']}
                                    image={null}
                                >
                                </Share>
                                <div className={styles.wechatIcon}>
                                    <Icon type='wechat' size='27' color='#fff' />
                                    <span className={styles.qrContainer}>
                                        <h4 className={styles.scan}>微信扫一扫</h4>
                                        <QRCode size={130}
                                            value={''+window.location.protocol+'//'+window.location.host+'/#/newlogin/' + this.props.user.refcode}
                                        />
                                    </span>

                                </div>
                            </div>
                            <p
                                className={styles.refTips}
                                style={{ display: tokenVerify() ? 'block' : 'none' }}
                            >或提示朋友注册时输入你的邀请码：<span>{this.props.user.refcode}</span></p>
                        </div>
                    </div>
                    <div className={this.state.sectionIndex === 3 ? styles.sectionDisplay : styles.hidden}>
                        <div className={styles.tipsContent}>
                            <p className={styles.recordTips}>
                                1、接龙记录只显示前20名，按照接龙 CT 数量由大到小排序
                            </p>
                            <p className={styles.recordTips}>
                                2、当前奖池=平台投入 CT 总量 + 用户投入CT数量 * 0.1%
                            </p>
                            <div
                                className={styles.recordDisplay}
                                onClick={(e) => this.setState({ showAllList: !this.state.showAllList })}
                                style={{ display: tokenVerify() ? 'flex' : 'none' }}
                            >
                                <img src={this.state.showAllList ? checkbox_01 : checkbox_select} />
                                查看我的接龙记录
                            </div>
                        </div>
                        <div className={styles.recordTable}>
                            <p className={styles.tableHeader}>
                                <span className={styles.nicknameItem}>昵称</span>
                                <span className={styles.timesItem}>参与次数</span>
                                <span className={styles.ctAmountItem}>CT数量</span>
                                <span className={styles.prizePoolItem}>历史奖池</span>
                                <span className={styles.timeItem}>参与时间</span>
                            </p>
                            <div
                                className={styles.tableContent}
                                style={{ display: this.state.showAllList ? 'block' : 'none' }}
                            >
                                {this.dragonRecordList(this.props.game.dragonInfo.user_partake_list, 'total')}
                            </div>
                            <div
                                className={styles.tableContent}
                                style={{ display: this.state.showAllList ? 'none' : 'block' }}
                            >
                                {this.dragonRecordList(this.props.game.dragonInfo.user_partakes, 'mine')}
                            </div>

                        </div>
                    </div>
                    <div className={this.state.sectionIndex === 4 ? styles.sectionDisplay : styles.hidden}>
                        <div className={styles.rules}>
                            <p className={styles.ruleTitleContent}>
                                接龙分红是crebe交易平台组织的趣味游戏，用户可通过手中持有的BTC、ETH或者USDT兑换CT来参与接龙游戏。
                            </p>
                            <div className={styles.ruleSection}>
                                <p className={styles.title}>
                                    一、奖池金额
                                </p>
                                <p className={styles.ruleContent}>
                                    crebe交易平台在初始奖池中投入10万个CT，每增加1人次参加，crebe增投1个CT；
                                </p>
                                <p className={styles.example}>举例：</p>
                                <p className={styles.ruleContent}>
                                    10万人次参加，crebe交易平台投入奖池的CT数量为20万个，即10万初始奖金+10万按人次增投奖金=20万个CT
                                </p>
                            </div>
                            <div className={styles.ruleSection}>
                                <p className={styles.title}>
                                    二、参与游戏兑换的CT退还用户
                                </p>
                                <p className={styles.ruleContent}>
                                    用户参与接龙游戏不消耗CT，只产生0.1%的手续费，游戏结束时将归还用户参与游戏的CT。
                                </p>
                            </div>
                            <div className={styles.ruleSection}>
                                <p className={styles.title}>
                                    三、用户参与游戏兑换CT数量
                                </p>
                                <p className={styles.ruleContent}>
                                    用户参与游戏需兑换CT的数量等于参与游戏的入场排序。接龙不限参与次数，用户可重复无限参与。
                                </p>
                                <p className={styles.example}>举例：</p>
                                <p className={styles.ruleContent}>
                                    第1个参与者需1个CT，第2个参与者需2个CT……依次类推，第100个参与者需100个CT。
                                </p>
                            </div>
                            <div className={styles.ruleSection}>
                                <p className={styles.title}>
                                    四、游戏时间
                                </p>
                                <p className={styles.ruleContent}>
                                    游戏开始后每新增一名参与者，倒计时增加15秒，最大时长为24小时。
                                </p>
                            </div>
                            <div className={styles.ruleSection}>
                                <p className={styles.title}>
                                    五、奖励规则
                                </p>
                                <p className={styles.ruleContent}>
                                    1、倒计时结束时，最后一名参与者获得最终奖金，即crebe交易平台投入的币量+所有手续费的20%。
                                </p>
                                <p className={styles.ruleContent}>
                                    2、除最后一名获奖者之外，其他参与者可获得手续费的80%分红，分红按所有用户参与次数平均分配。
                                </p>
                                <p className={styles.example}>举例：</p>
                                <div className={styles.exampleSection}>
                                    <p className={styles.exampleIndex}>1</p>
                                    <div className={styles.exampleContent}>
                                        <p className={styles.ruleContent}>如参与接龙游戏的人次为100人</p>
                                        <p className={styles.ruleContent}>全部手续费为：100*(1+100)/2*0.1%=5.05CT</p>
                                        <p className={styles.ruleContent}>奖励分发：</p>
                                        <p className={styles.ruleContent}>最后一名参与者：5.05*20%+100100=100101.01CTCT</p>
                                        <p className={styles.ruleContent}>其他游戏参与者：5.05*80%/100=0.0404CT 即参与活动的用户每人次可得0.0404CT分红</p>
                                    </div>
                                </div>
                                <br/>
                                <div className={styles.exampleSection}>
                                    <p className={styles.exampleIndex}>2</p>
                                    <div className={styles.exampleContent}>
                                        <p className={styles.ruleContent}>如参与接龙游戏的人次为10万人</p>
                                        <p className={styles.ruleContent}>全部手续费为：10W(1+10W)/2*0.1%=5000050CT</p>
                                        <p className={styles.ruleContent}>奖励分发：</p>
                                        <p className={styles.ruleContent}>最后一名参与者：5000050*20%+20W=1200010CT</p>
                                        <p className={styles.ruleContent}>其他游戏参与者：5000050*80%/10w=40.0004CT 即参与活动的用户每人次可得40.0004CT分红</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.ruleSection}>
                                <p className={styles.title}>
                                    六、邀请好友抢免费参与机会
                                </p>
                                <p className={styles.ruleContent}>
                                    用户成功邀请1位好友注册，即可获得免费接龙机会1次，多邀多得。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.dateEnd}>
                    <span>&nbsp;</span>
                </div>
            </div>
        )
    }
}
