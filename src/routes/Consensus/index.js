import React, { PureComponent } from 'react'
import { Link } from 'dva/router'
import Icon from '../../components/Icon'
import styles from './index.less'
import intl from 'react-intl-universal'
import  consensus_top from '../../assets/images/consensus_top.png'
import  consensus_1 from '../../assets/images/consensus_1.png'
import  consensus_2 from '../../assets/images/consensus_2.png'
import  consensus_3 from '../../assets/images/consensus_3.png'
import  consensus_4 from '../../assets/images/consensus_4.png'
import  consensus_top_en from '../../assets/images/consensus_top_en.png'
import  consensus_1_en from '../../assets/images/consensus_1_en.png'
import  consensus_2_en from '../../assets/images/consensus_2_en.png'
import  consensus_3_en from '../../assets/images/consensus_3_en.png'
import  consensus_4_en from '../../assets/images/consensus_4_en.png'
import images from "../../common/images";

export default class Consensus extends PureComponent {
    render() {

        return (
            <div className={styles.consensus}>
                <div className={styles.topPanel} style={{background:`url(${window.currentLocale==="en-US"?consensus_top_en:consensus_top}) center no-repeat`}}/>
                <div className={styles.profitPanel} style={{background:`url(${window.currentLocale==="en-US"?consensus_1_en:consensus_1}) center no-repeat`}}>
                    <p className={styles.panelTitle}>{intl.get("LEVEL_USERS_CAN_SHARE_MILLION")}</p>
                </div>
                <div className={styles.levelPanel} style={{background:`url(${window.currentLocale==="en-US"?consensus_2_en:consensus_2}) center no-repeat`}}>
                    <p className={styles.socialTitle}>{intl.get("THE_HIGHER_THE_LEVELS")}</p>
                </div>
                <div className={styles.peoplePanel} style={{background:`url(${window.currentLocale==="en-US"?consensus_3_en:consensus_3}) center no-repeat`}}>
                    <p className={styles.panelTitle}>{intl.get("EVERY_IS_EQUAL_GETTING")}</p>
                </div>
                <div className={styles.socialPanel} style={{background:`url(${window.currentLocale==="en-US"?consensus_4_en:consensus_4}) center no-repeat`}}>
                    <p className={styles.socialTitle}>{intl.get("SOCIAL_DIVISENDS_EARNING")}</p>
                </div>
            </div>
        )
    }
}