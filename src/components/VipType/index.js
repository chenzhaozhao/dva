import React, { PureComponent } from 'react'
import styles from './index.less'
import images from '../../common/images'

export default class VipType extends PureComponent {
    vipTypeDisplay(vipType) {
        if (vipType === 2) {
            return (
                <img src={images.vip_icon} alt="" />
            )
        } else if (vipType === 3) {
            return (
                <img src={images.vipY_icon} alt="" />
            )

        } else if (vipType === 4) {
            return (
                <img src={images.vipS_icon} alt="" />
            )
        }
    }
    render() {
        return (
            <span id="viptype" 
                className={styles.vipType} 
            >
                {this.vipTypeDisplay(this.props.vipType)}
            </span>
        )
    }
}
