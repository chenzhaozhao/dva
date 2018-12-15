import React, { PureComponent } from 'react'
import SelecteLanguage from '../SelectLanguage'
import { Link } from 'dva/router'
import { Button, Dialog, Message ,Notification,Dropdown} from 'element-react'
import Icon from '../Icon'
import styles from './index.less'
import intl from "react-intl-universal";
import weixin from "../../assets/images/wexin.png";
import {tokenVerify} from "../../utils";
import {connect} from "dva";
const language = window.currentLocale.toLowerCase();
export  default  class TopCommon extends PureComponent {
    render() {
        return (
            <div className={styles.warp}>
                <a className={styles.helpCenter} href={`https://crebe.zendesk.com/hc/${language}`} target='_blank' >
                    {/* <span className={styles.helpIcon}></span>  */}
                    {intl.get('SUPPORT')}
                </a>
                <div className={styles.sns}>
                    <Dropdown style={{height:40}} menu={(
                        <Dropdown.Menu >
                            <Dropdown.Item><Icon type='telegram' color='#a4a4a4' size='14' /><a rel="nofollow" target="view_window" href="https://t.me/crebechinese1" className={styles.hoverTitle}>Telegram</a></Dropdown.Item>
                            <Dropdown.Item className={styles.item}><Icon type='wechat' color='#a4a4a4' size='14' /><a  className={styles.hoverTitle}>Wechat <div className={styles.weiImg}><img  src={weixin} alt=""/></div>
                            </a></Dropdown.Item>
                            <Dropdown.Item><Icon type='facebook1' color='#a4a4a4' size='14' /><a rel="nofollow" target="view_window" href="https://www.facebook.com/crebeofficial" className={styles.hoverTitle}>Facebook</a></Dropdown.Item>
                            <Dropdown.Item><Icon type='medium' color='#a4a4a4' size='14' /><a rel="nofollow"target="view_window"  href="https://medium.com/@crebe" className={styles.hoverTitle}>Medium</a></Dropdown.Item>
                            <Dropdown.Item><Icon type={window.currentLocale==="zh-CN"?'weibo':"reddit"} color='#a4a4a4' size='14' /><a  rel="nofollow"target="view_window"  href={window.currentLocale==="zh-CN"?"http://weibo.com/crebe":"https://www.reddit.com/user/crebe-official"} className={styles.hoverTitle}>{window.currentLocale==="zh-CN"?"Weibo":"Reddit"}</a></Dropdown.Item>
                            <Dropdown.Item><Icon type='twitter1' color='#a4a4a4' size='14' /><a rel="nofollow" target="view_window" href="https://twitter.com/crebe8" className={styles.hoverTitle}>Twitter</a></Dropdown.Item>
                        </Dropdown.Menu>
                    )}>
                     <span className={styles.snsTitle}>
                     SNS<i style={{transform:'scale(0.75) translateY(1px)'}} className="el-icon-caret-bottom el-icon--right"></i>
                     </span>
                    </Dropdown>
                </div>
                < SelecteLanguage />
                {/* <!-- 登录状态切换 --> */}
                <Link to={`/newlogin`} className={styles.login} style={{ display: !tokenVerify() ? 'inline-block' : 'none' }}><span>{intl.get('LOGIN')}</span></Link>
                <Link to={`/newlogin/2`} className={styles.green} style={{ display: !tokenVerify() ? 'inline-block' : 'none' }}><span>{intl.get('REGISTER')}</span></Link>
            </div>
        )
    }
}