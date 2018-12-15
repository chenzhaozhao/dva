import React, {PureComponent} from 'react'
import {Link} from 'dva/router'
import {tokenVerify} from '../../utils'
import images from '../../common/images'
import loginAvatar from '../../assets/images/loginAvatar.png'
import LevelIcon from "../../components/LevelIcon"
import Avatar from "../../components/Avatar"
import VipType from "../../components/VipType"
import styles from './PersonalBillboard.less';
import intl from 'react-intl-universal'
import ct_icon from '../../assets/images/ct_icon.png'

export default class PersonalBillboard extends PureComponent {
    render() {
        const {sumiss}=this.props;
        return (
            <div className={styles.personalBillboard}>
                <div className={styles.penguinDesk}>
                </div>

                <div className={styles.personalInfo}>
                    <div className={!tokenVerify() ? styles.display + " " + styles.login : styles.login}>
                        <div className={styles.loginAvatar}>
                            <img src={loginAvatar} alt=""/>
                        </div>
                        <p className={styles.tips}>{intl.get('HOME_Login_and_check_your_information')}</p>
                        <Link to='/newlogin' className={styles.login}>{intl.get('LOGIN')}</Link>
                    </div>
                    <div className={tokenVerify() ? styles.display : ''}>
                        <div className={styles.personalPanelHeader}>
                            <div className={styles.avatar}>
                                <Avatar avatarSize='50' level={this.props.user.level}/>
                            </div>
                            <div className={styles.mes}>
                                <div className={styles.userName}>
                                    {this.props.user.nickname.trim() || '游客'}
                                    <VipType vipType={this.props.user.viptype}/>
                                </div>
                                <div className={styles.userLeval}>
                  <span className={styles.levalInfo}>
                    <img src={images.level} alt=""/>
                    <span className={styles.levelNumber}>{this.props.user.level}</span>
                  </span>
                                    <LevelIcon level={this.props.user.level}/>
                                    {/* <span className={styles.tips}>{vipSpeedup(this.props.user.viptype)}倍加速中</span> */}
                                </div>
                            </div>
                        </div>
                        <div className={styles.personalPanelBody}>
                            <div className={styles.qqamount}>
                                <p className={styles.pTitle}>{intl.get('HOME_CT_Amount')}</p>
                                <p className={styles.pContent}>{this.props.user.positions || 0} CT<span
                                    className={styles.psTitle}><Link className={styles.hoverLink} to='/manager'>{intl.get("FINANCIAL_MANAGEMENT")}</Link></span></p>
                            </div>
                            <div className={styles.mineInfo}>
                                <div className={styles.profit}>
                                    <p className={styles.pTitle}>{intl.get('HOME_Yesterday_Profit')}</p>
                                    <p className={styles.pContent}>{this.props.myYesterdayProfit || 0} CT<Link
                                        to='/levelprofit'
                                        className={styles.strategy + " " + styles.psTitle+" "+styles.hoverLink}>{intl.get('HOME_Profit_Strategy')}</Link>
                                    </p>

                                </div>
                                <div className={styles.recommand}>
                                    <p className={styles.pTitle}>{intl.get('HOME_Total_Referral')}</p>
                                    <p className={styles.pContent}>{this.props.user.invitationnumber || 0}{intl.get('PERSON')}<Link
                                        to='/manager/recommendStatistic/recommendFriend'

                                        className={styles.strategy+" "+styles.hoverLink}>{intl.get('HOME_Invite_Friends')}</Link></p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className={styles.middle}>
                    <span>{intl.get("TOTAL_ISSUED")}</span> <span><img src={ct_icon} alt=""/><span>{(sumiss.sumissuenum)}</span></span>
                </div>
                <div className={styles.middlens}>
                    <div className={styles.line}>
                        <div>{intl.get("TOTAL_CIRCULATON")}<br/> <span>{Math.floor(sumiss.sumturnover) } CT</span></div>
                        <div>{intl.get("Daily_CI")}<br/> <span>{Math.floor(sumiss.dayturnover)} CT</span></div>
                    </div>
                    <div className={styles.line}>
                        <div style={{paddingTop:8}}>{intl.get("TOTAL_DESTRUCTION")} <br/><span>{Math.floor(sumiss.sumdestroynum) } CT</span></div>
                        <div style={{paddingTop:8}}>{intl.get("DAILY_DESTRUCTION")} <br/><span>{Math.floor(sumiss.daydestroynum)} CT</span></div>
                    </div>
                </div>
                <div className={styles.personalProfit}>
                    <div className={styles.totalTodayToDistribute}>
                        <p className={styles.pTitle}>{intl.get("HOME_Total_Profit_CTs_for_Today")}</p>
                        <p className={styles.pContent}>{this.props.home.today || 0} CT</p>
                    </div>
                    <div className={styles.totalYesterdayToDistribute}>
                        <p className={styles.pTitle}>{intl.get("HOME_Total_Profit_CTs_For_Yesterday")}</p>
                        <p className={styles.pContent} style={{margin:0}}>{this.props.home.yesterday || 0} CT</p>
                    </div>
                    <div className={styles.newsList}>
                        {
                            (this.props.home.newBoards || []).map((item, index) => {
                                return (
                                    <p className={styles.news} key={index}>
                                        <span className={styles.newsTitle}>{item.levelcount}</span>
                                        <span className={styles.newsContent}>{item.onesharenum}</span>
                                        <span className={styles.rate}>{item.annualized}</span>
                                    </p>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}
