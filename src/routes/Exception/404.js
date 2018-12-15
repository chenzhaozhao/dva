import React from 'react';
import { Link } from 'dva/router';
import styles from './404.less'

export default () => (
  <div className={styles.fullBg} >
    <div className={styles.bg_image}>
      <p className={styles.tips}>对不起，您访问的页面找不到了~</p>
      <a href="/"><button>回到首页</button></a>
    </div>
      
      
  </div>
)
