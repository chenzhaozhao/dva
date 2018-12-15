// 左侧个人信息
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import images from '../../../common/images'
import Avatar from '../../../components/Avatar'
import LevelIcon from '../../../components/LevelIcon'
import { vipSpeedup} from '../../../utils'
import VipType from "../../../components/VipType"

@connect(state => ({
  user: state.user
}))
export default class Account extends PureComponent {
  state = {
    avatarUrl: '',
    avatarType : 1,
    vipType : 1
  }

  avatarDisplay(type){
    if (type === 1) {
      return (
        <img src={images.avatar_1} />
      )
    } else if (type === 2) {
      return (
        <img src={images.avatar_2} />
      )
    } else if (type === 3) {
      return (
        <img src={images.avatar_3} />
      )
    } else {
      return (
        <img src={images.avatar_4} />
      )
    }
  }

  render() {
    const { user } = this.props
    
    return (
      <div className={styles.account}>
        <div className={styles.avatarUploader}>
          <Avatar avatarSize={96} level={user.level} />
        </div>
        <div className={styles.info}>
          <div className={styles.userName}>
            <span>{user.nickname}</span> <VipType vipType={this.props.user.viptype} />
          </div>
          <div className={styles.levelINfo}>
            <span style={{position: 'relative'}} className={styles.level}>
              <img className={styles.level_bg} src={images.level} />
              <span className={styles.levelNumber}>{user.level}</span>
            </span>
            <LevelIcon level={user.level} />
          </div>
          {/* <p className={styles.upgradeSpeed}>{vipSpeedup(this.props.user.viptype)}倍加速中</p> */}
        </div>
      </div>
    )
  }
}
