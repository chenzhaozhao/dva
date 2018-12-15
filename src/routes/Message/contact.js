import React, { PureComponent } from 'react'
import { Link } from 'dva/router'
import Icon from '../../components/Icon'
import weChat from '../../assets/images/wexin.png'
import styles from './contact.less'
import intl from 'react-intl-universal'
export default class Contact extends PureComponent {
  render() {

    return (
      <div className={styles.contact}>
        <div className={styles.header}>
          <h2>{intl.get("CONTACT_US")}</h2>
          <div className={styles.content}>
            <h3>{intl.get("GOT_A_QUESTION")}？</h3>
            <p>{intl.get("PLEASE_CHECK_OFFICE")}</p>
            <a
              className={styles.helpDocument}
              target='_blank' href='https://crebe.zendesk.com/hc/zh-cn/categories/360001073231-%E5%B8%AE%E5%8A%A9%E4%B8%AD%E5%BF%83'
              >
                {intl.get("VIEW SUPPORT DOCUMENTATION")}
            </a>
            <p>{intl.get("STILL_CAN_FIND_WHAT_YOU")} <a target='_blank' href='https://crebe.zendesk.com/hc/zh-cn/requests/new'>{intl.get("SUBMIT_A_REQUESTS")}</a></p>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.social}>
            <div className={styles.content}>
              <p className={styles.tip}>{intl.get("FOR_NON_ACCOUNT_RELATED")}</p>
              <p className={styles.icons}>
                <span><a href="https://t.me/crebechinese1" title='telegram'><Icon type='telegram' color='#454545' size='42' /></a></span>
                   <span className={styles.weChart}><a  title='weChat'><Icon type='wechat' color='#454545' size='42' /></a>
                       <div className={styles.weWarp}><img src={weChat} alt=""/></div></span>
                <span><a href="https://www.facebook.com/crebeofficial" title='facebook'><Icon type='facebook1' color='#454545' size='42' /></a></span>
                {/* <span><a href="#" title='twitter'><Icon type='twitter1' color='#454545' size='42' /></a></span> */}
                {/* <span><a href="#" title='reddit'><Icon type='reddit' color='#454545' size='42' /></a></span> */}
                <span><a href="http://weibo.com/crebe" title='weibo'><Icon type='weibo' color='#454545' size='42' /></a></span>
                {/* <span><a href="#" title='steemit'><Icon type='steemit' color='#454545' size='42' /></a></span> */}
                <span><a href="https://medium.com/@crebe" title='medium'><Icon type='medium' color='#454545' size='42' /></a></span>
                <span><a href="https://www.instagram.com/crebeofficial/?hl=zh-cn" title='instagram'><Icon type='instagram' color='#454545' size='42' /></a></span>
                <span><a href="https://twitter.com/crebe8" title='twitter'><Icon type='twitter1' color='#454545' size='42' /></a></span>
              </p>
            </div>
          </div>
          <div className={styles.telegraphs}>
            <div className={styles.title}>
              <span className={styles.iconContainer}>
                <Icon type='telegram' color='#fff' size='40' />
              </span>
              <p>crebe{intl.get("Telegram")}</p>
            </div>
            <div className={styles.contents}>

              <div className={styles.section}>
                <p className={styles.name}>Chinese</p>
                <div className={styles.panel}>
                  <a href='https://t.me/crebe_CN6' target="view_window">
                    <span className={styles.tipTitle}>中文1</span>
                    <span>https://t.me/crebe_CN6</span>
                  </a>
                </div>
                {/*<div className={styles.panel}>*/}
                  {/*<a href='https://t.me/crebechinese2' target="view_window">*/}
                    {/*<span className={styles.tipTitle}>中文2</span>*/}
                    {/*<span>https://t.me/crebechinese2</span>*/}
                  {/*</a>*/}
                {/*</div>*/}
              </div>

              <div className={styles.section}>
                <p className={styles.name}>English</p>
                <div className={styles.panel}>
                  <a href='https://t.me/crebe_EN2' target="view_window">
                    <span className={styles.tipTitle}>English1</span>
                    <span>https://t.me/crebe_EN2</span>
                  </a>
                </div>
                {/*<div className={styles.panel}>*/}
                  {/*<a href='https://t.me/crebeEnglish2' target="view_window">*/}
                    {/*<span className={styles.tipTitle}>English2</span>*/}
                    {/*<span>https://t.me/crebeEnglish2</span>*/}
                  {/*</a>*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <p className={styles.info}>{intl.get("WARRNING")}</p>
          <p className={styles.content}>
              {intl.get("SUPPORT_CREBE_COM")}
          </p>
        </div>

      </div>
    )
  }
}
