import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import images from '../../common/images'

@connect(state => ({
    user: state.user
}))
export default class LevelIcon extends PureComponent {
    constructor(props) {
        super(props)
    }
    componentDidMount() {

    }
    levelIconDIsplay(i){
        let computeTimes = 0
        let iconArr = []
        var crown = parseInt(i / 64 )
        var sun =  parseInt ((i % 64) / 16 )
        var moon = parseInt((i % 16) / 4 )
        var star = parseInt ( i % 4)
    
        for (let c = 0; c < crown; c++) {
          iconArr.push(<img src={images.crown} key={computeTimes} />)
          computeTimes++;
        }
        for (let s = 0; s < sun; s++) {
          iconArr.push(<img src={images.sun} key={computeTimes} />)
          computeTimes++;
        }
        for (let m = 0; m < moon; m++) {
          iconArr.push(<img src={images.moon} key={computeTimes} />)
          computeTimes++;
        }
        for (let r = 0; r < star; r++) {
          iconArr.push(<img src={images.star} key={computeTimes} />)
          computeTimes++;
        }
        return iconArr
      }
    render() {
        return (
            <span id="levelIcon" className={styles.levelIcon}>
                {this.levelIconDIsplay(this.props.level)}
            </span>
        )
    }
}
