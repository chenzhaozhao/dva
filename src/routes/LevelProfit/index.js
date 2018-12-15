import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import styles from './index.less'
import images from '../../common/images'
import { Button, Message } from 'element-react'
import { Dialog } from 'element-react'
import LevelIcon from '../../components/LevelIcon'
import Avatar from '../../components/Avatar'
import VipType from '../../components/VipType'
import { tokenVerify, vipSpeedup, formatTime } from '../../utils'
import intl from 'react-intl-universal'
@connect(state => ({
  user: state.user,
  levelProfit: state.levelProfit
}))
export default class LevelProfit extends PureComponent {
  state = {
    displayType: 1,
    login: true,
    levelPercent: '59%',
    upgradeType: 1,
    rechargeDialogVisible: false,
    rechargeVipSelected: null,
    rechargeVipYearSelected: null,
    rechargeSuperVipSelected: null,
    rechargeTabShowIndex: 1,
    leverTableItems: 256,
    feeid: '',
    panelList: [],

  }

  upgradeTypeChange(type) {
    this.setState({
      upgradeType: type
    })
  }
  introduceTypeDisplay(type) {
    this.setState({
      displayType: type
    })
  }

  rechargeActive() {
    if (!this.state.feeid.trim()) {
      Message({
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
          Message({
            type: 'success',
            message: '充值成功!',
            duration: 2000
          });
        } else {
          Message({
            type: 'error',
            message: intl.get(data.msg),
            duration: 2000
          });
        }
      }
    })
  }
  personStatus(i) {
    if (i < 16) {
      return '无'
    } else if (i >= 16 && i < 64) {
      return '志愿者'
    } else if (i >= 64 && i < 256) {
      return '志愿者、保荐人'
    } else if (i === 256) {
      return '志愿者、超级保荐人'
    }
  }
  levelTableDisplay(level) {
    let displayLevel = Math.floor(24 / 100) * 100 + 1;
    let res = [];
    for (let i = displayLevel; i < (displayLevel + 100); i++) {
      res.push(
        <div className={styles.tableItem} key={i}>
          <span className={styles.userLevel}>{i}</span>
          <div className={styles.levelIcon}><LevelIcon level={i} /></div>
          <span className={styles.activeDays}>{i * i + 4 * i}</span>
          {/* <span className={styles.vipSpeedUp2}>{Math.ceil((i * i + 4 * i) / 2)}</span>
          <span className={styles.vipSpeedUp3}>{Math.ceil((i * i + 4 * i) / 3)}</span>
          <span className={styles.vipSpeedUp10}>{Math.ceil((i * i + 4 * i) / 10)}</span> */}
          <span className={styles.transactionSpeedUp}>{intl.get("LPT_Equivalent")} {this.tradeAmountLevel(i, i * i + 4 * i)}CT</span>
          <span className={styles.recommandSpeedUp}>{intl.get("LPT_Equivalent")} {this.tradeAmountLevel(i, i * i + 4 * i) * 5}CT </span>
          {/* <span className={styles.profitTimes}>{i}</span> */}
          {/* <span className={styles.privilege}>{this.personStatus(i)}</span> */}
        </div>
      )

    }
    return res
  }

  computedActiveDays(level, type, viptype) {
    let speedup = 1
    // if (viptype === '2') {
    //   speedup = 2
    // } else if (viptype === '3') {
    //   speedup = 3
    // } else if (viptype === '4') {
    //   speedup = 4
    // }
    if (type === 'days') {
      let nextLevel = (parseInt(level) + 1) * (parseInt(level) + 1) + 4 * (parseInt(level) + 1)
      let curLevel = parseInt(level) * parseInt(level) + 4 * parseInt(level)
      let thisLevelDays = nextLevel - curLevel
      let needDays = ((nextLevel - parseInt(this.props.user.activeday)) / speedup).toFixed(0)

      let percent = (((parseInt(this.props.user.activeday) - curLevel)) / thisLevelDays * 100) + '%'
      this.setState({ levelPercent: percent })
      return needDays
    } else if (type === 'qq') {
      let nextLevel = (parseInt(level) + 1) * (parseInt(level) + 1) + 4 * (parseInt(level) + 1)
      let curLevel = parseInt(level) * parseInt(level) + 4 * parseInt(level)
      let needDays = ((nextLevel - parseInt(this.props.user.activeday)) / speedup).toFixed(0)
      let thisLevelDays = nextLevel - curLevel

      let percent = ((parseInt(this.props.user.activeday) - curLevel) / thisLevelDays * 100) + '%'
      this.setState({ levelPercent: percent })

      return (needDays + '万')
    } else if (type === 'friend') {
      let nextLevel = (parseInt(level) + 1) * (parseInt(level) + 1) + 4 * (parseInt(level) + 1)
      let curLevel = parseInt(level) * parseInt(level) + 4 * parseInt(level)
      let needDays = ((nextLevel - parseInt(this.props.user.activeday)) / speedup).toFixed(0)
      let thisLevelDays = nextLevel - curLevel

      let percent = ((parseInt(this.props.user.activeday) - curLevel) / thisLevelDays * 100) + '%'
      this.setState({ levelPercent: percent })
      return (needDays * 5 + '万')
    }
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
          //this.state.panelList = data.data
          this.setState({
            panelList: [...data.data]
          })
        } else {
          Message({
            type: 'error',
            message: intl.get(data.msg),
            duration: 2000
          });
        }
      }
    })
  }

  selectFeeType(index, feeid) {
    this.setState({
      rechargeVipSelected: index,
      feeid: feeid
    })
  }

  overduetimeDisplay(overduetime) {
    if (overduetime === '0' || overduetime === 0) {
      return
    } else if (overduetime) {
      return (
        <span>{formatTime('yyyy-MM-dd', this.props.user.overduetime)}{intl.get("EXPIRE")}</span>
      )
    }
  }

  tradeAmount(level, type) {
    let amount
    if (level && level < 20 && level > 10) {
      amount = 1000
    } else if (level && level > 20) {
      amount = 10000
    } else {
      amount = 100
    }
    if (type && type === 'friend') {
      amount = amount * 5
    }
    return amount
  }

  /*
  计算交易升级不同的等级需要的交易量
  因为分成三个阶段，需要每个阶段重新算
  传入参数level:等级，activeDays活跃天数
   */
  tradeAmountLevel(level, activeDays) {
    let amount
    let tradeAmount
    if (level && level <= 10) {
      amount = 100
      tradeAmount = activeDays * amount

    } else if (level && level <= 20 && level > 10) {
      amount = 1000
      tradeAmount = activeDays * amount - 140 * 900
    } else {
      amount = 10000
      tradeAmount = activeDays * amount - 140 * 9900 - (480 - 140) * 9000
    }
    return tradeAmount
  }

  render() {
    const { user } = this.props;
    return (
      <div className={styles.levelProfit}>
        <div className={styles.rechargeDialog}>
          <Dialog
            title={intl.get("Recharge")}
            visible={this.state.rechargeDialogVisible}
            onCancel={() => this.setState({ rechargeDialogVisible: false })}
          >
            <Dialog.Body>
              <div className={styles.tabList}>
                <div
                  className={this.state.rechargeTabShowIndex === 1 ? styles.active : ''}
                  onClick={() => this.selectPanelList(2)}
                >
                  <span className={styles.vipMember}>{intl.get("VIPMEMBER")}</span>
                  <span className={styles.vipSpeedUp}>{intl.get("ENJOY_2X_ACCELERATION")}</span>
                </div>
                <div
                  className={this.state.rechargeTabShowIndex === 2 ? styles.active : ''}
                  onClick={() => this.selectPanelList(3)}
                >
                  <span className={styles.vipMember}>{intl.get("ANNUAL_FEE_VIP_MEMBER")}</span>
                  <span className={styles.vipSpeedUp}>{intl.get("ENJOY_3X_ACCELERATION")}</span>
                </div>
                <div
                  className={this.state.rechargeTabShowIndex === 3 ? styles.active : ''}
                  onClick={() => this.selectPanelList(4)}
                >
                  <span className={styles.vipMember}>{intl.get("SUPER_VIP_MEMBER")}</span>
                  <span className={styles.vipSpeedUp}>{intl.get("ENJOY_10X_ACCELERATION")}</span>
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
                            <div className={styles.panelFooter}>{item.month}{intl.get("MONTH")}</div>
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
                onClick={(e) => this.rechargeActive()}
              >{intl.get("RECHARGE")}</Button>
            </Dialog.Footer>
          </Dialog>
        </div>
        <div className={styles.levelProfitBg}>
          <div
            className={styles.unlogin}
            style={{ display: (!tokenVerify() ? 'block' : 'none') }}
          >
            <div className={styles.lv_login_bg}>
              <Link to='/newlogin' className={styles.defaultButton} >{intl.get("LOGIN_TO_VIEW_LEVEL")}</Link>
            </div>
          </div>
          <div
            className={styles.login}
            style={{ display: (tokenVerify() ? 'flex' : 'none') }}
          >
            <div className={styles.avatar}>
              <Avatar avatarSize='100' level={user.level} />
            </div>
            <div className={styles.infomation}>
              <div>
                <div className={styles.memberInfo}>
                  <div className={styles.userInfo}>
                    <p className={styles.text}>
                      <span className={styles.username}>{user.nickname.trim() ? user.nickname : ''}</span>
                      {/* <span className={styles.member}>
                        <VipType vipType={user.viptype} />
                      </span> */}
                      {/* <span
                        className={styles.endDate}
                      >{this.overduetimeDisplay(user.overduetime)} </span> */}
                    </p>
                    <p className={styles.levelIcon}>
                      <span className={styles.level}>
                        <img src={images.level} />
                        <span className={styles.levelNumber}>{user.level}</span>
                      </span>
                      <span className={styles.icon}>
                        <LevelIcon level={user.level} />
                      </span>
                      {/* <span>{vipSpeedup(user.viptype)}倍加速中</span>*/}
                    </p>
                  </div>
                  {/* <div className={styles.actions}>
                    <button className={styles.vip +" "+ styles.defaultButton}
                      onClick={()=>this.selectPanelList(2, '2') }
                    > {user.viptype === '1' ? '开通vip' : 'VIP续费'}</button>
                     <button
                      className={styles.svip +" "+ styles.defaultButton}
                      onClick={()=>this.selectPanelList(4, '3')}
                      >升级超级VIP<br/>享10倍加速</button>
                  </div> */}

                </div>
                <div className={styles.upgrade}>
                  <span onClick={this.upgradeTypeChange.bind(this, 1)} className={this.state.upgradeType == 1 ? styles.active : ''}>{intl.get("ACTIVE_UPGRADE")}</span>
                  <span onClick={this.upgradeTypeChange.bind(this, 2)} className={this.state.upgradeType == 2 ? styles.active : ''}>{intl.get("TRANSACTION_UPGRADE")}</span>
                  <span onClick={this.upgradeTypeChange.bind(this, 3)} className={this.state.upgradeType == 3 ? styles.active : ''}>{intl.get("RECOMENDED_UPGRADE")}</span>
                </div>
              </div>
              <p className={styles.progress}>
                <span className={styles.level_begin}>LV.{user.level}</span>
                <span className={styles.bar} style={{ width: this.state.levelPercent }}></span>
                <span className={styles.dialog}>
                  <span className={this.state.upgradeType == 1 ? styles.upgradeType1 : ''}>
                    <span>{intl.get("CUEEENT_ACTIVE_DAYS")} {user.activeday} {intl.get("ACTIVE_DAYS")}</span>
                    <span>{intl.get("NEED_TO_UPGRADE_TO_THE_NEXT_LEVEL")} {this.computedActiveDays(user.level, 'days', 1)} {intl.get("DAY")}</span>
                  </span>
                  <span className={this.state.upgradeType == 2 ? styles.upgradeType2 : ''}>
                    <span>{intl.get("TRANSACTION_EQUIVALENT")} {this.tradeAmountLevel(user.level + 1, (user.level + 1) * (user.level + 1) + 4 * (user.level + 1)) - this.tradeAmountLevel(user.level, user.activeday)} CT {intl.get("CTS_CAN_BE_UPGRADED_IMMEDIATELY")}</span>
                    <span><Link to='/transactionAdvanced/3/2/BTC/USDT' >{intl.get("TRADE")}</Link></span>
                  </span>
                  <span className={this.state.upgradeType == 3 ? styles.upgradeType3 : ''}>
                    <span>{intl.get("RETRANSACTION_EQUIVALENT")} {(this.tradeAmountLevel(user.level + 1, (user.level + 1) * (user.level + 1) + 4 * (user.level + 1)) - this.tradeAmountLevel(user.level, user.activeday)) * 5} CT</span>
                    <span><Link to='/manager/recommendStatistic/recommendFriend' >{intl.get("INVITE_FRIENDS_TO_HELP")}</Link></span>
                  </span>
                </span>

                <span className={styles.level_end}>LV.{parseInt(user.level) + 1}</span>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.introduce}>
            <div className={styles.header}>
              <div className={styles.navList}>
                <div onClick={this.introduceTypeDisplay.bind(this, 1)} className={styles.item + " " + (this.state.displayType == 1 ? styles.navSelected : '')}>
                  <p className={styles.title}>{intl.get("LPT_Level_Instruction")}</p>
                  {/* <p className={styles.info}>用户等级升级计算方式请参考腾讯CT的升级方式</p> */}
                </div>
                <div onClick={this.introduceTypeDisplay.bind(this, 2)} className={styles.item + " " + (this.state.displayType == 2 ? styles.navSelected : '')}>
                  <p className={styles.title}>{intl.get("LPT_Profit_Instruction")}</p>
                </div>
                <div onClick={this.introduceTypeDisplay.bind(this, 3)} className={styles.item + " " + (this.state.displayType == 3 ? styles.navSelected : '')}>
                  <p className={styles.title}>{intl.get("LEVEL_ACCELERATION_INSTRUCTION")}</p>
                </div>
              </div>
            </div>
            <div className={styles.content}>
              <div className={this.state.displayType == 1 ? styles.displayTypeShow : styles.displayTypeHidden}>
                <div className={styles.displayItem}>
                  <div className={styles.descContent}>
                    <div className={styles.icon}>
                      <img src={images.lp_star} />
                    </div>
                    <div className={styles.desc}>
                      <p>{intl.get("LPT_Active_Days_Calculation")}</p>
                      <p>{intl.get("LPT_Active_Days_Calculation_Description")}</p>
                    </div>
                  </div>
                  <div className={styles.descContent}>
                    <div className={styles.icon}>
                      <img src={images.lp_star} />
                    </div>
                    <div className={styles.desc}>
                      {/* <p>
                        <img src={images.level_formula} />
                      </p> */}
                      <p>{intl.get("LPT_Active_Days_Level_Relation")} </p>
                      <p>{intl.get("LPT_Active_Days_Level_Relation_Formula")}</p>
                    </div>
                  </div>
                  <div className={styles.descContent}>
                    <div className={styles.icon}>
                      <img src={images.lp_star} />
                    </div>
                    <div className={styles.desc}>
                      <p>{intl.get("LPT_Level_Up_Need_Days")} </p>
                      <p>{intl.get("LPT_Level_Up_Need_Days_Formula")}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={this.state.displayType == 2 ? styles.displayTypeShow : styles.displayTypeHidden}>
                <div className={styles.displayItem}>
                  <div className={styles.descContent}>
                    <div className={styles.icon}>
                      <img src={images.lp_porket} />
                    </div>
                    <div className={styles.desc}>
                      <p>{intl.get("LPT_Profit_Instruction_Profit_Premise")}</p>
                      <p>{intl.get("LPT_Profit_Instruction_Profit_Description")}</p>
                      <p>{intl.get("LPT_Profit_Instruction_Profit_Time")}</p>
                    </div>
                  </div>
                  <div className={styles.descContent}>
                    <div className={styles.icon}>
                      <img src={images.lp_5} />
                    </div>
                    <div className={styles.desc}>
                      <p>{intl.get("LPT_Profit_Instruction_Profit_Formula")} </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={this.state.displayType == 3 ? styles.displayTypeShow : styles.displayTypeHidden}>
                <div className={styles.displayItem}>
                  {/* <div className={styles.descContent}>
                    <div className={styles.icon}>
                      <img src={images.lp_5} />
                    </div>
                    <div className={styles.desc}>
                      <p>VIP加速</p>
                      <p>VIP=100 CT/月 <span>(2倍加速)</span></p>
                      <p>年费VIP=1000 CT <span>(3倍加速)</span></p>
                      <p>超级VIP=1000 CT/月 <span>(10倍加速)</span></p>
                    </div>
                  </div> */}
                  <div className={styles.descContent}>
                    <div className={styles.icon}>
                      <img src={images.lp_6} />
                    </div>
                    <div className={styles.desc}>
                      <p>{intl.get("LPT_Acceleration_By_Trading")}</p>
                      <p>{intl.get("EVERY_TO_VOL")}{this.tradeAmount(user.level)}{intl.get("TRCE_TO_ACCELERATE")}</p>
                    </div>
                  </div>
                  <div className={styles.descContent}>
                    <div className={styles.icon}>
                      <img src={images.lp_7} />
                    </div>
                    <div className={styles.desc}>
                      <p>{intl.get("INVITATION_TO_ACCELERATE")}</p>
                      <p>{intl.get("LPL_USERS_INVITE_FRINENDS_TO")}{this.tradeAmount(user.level) * 5}{intl.get("LPL_TRANSACTION_VOLUME")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.levelTable}>
            <div className={styles.levelTableHeader}>
              <span className={styles.userLevel}>{intl.get("LPT_Levels")}</span>
              <span className={styles.levelIcon}>{intl.get("LPT_Level_Mark")}</span>
              <span className={styles.activeDays}>{intl.get("LPT_Active_Days")}</span>
              {/* <span className={styles.vipSpeedUp2}>VIP加速(2倍)</span>
              <span className={styles.vipSpeedUp3}>年费VIP加速(3倍)</span>
              <span className={styles.vipSpeedUp10}>超级VIP加速(10倍)</span> */}
              <span className={styles.transactionSpeedUp}>{intl.get("LPT_Acceleration_By_Trading")}</span>
              <span className={styles.recommandSpeedUp} style={{borderRight:0}}>{intl.get("LPT_Acceleration_By_Friend_Recommendation")}</span>
              {/* <span className={styles.profitTimes}>享受分红倍数</span> */}
              {/* <span className={styles.privilege}>享受特权</span> */}
            </div>
            <div className={styles.levelTableBody}>
              {this.levelTableDisplay(89)}
              {/* <div className={styles.tableItem}
                onClick={() => {
                  this.state.leverTableItems === 256 ? this.setState({ leverTableItems: 16 }) : this.setState({ leverTableItems: 256 })
                }
                }>
                <span className={styles.lastRow}>{this.state.leverTableItems === 256 ? '收起' : '查看更多'}</span>
              </div> */}
            </div>
          </div>
          <p className={styles.retireTip}>{intl.get("THE_HEIGR_THE_LEVEL_THE_HIGHTR")}</p>
          {/* <p className={styles.retireTip}>
            <a href='https://crebe.zendesk.com/hc/zh-cn/articles/360018005472-%E7%81%AB%E5%B8%81%E7%81%AB%E4%BC%B4%E6%8B%9B%E5%8B%9F'>*2、什么是志愿者、保荐人和超级保荐人？</a></p> */}
          {/* <div className={styles.strategy}>
            <p className={styles.title}>160倍分红攻略</p>
            <div className={styles.content}>
              <div className={styles.item}>
                <div className={styles.icon}><img src={images.lp_d_1} /></div>
                <p className={styles.itemTitle}>多交易</p>
                <p>每天可通过多交易加速直升1级，最快256天升至256级，实现160倍分红</p>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}><img src={images.lp_d_2} /></div>
                <p className={styles.itemTitle}>多邀请</p>
                <p>累计完成256名达到16级的会员即成为256级顶级会员获得160倍分红</p>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}><img src={images.lp_d_3} /></div>
                <p className={styles.itemTitle}>购买会员</p>
                <p>可以更快成为256级顶级会员获得160倍分红</p>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}><img src={images.lp_d_4} /></div>
                <p className={styles.itemTitle}>贡献资源</p>
                <p>贡献有效资源可获得特批跳级的权利，可以更快成为256级顶级会员获得160倍分红</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    )
  }
}
