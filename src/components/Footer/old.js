import React, { PureComponent, createElement } from 'react'
import { connect } from 'dva'
//import iconStyles from '../../assets/css/iconfont/iconfont.css'
import styles from './index.less'
import {Link} from 'dva/router'
import Icon from '../Icon'

@connect(state => ({}))
export default class Footer extends PureComponent {
  constructor(props){
    super(props)
  }
  render() {
    //const { links, copyright } = this.props
    // debugger
    return (
      <footer id="footer" className={styles.footer} style={{minWidth : this.props.footerWidth}}>
        <div className={styles.footerContainer} style={{width : this.props.footerContainerWidth}}>
          <div className={styles.footerInfo} style={{width : this.props.footerInfoWidth}}>
            <nav className={styles.bottomBanner}>
              <Link to="/contact" >联系我们</Link>
              <Link to="/statement" >法律声明</Link>
              <Link to="/privacy" >隐私政策</Link>
              <Link to="/protocol" >用户协议</Link>
              <Link to="/handlingfee" >手续费</Link>
              {/* <Link to="#" >免费上币</Link> */}

              <a href="https://crebe.zendesk.com/hc/zh-cn/categories/360001116992-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83" target='_blank' >公告中心</a>
              <Link to="/consensus">社区共识</Link>
            </nav>
            <nav className={styles.iconBanner}>
              <a href="https://t.me/crebechinese1" title='telegram'><Icon type='telegram' color='#6f6c99' size='18' /></a>
              <a href="https://www.facebook.com/crebeofficial" title='facebook'><Icon type='facebook1' color='#6f6c99' size='18' /></a>
              {/* <a to="#" title='reddit'><Icon type='reddit' color='#6f6c99' size='18' /></a> */}
              <a href="http://weibo.com/crebe" title='weibo'><Icon type='weibo' color='#6f6c99' size='18' /></a>
              {/* <a to="#" title='steemit'><Icon type='steemit' color='#6f6c99' size='18' /></a> */}
              <a href="https://medium.com/@crebe" title='medium'><Icon type='medium' color='#6f6c99' size='18' /></a>
              <a href="https://www.instagram.com/crebeofficial/?hl=zh-cn"  title='instagram'><Icon type='instagram' color='#6f6c99' size='18' /></a>
              <a href="https://twitter.com/crebe8" title='twitter'><Icon type='twitter1' color='#6f6c99' size='18' /></a>

            </nav>
          </div>
          <div className={styles.footerDesc} style={{width : this.props.footerDescWidth }}>
            <span className={styles.copyright}>Copyright © 2018 crebe</span>
            {/* <span className={styles.footerStatistics}>
                                <span className={styles.time}>2018-08-10 18:23:49</span>
                                <span className={styles.heading} style={{marginLeft : '10px'}}>24H成交额:</span>
                                <span className={styles.statisticsValue}>344,154.39</span>
                                <span className={styles.heading}>QQ / </span>
                                <span className={styles.statisticsValue}>54,848.27</span>
                                <span className={styles.heading}>BTC / </span>
                                <span className={styles.statisticsValue}>93,244.89</span>
                                <span className={styles.heading}>ETH / </span>
                                <span className={styles.statisticsValue}>736,588,442.21</span>
                                <span className={styles.heading}>USDT</span>
                            </span> */}
          </div>
        </div>

      </footer>
    )
  }
}
