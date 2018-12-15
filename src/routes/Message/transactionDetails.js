import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Link, routerRedux } from 'dva/router'
import styles from './transactionDetails.less'
import SelecteLanguage from '../../components/SelectLanguage'
import Icon from '../../components/Icon'
import { TVChartContainer } from '../../components/TVChartContainer'
import { tokenVerify, logout, formatTime } from '../../utils'
import { socket } from '../../services/socket'
import { WS_URL as socketUrl } from '../../common/global'
import intl from 'react-intl-universal'
@connect(state => ({
    user: state.user,
    transaction: state.transaction,
    home: state.home
}))
export default class TransactionDetails extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {

            transactionDecreaseList: [],
            transactionIncreaseList: [],
            coinid: '',
            paycoinid: '',
            cointype: '',
            paycointype: '',
            coinExchangeRate: '',
            paycoinExchangeRate: '',
            currentFilterTradepair: '',
            firstProps: true
        }
    }

    quotationDetailSocket = undefined
    requestStatus = {
        status : true
    }
    componentWillMount() {
        this.setState({
            cointype: (this.props.match.params.cointype ? this.props.match.params.cointype : 'BTC'),
            paycointype: (this.props.match.params.paycointype ? this.props.match.params.paycointype : 'USDT'),
            coinid: (this.props.match.params.coinid ? this.props.match.params.coinid : 3),
            paycoinid: (this.props.match.params.paycoinid ? this.props.match.params.paycoinid : 2)
        })
    }
    componentWillReceiveProps() {
        if (this.state.firstProps && this.props.home.currentTradepair.nowprice) {
            this.setState({
                entrustBuyPriceLimitPrice: (this.props.home.currentTradepair.nowprice || '').split('/')[0],
                entrustSellPriceLimitPrice: (this.props.home.currentTradepair.nowprice || '').split('/')[0],
                firstProps: false
            })
        }

    }
    componentDidMount() {
        const _this = this
        let coinid = this.props.match.params.coinid ? this.props.match.params.coinid : 3
        let paycoinid = this.props.match.params.paycoinid ? this.props.match.params.paycoinid : 2
        this.props.dispatch({
            type: 'transaction/fetchCommissionList',
            payload: {
                coinid: coinid,
                paycoinid: paycoinid
            }
        })
        let tradepairId = coinid + '_' + paycoinid
        this.setState({
            tradepairId: tradepairId
        })
        this.requestStatus.status = true
        this.quotationDetailSocket = socket(data => {
            this.props.dispatch({
                type: 'transaction/webSocket',
                payload: data
            })
        }, {
                url: socketUrl,
                params: {
                    "type": 'quotation_' + tradepairId,
                    "ctoin": "add"
                },
                requestStatus : _this.requestStatus
            });
    }

    componentWillUnmount(){
        this.requestStatus.status = false
        if (this.quotationDetailSocket) {
            this.quotationDetailSocket.close()
        }
        
    }

    transactionSellListDisplay() {
        let res = []

        this.props.transaction.transactionDetailListSell.forEach((item, index) => {
            let totalAmount = parseFloat(item.price) * parseFloat(item.volume)
            totalAmount = totalAmount > 1 ? totalAmount.toFixed(2) : totalAmount.toFixed(6)

            res.push(
                <li
                    className={styles.transactionItem} key={index}
                >
                    <span className={styles.title  + ' '+ styles.sell}>{intl.get("SELL")}{index + 1}</span>
                    <span className={styles.transactionPrice}>{item.price}</span>
                    <span className={styles.transactionQuantity}>{item.volume}</span>
                    <span className={styles.transactionAmount}>
                        {totalAmount}
                    </span>
                </li>
            )
        })
        return res
    }

    transactionBuyListDisplay() {
        let res = []
        this.props.transaction.commissionListBuy.forEach((item, index) => {
            let totalAmount = parseFloat(item.price) * parseFloat(item.volume)
            totalAmount = totalAmount > 1 ? totalAmount.toFixed(2) : totalAmount.toFixed(6)
            res.push(
                <li
                    className={styles.transactionItem} key={index}
                >
                    <span className={styles.title}>{intl.get("BUYSS")}{index + 1}</span>
                    <span className={styles.transactionPrice}>{item.price}</span>
                    <span className={styles.transactionQuantity}>{item.volume}</span>
                    <span className={styles.transactionAmount}>
                        {totalAmount}
                    </span>
                </li>
            )
        })
        return res
    }

    render() {
        return (
            <div className={styles.transactionDetails}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <p className={styles.title}>
                            {this.state.cointype}/{this.state.paycointype} {intl.get("OREDR")}
                        </p>
                    </div>
                    <div className={styles.totalSections}>
                        <div className={styles.section}>
                            <div className={styles.buyList}>{intl.get("BUYS")}</div>
                            <div className={styles.dataTitle}>
                                <span className={styles.title}>&nbsp;</span>
                                <span className={styles.transactionPrice}>{intl.get("Exchange_Buy_Price")}({this.state.paycointype})</span>
                                <span className={styles.transactionQuantity}>{intl.get("Exchange_Buy_Amount")}</span>
                                <span className={styles.transactionAmount}>{intl.get("TOTAL")}({this.state.paycointype })</span>
                            </div>
                            <div className={styles.dataSectionPanel}>
                                <ul className={styles.transactionInfo}>
                                    {this.transactionBuyListDisplay()}
                                </ul>
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.sellList}>{intl.get("SELLING")}</div>
                            <div className={styles.dataTitle}>
                                <span className={styles.title}>&nbsp;</span>
                                <span className={styles.transactionPrice}>{intl.get("Exchange_Sell_Price")}({this.state.paycointype})</span>
                                <span className={styles.transactionQuantity}>{intl.get("Exchange_Sell_Amount")}</span>
                                <span className={styles.transactionAmount}>{intl.get("TOTAL")}({this.state.paycointype})</span>
                            </div>
                            <div className={styles.dataSectionPanel}>

                                <ul className={styles.transactionInfo}>
                                    {this.transactionSellListDisplay()}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

}
