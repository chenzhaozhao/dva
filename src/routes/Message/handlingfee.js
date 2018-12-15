import React, { PureComponent } from 'react'
import styles from './handlingfee.less'
import { connect } from 'dva'
import intl from 'react-intl-universal'
@connect(state => ({
  home: state.home,
  handlingfee : state.handlingfee
}))
export default class Handlingfee extends PureComponent {

  componentDidMount() {
    this.fetchMarketList()
    console.log(this.props)
  }

  fetchMarketList() {
    this.props.dispatch({
      type: 'handlingfee/fetchFeeList',
      payload: {}

    })
  }
  render() {

    return (
      <div className={styles.handlingfee}>
        <div className={styles.header}>
          <h2>{intl.get("HANDLING_FEE")}</h2>
        </div>
        <div className={styles.body}>
          <div className={styles.feeRate}>
            <h5 className={styles.title}>{intl.get("TRANSACTION_FEE_RATE")}</h5>
            <div className={styles.content}>
              <p className={styles.info}>{intl.get("REGULAR_USER_TRANSACTION")}</p>
            </div>
          </div>
          <div className={styles.feeRate}>
            <h5 className={styles.title}>{intl.get("DEPOSIT_RATE")}</h5>
            <div className={styles.content}>
              <p className={styles.info}>1、{intl.get("DEPOSIT_NO_FEE")}</p>
              <p className={styles.tips}>2、{intl.get("THE_WITH_FEE_WILL_BE")}</p>
            </div>
          </div>
          <div className={styles.listContent}>
            <p className={styles.listHeader}>
              <span className={styles.tradepair}>{intl.get("COIN")}</span>
              <span className={styles.sell}>{intl.get("MINIMUM_DESPOSIT_AMOUNT")}</span>
              <span className={styles.buy}>{intl.get("WITHDRAW_FEE")}</span>
            </p>
            {
              (this.props.handlingfee.handlingfeeList || []).map((item, index) => {
                return (
                  <p className={styles.listItem} key={index}>
                    <span className={styles.tradepair}>
                      <span className={styles.simpleName}>{item.abbreviation}</span>
                      <span >{item.fullname}</span>
                    </span>
                    <span className={styles.sell}>{item.mintransfer}</span>
                    <span className={styles.buy}>{item.mintransferfee}</span>
                  </p>
                )
              })
            }
          </div>


          {/* <p className={styles.listItem}>
            <span className={styles.tradepair}>BTC/USDT</span>
            <span className={styles.sell}>0.1%</span>
            <span className={styles.buy}>0.1%</span>
          </p> */}
          {/* <div className={styles.tips}>
            <h5>提示：</h5>
            <p>1、挂单是你所下的限价单并未与当前挂单成交，并被放在买卖盘中等待成交的摆单，它增加了买卖盘的流动性。</p>
            <p>2、当其他人的摆单主动与你所下的摆单成交，你将支付挂单交易手续费（请注意当其他人的限价单与你的限价单成交，而下单时间又早于你时，你将支付吃单费）。</p>
            <p>3、吃单是你所下的限价单或市价单与当前的挂单直接成交。</p>
            <p>4、当你所下的摆单主动与其他人的摆单成交，你将支付吃单交易手续费。</p>
            <p>5、交易手续费将从您的成交总额中扣除。若成交后获得比特币资产，则支付比特币交易手续费。</p>
          </div> */}
        </div>
      </div>
    )
  }
}