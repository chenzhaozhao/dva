import React, { PureComponent } from 'react'
import styles from './index.less'
import images from '../../common/images'

export default class Avatar extends PureComponent {
    avatarTypeDisplay(level) {
        level = parseInt(level,10)
        if (level >= 0 && level < 4) {
            return (
                <img src={images.avatar_1} alt="" />
            )
        } else if (level >= 4 && level < 16) {
            return (
                <img src={images.avatar_2} alt="" />
            )

        } else if (level >= 16 && level < 64) {
            return (
                <img src={images.avatar_3} alt="" />
            )
        } else if (level >= 64) {
            return (
                <img src={images.avatar_4} alt="" />
            )
        }
    }
    render() {
        return (
            <span id="levelIcon" 
                className={styles.avatarContainer} 
                style={{
                    width:this.props.avatarSize ? `${this.props.avatarSize}px`: '32px',
                    height:this.props.avatarSize ? `${this.props.avatarSize}px`: '32px'
                }}
            >
                {this.avatarTypeDisplay(this.props.level)}
            </span>
        )
    }
}
