import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import styles from './oldgame.less'
import images from '../../common/images'
import { WS_URL as socketUrl } from '../../common/global'
import Icon from '../../components/Icon'
import Share from 'social-share-react'
import QRCode from 'qrcode.react'
import { Notification } from 'element-react';
import { socket } from '../../services/socket'
import { formatTime, tokenVerify } from '../../utils'
import { WS_URL as socketUrl } from '../../common/global'
import Scrollbar from 'react-smooth-scrollbar'
import crown_01 from '../../assets/images/crown_01.png'
import intl from 'react-intl-universal'
@connect(state => ({
  game: state.game,
  user: state.user
}))
export default class QQGameOld extends PureComponent {
  currentStamp = null

  state = {

    currentStamp: new Date().getTime(),
    coinType: 'BTC',
    panelList: [],
    showRules: false,
    freeBuyTimes: 0
  }
  gameSocket = undefined
  requestStatus = {
    status: true
  }
  componentDidMount() {
    this.requestStatus.status = true
    this.currentStamp = setInterval(() => {
      if (this.props.game.gameList && this.props.game.gameList.length > 0) {
        let panelLists = this.props.game.gameList;
        for (let i = 0; i < this.props.game.gameList.length; i++) {
          panelLists[i].remainingtime = parseInt(panelLists[i].remainingtime) - 179
          this.setState({ panelList: [...panelLists] })
        }
      }
    }, 179)
    this.fetchList({})
    this.fetchFreeBuyTimes()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gameList !== this.props.gameList) {
      this.setState({
        panelList: [...nextProps.gameList]
      })

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
                "type": 'dragon',
                "ctoin": "add",
                "token": token
              },
              requestStatus: _this.requestStatus
            })
        }
      }
    })
  }
  fetchBuy(item) {
    let userid = localStorage.getItem('_userid_')
    let token = localStorage.getItem('_token_')
    if (userid && userid.trim() && token && token.trim()) {
      this.props.dispatch({
        type: 'game/fetchBuy',
        payload: {
          paycoinname: this.state.coinType,
          dragonid: item.id
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

  fetchFreeBuy(item) {
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
          dragonid: item.id
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

  fetchFreeBuyTimes() {
    let userid = localStorage.getItem('_userid_')
    if (userid) {
      this.props.dispatch({
        type: 'game/fetchFreeBuyTimes',
        payload: {},
        callback: (data) => {
          if (data.success) {
            console.log(data)
            this.setState({
              freeBuyTimes: data.data.number
            })
          }
        }
      })
    }

  }

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
  freePlayChange = (item, panelList) => {
    let userid = localStorage.getItem('_userid_')
    let token = localStorage.getItem('_token_')
    if (userid && userid.trim() && token && token.trim()) {
      item.status = 1
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
  closePopMask(item, panelList) {
    item.status = 0
    this.setState({
      panelList: [...panelList]
    })
  }

  hourCompute(stamp) {
    stamp = parseInt(stamp) - new Date().getTime()
    if (stamp >= 0) {
      let hour = parseInt(stamp / 1000 / 3600, 10)
      if (hour.length < 10) {
        return ('0' + hour)
      } else {
        return hour
      }
    } else {
      return '00'
    }
  }

  minuteCompute(stamp) {
    stamp = parseInt(stamp) - new Date().getTime()
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
    stamp = parseInt(stamp) - new Date().getTime()
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
    stamp = parseInt(stamp) - new Date().getTime()
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

  inviteFriend(item, panelList) {
    item.status = 2

    this.setState({
      panelList: [...panelList]
    })
  }

  maskTypeShow = (item, coinType) => {

    if (parseInt(item.endtime) < (new Date().getTime())) {
      item.status = 4
    } if (parseInt(item.endtime) > (new Date().getTime()) && item.status == 4) {
      item.status = 0
    }
    if (item.status === 0) {
      return
    } else if (item.status === 1) {
      return (
        <div className={styles.panelStatus}>
          <div className={styles.mask}></div>
          <div className={styles.popType}>
            <span className={styles.closeIcon}
              onClick={this.closePopMask.bind(this, item, this.props.game.gameList)}
            ></span>
            <div className={styles.share}>
              <p className={styles.tips}>你有<span className={styles.freeTimes}>{this.state.freeBuyTimes}</span>次免费参与的机会</p>
              <div className={styles.iconShare}>
                <span className={styles.operation}>
                  <button
                    className={styles.green}
                    onClick={this.fetchFreeBuy.bind(this, item, this.props.game.gameList)}
                  >免费参与</button>
                  <button
                    className={styles.purple}
                    onClick={this.inviteFriend.bind(this, item, this.props.game.gameList)}
                  >邀请好友</button>
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (item.status === 2) {
      return (
        <div className={styles.panelStatus}>
          <div className={styles.mask}></div>
          <div className={styles.popType}>
            <span className={styles.closeIcon}
              onClick={this.closePopMask.bind(this, item, this.props.game.gameList)}
            ></span>
            <div className={styles.share}>
              <p className={styles.tips}>每成功邀请一个朋友玩CT接龙，你就获得1次免费参与的机会，邀请10人则为10次，以此类推</p>
              <div className={styles.iconShare}>
                {/* <Link to='/' className={styles.toqq}><img alt='share' src={images.qqShare} /></Link>
                <Link to='/' className={styles.toqz}><img alt='share' src={images.qzone} /></Link>
                <Link to='/' className={styles.towb}><img alt='share' src={images.weibo} /></Link>
                <Link to='/' className={styles.torr}><img alt='share' src={images.renren} /></Link> */}
                <Share
                  class="social-share"
                  url={'http://fftest.chawong.cn/#/user/register/' + this.props.user.refcode}
                  title='玩CT接龙，赢千万大奖，享亿级分红'
                  description='玩CT接龙，赢千万大奖，享亿级分红'
                  sites={['qzone', 'qq', 'weibo']}
                  image={null}
                >
                  {/* <a href="https://www.baidu.com" key='weibo' class="social-share-icon icon-weibo"></a>
                    <a href="www.baidu.com" key='qq' class="social-share-icon icon-qq"></a>
                    <a href="www.baidu.com" key='qzone' class="social-share-icon icon-qzone"></a>
                    <a href="http://www.baidu.com" key='wechat' class="social-share-icon icon-wechat"></a> */}
                </Share>
                <div className={styles.wechatIcon}>
                  <Icon type='wechat' size='27' color='#fff' />
                  <span className={styles.qrContainer}>
                    <h4 className={styles.scan}>微信扫一扫</h4>
                    <QRCode size={130}
                      value={'http://testweb.crebe.io/#/newlogin/' + this.props.user.refcode}
                    />
                  </span>

                </div>
              </div>
              <p className={styles.tips}>或提示朋友注册时输入你的邀请码：<span>{this.props.user.refcode}</span></p>
            </div>
          </div>
        </div>
      )
    } else if (item.status === 3) {
      return (
        <div className={styles.panelStatus}>
          <div className={styles.mask}></div>
          <div className={styles.popType}>
            <span className={styles.closeIcon}
              onClick={this.closePopMask.bind(this, item, this.props.game.gameList)}
            ></span>
            <div className={styles.popups}>
              <p className={styles.tips}>当前接龙CT：<span>{item.nownum}</span> 个</p>
              <p className={styles.selectCoin}>
                <span className={styles.coinItem} onClick={this.selectCoin.bind(this, 'BTC')}>
                  <img src={coinType === 'BTC' ? images.radio_03 : images.radio_04} alt='' />
                  <span>BTC：{item.btcpay} 个</span>
                </span>
                <span className={styles.coinItem} onClick={this.selectCoin.bind(this, 'ETH')}>
                  <img src={coinType === 'ETH' ? images.radio_03 : images.radio_04} alt='' />
                  <span>ETH：{item.ethpay} 个</span>
                </span>
                <span className={styles.coinItem} onClick={this.selectCoin.bind(this, 'USDT')}>
                  <img src={coinType === 'USDT' ? images.radio_03 : images.radio_04} alt='' />
                  <span>USDT：{item.usdtpay} 个</span>
                </span>
              </p>
              <p className={styles.buyOperation}>
                <span className={styles.buy}>
                  <button
                    className={styles.green}
                    onClick={() => this.fetchBuy(item)}
                  >兑换</button>
                  {/* <span>{this.state.coinType}账户余额不足</span> */}
                </span>
              </p>
            </div>
          </div>
        </div>
      )
    } else if (item.status === 4) {
      return (
        < div className={styles.panelStatus + " " + styles.over} >
          <div className={styles.mask}></div>
          <div className={styles.popType}>
            <div className={styles.gameover}>
              <p className={styles.title}>已结束</p>
              <p className={styles.tips}>恭喜 <span>{item.winner}</span> 获得 <span>{item.total}</span> 个CT大奖</p>
            </div>
          </div>
        </div >
      )
    }
  }

  operationButtonType(item, panelList) {
    if (parseInt(item.endtime) > (new Date().getTime())) {
      return (
        <span className={styles.operation}>
          <button className={styles.green} onClick={this.buyPlay.bind(this, item, panelList)}>立即参与</button>
          <button className={styles.purple} onClick={this.freePlayChange.bind(this, item, panelList)}>免费玩</button>
        </span>
      )
    } else {
      return (
        <span className={styles.operation}>
          <button className={styles.disabledButton} >立即参与</button>
          <button className={styles.disabledButton}>免费玩</button>
        </span>
      )
    }
  }

  recordPanelDisplay(panelList, item, type) {
    if (type === 'open') {
      item.panelDisplay = true
    } else {
      item.panelDisplay = false
    }


    this.setState({
      panelList: [...panelList]
    })
  }
  recordTabDisplay(panelList, item, type) {
    item.recordTabIndex = type
    this.setState({
      panelList: [...panelList]
    })
  }

  recordListDisplay(list, type) {
    let res = []
    if (list && Array.isArray(list) && list.length > 0) {
      let length = list.length > 20 ? 20 : list.length
      for (let i = 0; i < length; i++) {
        res.push(
          <li className={styles.listItem + ' ' + (i === 0 && type === 'total' ? styles.first : '')} key={i}>
            <span className={styles.nickname}>
              {(! list[i].nickname.trim()) && type === 'mine' ? this.props.user.nickname : list[i].nickname}
              <img src={i === 0 && type === 'total' ? crown_01 : ''} />
            </span>
            <span className={styles.times}>{list[i].partake_count}</span>
            <span className={styles.amounts}>{list[i].number}</span>
            <span className={styles.totalParise}>{list[i].bounscount}</span>
            <span className={styles.time}>{formatTime('yyyy-MM-dd hh:mm:ss', list[i].time)}</span>
          </li>
        )
      }
    } else {
      res.push(
        <li className={styles.emptyList}>
          <p>当前记录为空</p>
        </li>
      )
    }

    return res
  }

  panelListDisplay(panelList, coinType) {
    let res = panelList.map((item, index) => {
      let hour = this.hourCompute(item.endtime)
      let minute = this.minuteCompute(item.endtime)
      let second = this.secondCompute(item.endtime)
      let millisecond = this.millisecondCompute(item.endtime)
      return (
        <div className={styles.panel} key={index}>
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.number}>{'NO.' + item.id}</div>
              {/* <span className={styles.participants}>
                当前参与人次：<span>{item.partakecount}</span> 人次
              </span> */}
              <div className={styles.participants}>
                <span
                  className={styles.title}
                  onClick={(e) => this.recordPanelDisplay(panelList, item, 'open')}
                >
                  当前参与记录
                </span>
                <div className={styles.recordPanel} style={{ display: (item.panelDisplay ? 'block' : 'none') }}>
                  <div className={styles.mask}></div>
                  {/* <div className={styles.rulesBg}></div> */}
                  <div className={styles.content}>
                    <span className={styles.closeIcon}
                      onClick={(e) => this.recordPanelDisplay(panelList, item, 'close')}
                    ></span>
                    <h5 className={styles.title} >NO.{item.id} 接龙记录</h5>
                    <div className={styles.recordTab}>
                      <span
                        className={item.recordTabIndex === 2 ? '' : styles.activeTab}
                        onClick={(e) => this.recordTabDisplay(panelList, item, 1)}
                      >全部参与记录</span>
                      <span
                        className={item.recordTabIndex === 2 ? styles.activeTab : ''}
                        onClick={(e) => this.recordTabDisplay(panelList, item, 2)}
                        style={{ display: (tokenVerify() ? 'inlineBlock' : 'none') }}
                      >我的参与记录</span>
                    </div>
                    <div className={styles.info}>
                      <p>1、记录最多显示最新20条，按CT数量由大到小排序</p>
                      <p>2、当前奖池 = 平台投入CT总量 + 用户投入CT数量 * 1‰ * 20%</p>
                    </div>
                    <div className={styles.recordTable}>
                      <p className={styles.listHeader}>
                        <span className={styles.nickname}>昵称</span>
                        <span className={styles.times}>参与次数</span>
                        <span className={styles.amounts}>CT数量</span>
                        <span className={styles.totalParise}>当前奖池</span>
                        <span className={styles.time}>参与时间</span>
                      </p>
                      <Scrollbar
                        damping={0.1}
                        thumbMinSize={2}
                        renderByPixels={true}
                        alwaysShowTracks={true}
                        continuousScrolling={true}
                      >
                        <ul className={styles.listContent} style={{ display: item.recordTabIndex === 2 ? 'block' : 'none' }}>
                          {
                            this.recordListDisplay(item.user_partakes, 'mine')
                          }
                        </ul>
                        <ul className={styles.listContent} style={{ display: item.recordTabIndex === 2 ? 'none' : 'block' }}>
                          {
                            this.recordListDisplay(item.user_partake_list, 'total')
                          }
                        </ul>
                      </Scrollbar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.body}>
              <span className={styles.time}>
                <Icon size='42' color="#c6c3d4" type='time' />
                <span className={styles.countdown}>
                  <span>{hour}</span><span className={styles.disc}>:</span>
                  <span>{minute}</span><span className={styles.disc}>:</span>
                  <span>{second}</span><span className={styles.disc}>:</span>
                  <span>{millisecond}</span>
                </span>

              </span>
              {this.operationButtonType(item, panelList)}
            </div>
            <div className={styles.footer}>
              {/* <span>你的分红：<span className={styles.value}>{item.dividends}</span> 个CT</span> */}
              <span>当前参与人次：<span className={styles.value}>{item.partakecount}</span> </span>
              <span>当前奖池：<span className={styles.value}>{item.bounscount}</span> 个CT</span>
              <span>当前接龙：<span className={styles.value}>{item.nownum}</span> 个CT</span>
              <span style={{ display: (tokenVerify() ? 'inlineBlock' : 'none') }}>
                我的分红：<span className={styles.value}>{item.dividends}</span> 个CT
              </span>
            </div>
          </div>
          {this.maskTypeShow(item, coinType)}
        </div>
      )
    })
    return res;
  }

  showRuleAction() {
    this.setState({
      showRules: true
    })
  }
  closeRuleAction() {
    this.setState({
      showRules: false
    })
  }

  render() {
    return (
      <div className={styles.qqgame}>
        <div className={styles.gameBg}>
          <div className={styles.action}>
            <button
              className={styles.green}
              onClick={(e) => this.showRuleAction(e)}
            >点击查看玩法规则</button>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.rules} style={{ display: (this.state.showRules ? 'block' : 'none') }}>
            <div className={styles.mask}></div>
            <div className={styles.rulesBg}></div>
            <div className={styles.content}>
              <span className={styles.closeIcon}
                onClick={(e) => this.closeRuleAction()}
              ></span>
              <h5 className={styles.title} >玩法规则</h5>
              <ul>
                <li className={styles.rule} >
                  <p>1、CT接龙是参与买购CT交易所平台币CT币的趣味游戏，参与人数越多，中奖者获得的奖金越多，倍数越高;</p>
                </li>
                <li className={styles.rule} >
                  <p>2、CT接龙从1个CT开始购买，每新增一名购买者，购买CT币的数量就增加1个CT币，购买的CT币不锁仓，不限参与次数，可以重复无限购买;</p>
                </li>
                <li className={styles.rule} >
                  <p>3、初始奖池由CT交易所投入10万个CT,每增加1人次参入，CT交易所再投入1个CT</p>
                  <p className={styles.example}>举例：</p>
                  <p className={styles.example}>10万人参加，CT交易所投入20万个CT币进去奖池</p>
                </li>
                <li className={styles.rule} >
                  <p>4、用户交易会产生1‰的手续费，手续费的80%分红，按当次交易前用户参与次数平均分配；手续费的20%投入到奖池中;</p>
                </li>
                <li className={styles.rule} >
                  <p>5、奖池总币量 = CT交易所投入的币量+  所有手续费的20%;</p>
                  <p className={styles.example}>举例： 参与10万人次</p>
                  <p className={styles.example}>奖池总量  =  CT交易所投入20万个CT +手续费100万个CT</p>
                  <p className={styles.example}>参与100万人次</p>
                  <p className={styles.example}>奖池总量  =  CT交易所投入110万个CT + 手续费1000万个CT</p>
                </li>
                <li className={styles.rule} >
                  <p>6、游戏开始即24小时倒计时，当倒计时小于24小时，每新增一名参与者，倒计时增加15秒，最大时是24小时;</p>
                </li>
                <li className={styles.rule} >
                  <p>7、成功邀请1名朋友参与，即可免费参与1次，多邀多得;</p>
                </li>
                <li className={styles.rule} >
                  <p>8、倒计时结束时，最后一名参与者获得奖池中所有奖金。</p>
                </li>
              </ul>
            </div>

          </div>

          <div className={styles.games}>
            <div className={styles.panelList}>
              {this.panelListDisplay(this.props.game.gameList, this.state.coinType)}
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
