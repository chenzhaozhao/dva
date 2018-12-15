import React, {PureComponent, createElement} from 'react'
import {connect} from 'dva'
//import iconStyles from '../../assets/css/iconfont/iconfont.css'
import styles from './NewIndex.less'
import logo_01 from '../../assets/images/logo.png'
import {Link} from 'dva/router'
import Icon from '../Icon'
import intl from 'react-intl-universal'
import find from "lodash.find";
import {SUPPOER_LOCALES} from "../../common/global";
import weixin from '../../assets/images/wexin.png'

import crebeFont from '../../assets/images/crebeFont.png';
import sbi from  '../../assets/images/sbi.png'
const currentLocale = find(SUPPOER_LOCALES, {
        value: sessionStorage.getItem('qq-to-locale-lang')
    }
);
const language = currentLocale.value.toLowerCase();
@connect(state => ({}))
export default class Footer extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        //const { links, copyright } = this.props
        // debugger
        return (
            <footer id="footer" className={styles.footer} style={{minWidth: this.props.footerWidth}}>
                <div className={styles.footerContainer} style={{width: this.props.footerContainerWidth}}>
                    <div className={styles.footerInfo} style={{width: this.props.footerInfoWidth}}>
                        <div className={styles.cWarp}>
                            <div className={styles.crebe}>
                                <Link to="/"> <img style={{paddingBottom:10}} src={crebeFont} alt=""/></Link>
                                <p>{intl.get("PEOPLE_WHO")}</p>
                                {/*<p style={{margin:"10px 0 15px 0"}}><a href={language==="en-us"?"https://crebe.zendesk.com/hc/en-us/categories/360001146311-Announcement-Center":`https://crebe.zendesk.com/hc/zh-cn/categories/360001116992-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83`} target='_blank'>support.crebe.com</a></p>*/}
                                {/*<p style={{lineHeight:"180%"}}>{intl.get("GREATE_A_FAST_EXPERIENCE_FOR_USERS")}</p>*/}
                                {/*<p style={{lineHeight:"180%"}}>{intl.get("FOCUS_ON_DEPTH_TO_PROMOTE")}</p>*/}
                                <p style={{marginTop: 10}}>@2018 crebe all rights reserved</p>
                                <ul className={styles.iconWarp}>
                                    <li>
                                        <a  href={language === "zh-cn" ? "https://t.me/crebe_CN6" : "https://t.me/crebe_EN2"}
                                           title='telegram' target="_blank">
                                            <div><Icon
                                                type='telegram'
                                                color='#9696a2'
                                                size='15'/></div>
                                            </a>
                                    </li>
                                    <li><a rel="nofollow" href="https://www.facebook.com/crebeofficial" title='facebook'
                                           target="_blank">
                                        <div><Icon
                                            type='facebook1' color='#9696a2' size='15'/></div>
                                        </a>

                                    </li>
                                    <li className={styles.wechatWarp}><a title='WeChat'
                                    >
                                        <div><Icon type='wechat' color='#9696a2' size='15'/>
                                            <div className={styles.wechat}>
                                                <img src={weixin} alt=""/></div>
                                        </div>
                                    </a>

                                    </li>
                                    {/* <a to="#" title='reddit'><Icon type='reddit' color='#9696a2' size='18' /></a> */}
                                    <li><a
                                        rel="nofollow"
                                        href={window.currentLocale === "zh-CN" ? "http://weibo.com/crebe" : "https://www.reddit.com/user/crebe-official"}
                                        title={window.currentLocale === "zh-CN" ? "Weibo" : "Reddit"} target="_blank">
                                        <div><Icon type={window.currentLocale === "zh-CN" ? 'weibo' : "reddit"}
                                                   color='#9696a2' size='15'/></div>
                                        </a>

                                    </li>
                                    {/* <a to="#" title='steemit'><Icon type='steemit' color='#9696a2' size='18' /></a> */}
                                    <li><a rel="nofollow" href="https://medium.com/@crebe" title='medium' target="_blank">
                                        <div><Icon
                                            type='medium'
                                            color='#9696a2'
                                            size='15'/></div>
                                       </a>

                                    </li>
                                    {/*<li><a href={`https://www.instagram.com/crebeofficial/?hl=${language}`}*/}
                                    {/*title='instagram'*/}
                                    {/*target="_blank"><div><Icon type='instagram' color='#9696a2' size='15'/></div> <span>Instagram</span></a>*/}

                                    {/*</li>*/}
                                    <li><a rel="nofollow" href="https://twitter.com/crebe8" title='twitter' target="_blank">
                                        <div><Icon
                                            type='twitter1'
                                            color='#9696a2'
                                            size='15'/></div>
                                        </a>

                                    </li>
                                </ul>
                            </div>

                        </div>

                        <div>
                            <ul>
                                <li>{intl.get("ABOUT_US")}</li>
                                <li><Link to="/contact">{intl.get("CONTACT_US")}</Link></li>
                                <li><a target='_blank'
                                       href={language === "en-us" ? "https://crebe.zendesk.com/hc/en-us/categories/360001146311-Announcement-Center" : `https://crebe.zendesk.com/hc/zh-cn/categories/360001116992-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83`}>{intl.get("ANNOUNCEMENT_CENTER")}</a>
                                </li>
                                <li><Link to="/consensus">{intl.get("COMMUNITY_CONSENSUS")}</Link></li>

                                {/*<li><Link to="/statement">{intl.get("LEGAL_STATEMENT")}</Link></li>*/}


                            </ul>
                            <ul>
                                <li>{intl.get("TERMS_AND_CONDITIONS")}</li>
                                <li><Link to="/privacy">{intl.get("PRIVACY_POLICY")}</Link></li>
                                <li><Link to="/protocol">{intl.get("USER_AGREEMENT")}</Link></li>
                                <li><Link to="/handlingfee">{intl.get("HANDLING_FEE")}</Link></li>
                                {/*<li><Link to="">{intl.get("APPLY_TO_LIST")}</Link></li>*/}
                                {/*<li><a href={`https://crebe.zendesk.com/hc/${language}/requests/new`}*/}
                                {/*target='_blank'>{intl.get("SUBMIT_A_REQUEST")}</a>*/}
                                {/*</li>*/}

                                {/*<li><a*/}
                                {/*href={language==="en-us"?"https://crebe.zendesk.com/hc/en-us/sections/360002742131-Beginner-s-Guide":`https://crebe.zendesk.com/hc/zh-cn/sections/360002674012-%E6%96%B0%E6%89%8B%E6%93%8D%E4%BD%9C%E6%8C%87%E5%8D%97`}*/}
                                {/*target='_blank'>{intl.get("BEGINNER_GUIDE")}</a></li>*/}
                                {/*<li><Link to={`/transactionAdvanced/${3}/${2}`}>{intl.get("TRADING_CENTER")} </Link></li>*/}

                            </ul>
                            <ul>
                                <li>{intl.get("USER_CENTER")}</li>
                                <li><a href={`https://crebe.zendesk.com/hc/${language}/requests/new`}
                                       target='_blank'>{intl.get("SUBMIT_A_REQUEST")}</a>
                                </li>
                                <li><a href={`https://crebe.zendesk.com/hc/${language}`}
                                       target='_blank'>{intl.get("HELP_CENTER")}</a></li>
                                <li><a
                                    href={language === "en-us" ? "https://crebe.zendesk.com/hc/en-us/sections/360002742131-Beginner-s-Guide" : `https://crebe.zendesk.com/hc/zh-cn/sections/360002674012-%E6%96%B0%E6%89%8B%E6%93%8D%E4%BD%9C%E6%8C%87%E5%8D%97`}
                                    target='_blank'>{intl.get("BEGINNER_GUIDE")}</a></li>
                                {/*<li><Link to="/protocol">{intl.get("USER_AGREEMENT")}</Link></li>*/}
                                {/*<li><Link to="/privacy">{intl.get("PRIVACY_POLICY")}</Link></li>*/}
                                {/*<li><Link to="">{intl.get("APPLY_TO_LIST")}</Link></li>*/}


                                {/*<li><Link to={`/transactionAdvanced/${3}/${2}`}>{intl.get("TRADING_CENTER")} </Link></li>*/}

                            </ul>
                            <ul>
                                <li>{intl.get("COOPERATIVE_INSTITUTION")}</li>
                                <li><img src={sbi} alt=""/></li>
                            </ul>
                            {/*<ul>*/}
                            {/*<li>{intl.get("OFFICAL_MEDIA")}</li>*/}
                            {/*<li>*/}
                            {/*<a href={language === "zh-cn" ? "https://t.me/crebe_CN6" : "https://t.me/crebe_EN2"}*/}
                            {/*title='telegram' target="_blank"><div><Icon*/}
                            {/*type='telegram'*/}
                            {/*color='#9696a2'*/}
                            {/*size='15'/></div> <span>Telegram</span></a>*/}
                            {/*</li>*/}
                            {/*<li className={styles.wechatWarp}><a   title='WeChat'*/}
                            {/*><div><Icon type='wechat' color='#9696a2' size='15'/> <div className={styles.wechat}>*/}
                            {/*<img src={weixin} alt=""/></div></div><span>WeChat</span></a>*/}

                            {/*</li>*/}
                            {/*<li><a href="https://www.facebook.com/crebeofficial" title='facebook'*/}
                            {/*target="_blank"><div><Icon*/}
                            {/*type='facebook1' color='#9696a2' size='15'/></div> <span>Facebook</span></a>*/}

                            {/*</li>*/}
                            {/*/!* <a to="#" title='reddit'><Icon type='reddit' color='#9696a2' size='18' /></a> *!/*/}
                            {/*<li><a href={window.currentLocale==="zh-CN"?"http://weibo.com/crebe":"https://www.reddit.com/user/crebe-official"} title={window.currentLocale==="zh-CN"?"Weibo":"Reddit"} target="_blank">*/}
                            {/*<div><Icon type={window.currentLocale==="zh-CN"?'weibo':"reddit"} color='#9696a2' size='15'/></div> <span>{window.currentLocale==="zh-CN"?"Weibo":"Reddit"}</span></a>*/}

                            {/*</li>*/}
                            {/*/!* <a to="#" title='steemit'><Icon type='steemit' color='#9696a2' size='18' /></a> *!/*/}
                            {/*<li><a href="https://medium.com/@crebe" title='medium' target="_blank"><div><Icon*/}
                            {/*type='medium'*/}
                            {/*color='#9696a2'*/}
                            {/*size='15'/></div> <span>Medium</span></a>*/}

                            {/*</li>*/}
                            {/*/!*<li><a href={`https://www.instagram.com/crebeofficial/?hl=${language}`}*!/*/}
                            {/*/!*title='instagram'*!/*/}
                            {/*/!*target="_blank"><div><Icon type='instagram' color='#9696a2' size='15'/></div> <span>Instagram</span></a>*!/*/}

                            {/*/!*</li>*!/*/}
                            {/*<li><a href="https://twitter.com/crebe8" title='twitter' target="_blank"><div><Icon*/}
                            {/*type='twitter1'*/}
                            {/*color='#9696a2'*/}
                            {/*size='15'/></div> <span>Twitter</span></a>*/}

                            {/*</li>*/}
                            {/*</ul>*/}
                        </div>
                    </div>
                    {/*<div className={styles.footerDesc} style={{width: this.props.footerDescWidth}}>*/}
                    {/*<div className={styles.crebe}>*/}
                    {/*<p>@2018 crebe global</p>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                </div>
            </footer>
        )
    }
}
