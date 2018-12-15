import React, { PureComponent, createElement } from 'react'
import { connect } from 'dva'
//import iconStyles from '../../assets/css/iconfont/iconfont.css'
import styles from './NewIndex.less'
import logo_01 from '../../assets/images/logo_2.png'
import {Link} from 'dva/router'
import Icon from '../Icon'

@connect(state => ({}))
export default class NewFooter extends PureComponent {
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
            <div className={styles.crebe}>
              <img src={logo_01} alt=""/>
              <p style={{margin:'12px 0'}} >让天下没有难做的交易</p>
              <p>@2018 crebe All rights reserved</p>
            </div>
            <div>
              <ul>
                <li>用户中心</li>
                <li><a href="https://crebe.zendesk.com/hc/zh-cn" target='_blank'>帮助中心</a></li>
                <li><a href="https://crebe.zendesk.com/hc/zh-cn/requests/new" target='_blank' >提交请求</a> </li>
                <li><a href="https://crebe.zendesk.com/hc/zh-cn/sections/360002674012-%E6%96%B0%E6%89%8B%E6%93%8D%E4%BD%9C%E6%8C%87%E5%8D%97" target='_blank'>新手指南</a></li>
              </ul>
              <ul>
                <li>条款说明</li>
                <li><Link to="/privacy" >隐私政策</Link></li>
                <li><Link to="/protocol" >用户协议</Link></li>
                <li><Link to="/handlingfee" >手续费</Link></li>
              </ul>
              <ul>
                <li>关于我们</li>
                <li><Link to="/contact" >联系我们</Link></li>
                <li><a target='_blank' href="https://crebe.zendesk.com/hc/zh-cn/categories/360001116992-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83" >公告中心</a></li>
                <li><Link to="/consensus">社区共识</Link></li>
              </ul>
              <ul>
                <li>商务合作</li>
                <li>商务合作：business@crebe.com</li>
                <li>市场合作：market@crebe.com</li>
                <li>客服服务：support@crebe.com</li>
              </ul>
            </div>
          </div>
          <div className={styles.footerDesc} style={{width : this.props.footerDescWidth }}>
            <nav className={styles.icon} style={{textAlign:'center'}}>
            <a href="https://t.me/crebechinese1" title='telegram'><Icon type='telegram' color='#9696a2' size='18' /></a>
            <a href="https://www.facebook.com/crebeofficial" title='facebook'><Icon type='facebook1' color='#9696a2' size='18' /></a>
            {/* <a to="#" title='reddit'><Icon type='reddit' color='#9696a2' size='18' /></a> */}
            <a href="http://weibo.com/crebe" title='weibo'><Icon type='weibo' color='#9696a2' size='18' /></a>
            {/* <a to="#" title='steemit'><Icon type='steemit' color='#9696a2' size='18' /></a> */}
            <a href="https://medium.com/@crebe" title='medium'><Icon type='medium' color='#9696a2' size='18' /></a>
            <a href="https://www.instagram.com/crebeofficial/?hl=zh-cn"  title='instagram'><Icon type='instagram' color='#9696a2' size='18' /></a>
            <a href="https://twitter.com/crebe8" title='twitter'><Icon type='twitter1' color='#9696a2' size='18' /></a>

            </nav>
          </div>
        </div>

      </footer>
    )
  }
}
