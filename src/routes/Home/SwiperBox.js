import React, { PureComponent } from 'react'
import { Link } from 'dva/router'
import Swiper from 'swiper/dist/js/swiper.js'
import images from '../../common/images'
import 'swiper/dist/css/swiper.min.css'
import styles from './SwiperBox.less';

export default class SwiperBox extends PureComponent {
  componentDidMount() {
    new Swiper('.swiper-container', {
      autoplay: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        //renderBullet: function (index, className) {
           //return '<span class="' + className + '">' + (index + 1) + '</span>';
        //},
      }
    })
  }
  render() {
    return (
      <div className={styles.panelListContainer}>
        <div className={styles.swiperBox + ' swiperBox'}>
          <div className='swiper-container'>
            <div className='swiper-wrapper'>
              <div className={styles.panelList + ' swiper-slide'}>
                <a href='https://crebe.zendesk.com/hc/zh-cn/articles/360018974911-%E4%BA%A4%E6%98%93%E5%8D%87%E7%BA%A7-%E6%8C%89%E7%BA%A7%E5%88%86%E7%BA%A2'   target="_blank">
                  <img src={window.currentLocale==="en-US"?images.banner_01_en:images.banner_01} />
                </a>
                <a href='https://crebe.zendesk.com/hc/zh-cn/articles/360019194892-crebe%E5%A4%A9%E4%BD%BF%E5%BE%81%E9%9B%86%E4%BB%A4' target="_blank">
                  <img src={window.currentLocale==="en-US"?images.banner_02_en:images.banner_02} />
                </a>
                <a href='https://crebe.zendesk.com/hc/zh-cn/articles/360018371431-%E7%AD%89%E7%BA%A7%E5%88%86%E7%BA%A2%E6%93%8D%E4%BD%9C%E6%8C%87%E5%8D%97' target="_blank">
                  <img src={window.currentLocale==="en-US"?images.banner_03_en:images.banner_03} />
                </a>
              </div>
              {/*<div className={styles.panelList + ' swiper-slide'}>*/}
                {/*<a href='https://crebe.zendesk.com/hc/zh-cn/articles/360019194872--%E5%AF%BB%E6%89%BE-%E8%B6%85%E7%BA%A7%E4%BD%93%E9%AA%8C%E5%B8%88-%E5%85%AC%E5%91%8A' target="_blank">*/}
                  {/*<img src={images.banner_04} />*/}
                {/*</a>*/}
                {/*<a href='https://crebe.zendesk.com/hc/zh-cn/categories/360001073231-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98' target="_blank">*/}
                  {/*<img src={images.banner_05} />*/}
                {/*</a>*/}
                {/*<a href='https://crebe.zendesk.com/hc/zh-cn/articles/360019194892-crebe%E5%A4%A9%E4%BD%BF%E5%BE%81%E9%9B%86%E4%BB%A4' target="_blank">*/}
                  {/*<img src={images.banner_06} />*/}
                {/*</a>*/}
              {/*</div>*/}
            </div>
            <div style={{bottom:3}} className="swiper-pagination"></div>
          </div>
        </div>
      </div>
    )
  }
}
