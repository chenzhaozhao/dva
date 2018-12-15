import React, { PureComponent, createElement } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import Icon from '../Icon'

@connect(state => ({}))
export default class Popups extends PureComponent {
    constructor(props){
        super(props)
    }
    
    render() {
        return (
            <div className={styles.popUps}>
                <div className={styles.popMask}></div>
                <div className={styles.popContainer}>
                    <div className={styles.header}>
                        <span className={styles.title}>{this.props.title}</span>
                        <Icon type='guanbi' color='#7367a1' />
                    </div>
                    <div className={styles.popBody}>
                        {this.props.body}
                    </div>
                </div>
            </div>
        )
    }
}
