import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import images from '../../common/images'
import Scrollbar from 'react-smooth-scrollbar'
import { formatTime } from '../../utils'
import { Notification } from 'element-react';
import intl from 'react-intl-universal'


@connect(state => ({
    user: state.user,
    transaction: state.transaction
}))
export default class Commission extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            commissionType: 'current',
            limitPricePanelListDisplay: false,
            limitPriceType: '全部',
            hiddenOtherTradeStatus: false,
            detailSHow: false,
            tradepair: '',
            bannerList: [
                {
                    sumentrust: '123',//委托总数量
                    volume: '1234',//已成交数量
                    date: '2018-09-10 12:12:12',
                    price: '523',//价格
                    status: '1',//用来判断当前还是历史
                    tradesumentrust: '123234',//委托总额
                    type: '1', //方向
                    tradeid: 2
                }

            ]
        }
        this.handleClick = this.handleClick.bind(this)
        let pollingFetch = null
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClick, false)
        this.fetchEntrustMarket({})
        this.fetchEntrustMarketHistory({})
        this.fetchEntrustTracsactionReco({})

        this.pollingFetch = setInterval(() => {
            this.fetchEntrustMarket({})
            this.fetchEntrustMarketHistory({})
            this.fetchEntrustTracsactionReco({})
        }, 5000)

    }

    fetchEntrustMarketHistory(params) {
        this.props.dispatch({
            type: 'transaction/fetchEntrustMarketHistory',
            payload: params
        })
    }
    fetchEntrustMarket(params) {
        this.props.dispatch({
            type: 'transaction/fetchEntrustMarket',
            payload: params
        })
    }

    fetchEntrustTracsactionReco(params) {
        this.props.dispatch({
            type: 'transaction/fetchEntrustTracsactionReco',
            payload: params
        })
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false)
        clearInterval(this.pollingFetch)
    }
    handleClick() {
        this.setState({ limitPricePanelListDisplay: false })
    }
    limitPricePanelListDisplay(e) {
        this.setState({
            limitPricePanelListDisplay: !this.state.limitPricePanelListDisplay
        })
        e.nativeEvent.stopImmediatePropagation()
    }
    detailTypeSHow(bannerBodyList, item, index) {
        item.detailSHow = !item.detailSHow
        this.setState({
            bannerBodyList: [...bannerBodyList]
        })
    }
    statusDisplay(status) {
        if (status === '1') {
            return <span>{intl.get("COMMISSIONED")}</span>
        } else if (status === '2') {
            return <span>{intl.get("REVOKED")}</span>
        } else if (status === '3') {
            return <span>{intl.get("DEAL_DONE")}</span>
        } else {
            return <span>{intl.get("PARTIAL_DEAL")}</span>
        }
    }
    revokeEntrust(item) {
        this.props.dispatch({
            type: 'transaction/fetchEntrustRevoke',
            payload: {
                entrustid: item.entrustid
            },
            callback: (data) => {
                if (data.success) {
                    // Message({
                    //     type: 'success',
                    //     message: '撤销成功',
                    //     duration: 2000
                    // });
                  if (this.props.getAllMyAsset){
                     this.props.getAllMyAsset()
                  }
                    this.fetchEntrustMarket({})
                    this.fetchEntrustMarketHistory({})
                } else {
                    // Notification({
                    //   title:intl.get('Reminder'),
                    //     type: 'error',
                    //     message: intl.get(data.msg),
                    //     duration: 2000
                    // });
                }
            }
        })
    }

    historyTradeDetial(details) {
        let res = []
        if (details && details.length > 0) {
            details.forEach((detail, idx) => {
                res.push(
                    <li className={styles.listDetailItem + ' ' + styles.list}>
                        <span className={styles.dttime}>{formatTime('yyyy-MM-dd hh:mm:ss', detail.time)}</span>
                        <span className={styles.dtprice}>{detail.price}</span>
                        <span className={styles.dtnumber}>{detail.volume}</span>
                        <span className={styles.dtamount}>{detail.tradevolumet}</span>
                        <span className={styles.dthandlingFee}>{detail.fee}</span>
                    </li>
                )
            })
        }
        return res

    }

    bannerBodyList(type) {
        let filters = ''
        if (this.props.filters) {
            filters = this.props.filters
        }

        let res = []
        let dataEntrustMarkets = []
        let dataEntrustMarketHistorys = []
        let dataEntrustTracsactionReco = []

        if (this.state.hiddenOtherTradeStatus) {
            dataEntrustMarkets = this.props.transaction.dataEntrustMarket.filter((coin) => {
                return (coin.tradepair === filters)

            })
            dataEntrustMarketHistorys = this.props.transaction.dataEntrustMarketHistory.filter((coin) => {
                return (coin.tradepair === filters)
            })
            dataEntrustTracsactionReco = this.props.transaction.dataEntrustTracsactionReco.filter((coin) => {
                return (coin.tradepair === filters)
            })
        } else {
            dataEntrustMarkets = this.props.transaction.dataEntrustMarket
            dataEntrustMarketHistorys = this.props.transaction.dataEntrustMarketHistory
            dataEntrustTracsactionReco = this.props.transaction.dataEntrustTracsactionReco
        }

        if (type === 'current') {

            dataEntrustMarkets.forEach((item, index) => {
                res.push(
                    <li className={styles.listItem} key={index}>
                        <span className={styles.entrustTime}>{formatTime('yyyy-MM-dd hh:mm:ss', item.date)}</span>
                        <span className={styles.marketType}>{item.tradepair}</span>
                        <span
                            className={item.type === '1' ? styles.buyin + " " + styles.direction : styles.sellout + " " + styles.direction}
                        >{item.type === '1' ? intl.get("BUY_IN") : intl.get("BUY_OUT")}</span>
                        <span className={styles.price}>{item.price}</span>
                        <span className={styles.amount}>{item.sumentrust}</span>
                        <span className={styles.entrustAmount}>{item.tradesumentrust}</span>
                        <span className={styles.transactioned}>{item.volume}</span>
                        <span className={styles.unTransaction}>{item.novolume}</span>
                        <span
                            className={styles.trigger}
                            onClick={(e) => this.revokeEntrust(item)}
                        >{intl.get("CANCELS")}</span>
                        {/* <span className={styles.actionType}>限价</span> */}
                    </li>
                )
            })

        } else if (type === 'history') {
            dataEntrustMarketHistorys.forEach((item, index) => {
                res.push(
                    <div key={index} className={styles.historyContainer}>
                        <li className={styles.listItem} key={index}>
                            <span className={styles.entrustTime}>{formatTime('yyyy-MM-dd hh:mm:ss', item.date)}</span>
                            <span className={styles.marketType}>{item.tradepair}</span>
                            <span
                                className={item.type === '1' ? styles.buyin + " " + styles.direction : styles.sellout + " " + styles.direction}
                            >{item.type === '1' ? intl.get("BUY_IN") : intl.get("BUY_OUT")}</span>
                            <span className={styles.price}>{item.price}</span>
                            <span className={styles.amount}>{item.sumentrust}</span>
                            <span className={styles.entrustAmount}>{item.tradevolume}</span>
                            <span className={styles.transactioned}>{item.avgvolume}</span>
                            <span className={styles.volumetotal}>{item.volumetotal}</span>
                            <span className={styles.unTransaction}>{this.statusDisplay(item.status)}</span>
                            {/*<span
                                className={styles.trigger}
                                onClick={(e) => this.detailTypeSHow(this.props.transaction.dataEntrustMarketHistory, item, index)}
                            >详情
                                <span className={item.detailSHow ? styles.rotate : styles.rotate1}>
                                    <Icon type='xialajiantouxiangxia' color='#4ac8b1' size='14' />
                                </span>
                            </span>*/}
                        </li>
                        <ul className={item.detailSHow ? styles.detailList + ' ' + styles.display : styles.detailList}>
                            <li className={styles.listHeaderItem + ' ' + styles.list}>
                                <span className={styles.dttime}>{intl.get("DATE")}</span>
                                <span className={styles.dtprice}>{intl.get("PRICE")}</span>
                                <span className={styles.dtnumber}>{intl.get("AMOUNT")}</span>
                                <span className={styles.dtamount}>{intl.get("TURNOVER")}</span>
                                <span className={styles.dthandlingFee}>{intl.get("FEE")}</span>
                            </li>
                            {
                                this.historyTradeDetial(item.tradedata)
                            }
                        </ul>
                    </div>
                )
            })
        } else if (type === 'transactionReco') {
            dataEntrustTracsactionReco.forEach((item, index) => {
                res.push(
                    <li className={styles.listItem + " " + styles.deal} key={index}>
                        <span className={styles.entrustTime}>{formatTime('yyyy-MM-dd hh:mm:ss', item.date)}</span>
                        <span className={styles.marketType}>{item.tradepair}</span>
                        <span
                            className={item.type === '1' ? styles.buyin + " " + styles.direction : styles.sellout + " " + styles.direction}
                        >{item.type === '1' ? intl.get("BUY_IN") : intl.get("BUY_OUT")}</span>
                        <span className={styles.price}>{item.price}</span>
                        <span className={styles.amount}>{item.tradevolume}</span>
                        <span className={styles.entrustAmount}>{item.sumentrust}</span>
                        <span className={styles.handlingFee}>{item.fee}</span>
                        {/* <span className={styles.actionType}>限价</span> */}
                    </li>
                )
            })

        }

        return res
    }

    listHeaderDisplay(type) {
        if (type === 'current') {
            return (
                <h5 className={styles.listHeader}>
                    <span className={styles.entrustTime}>{intl.get("DATE")}</span>
                    <span className={styles.marketType}>{intl.get("PAIR")}</span>
                    <span className={styles.direction}>{intl.get("DIRECTION")}</span>
                    <span className={styles.price}>{intl.get("PRICE")}</span>
                    <span className={styles.amount}>{intl.get("AMOUNT")}</span>
                    <span className={styles.entrustAmount}>{intl.get("TOTAL")}</span>
                    <span className={styles.transactioned}>{intl.get("DEAL_DONE")}</span>
                    <span className={styles.unTransaction}>{intl.get("UNFILLED")}</span>
                    <span className={styles.trigger}>{intl.get("ASSER_OPERATION")}</span>
                </h5>
            )
        } else if (type === 'history') {
            return (
                <h5 className={styles.listHeader}>
                    <span className={styles.entrustTime}>{intl.get("DATE")}</span>
                    <span className={styles.marketType}>{intl.get("PAIR")}</span>
                    <span className={styles.direction}>{intl.get("DIRECTION")}</span>
                    <span className={styles.price}>{intl.get("PRICE")}</span>
                    <span className={styles.amount}>{intl.get("AMMOUNT_OF_COMMISSION")}</span>
                    <span className={styles.entrustAmount}>{intl.get("DEAL_DONE")}</span>
                    <span className={styles.transactioned}>{intl.get("AVERAGE_PRICE")}</span>
                    <span className={styles.volumetotal}>{intl.get("TURNOVER")}</span>
                    <span className={styles.unTransaction}>{intl.get("STATUS")}</span>
                </h5>
            )
        } else if (type === 'transactionReco') {
            return (
                <h5 className={styles.listHeader + " " + styles.deal}>
                    <span className={styles.entrustTime}>{intl.get("DATE")}</span>
                    <span className={styles.marketType}>{intl.get("PAIR")}</span>
                    <span className={styles.direction}>{intl.get("DIRECTION")}</span>
                    <span className={styles.price}>{intl.get("PRICE")}</span>
                    <span className={styles.amount}>{intl.get("AMOUNT")}</span>
                    <span className={styles.entrustAmount}>{intl.get("TURNOVER")}</span>
                    <span className={styles.handlingFee}>{intl.get("FEE")}</span>
                </h5>
            )
        }
    }

    hiddenOtherTpair() {

        this.setState({
            hiddenOtherTradeStatus: !this.state.hiddenOtherTradeStatus,
            tradepair: this.state.tradepair.trim() ? '' : 'QQ/USDT'
        })
    }
    render() {
        return (
            <div id="levelIcon"
                className={styles.commission}
            >
                <div className={styles.bannerHeader}>
                    <span
                        className={this.state.commissionType === 'current' ? styles.actived : ''}
                        onClick={() => this.setState({ commissionType: 'current' })
                        }
                    >{intl.get("CURRENT_COMMOSSION")}</span>
                    <span
                        className={this.state.commissionType === 'history' ? styles.actived : ''}
                        onClick={() => this.setState({ commissionType: 'history' })
                        }
                    >{intl.get("HISTIRIAL_COMMISSION_RECORD")}</span>
                    <span
                        className={this.state.commissionType === 'transactionReco' ? styles.actived : ''}
                        onClick={() => this.setState({ commissionType: 'transactionReco' })
                        }
                    >{intl.get("TRANSACTION_RECORD")}</span>
                    <span
                        className={styles.hiddenOtherTrade}
                        onClick={() => this.hiddenOtherTpair()}
                    >
                        <img
                            src={this.state.hiddenOtherTradeStatus ? images.checkbox_select : images.checkbox_default}

                        /> {intl.get("HIDE_OTHER_PAIRS")}
                                </span>
                </div>
                {
                    this.listHeaderDisplay(this.state.commissionType)
                }

                {/* <span className={styles.category}>类型</span> */}
                {/* <span className={styles.transactionRate}>成交率%</span>
                    <span className={styles.sumMoney}>金额</span> */}

                {/* <span className={styles.selectAccuracy}>
                        <span onClick={(e) => this.limitPricePanelListDisplay(e)} className={styles.selectedItem}>
                            {this.state.limitPriceType}
                            <Icon type='xialajiantouxiangxia' color='#6f6c99' />
                        </span>
                        <ul className={this.state.limitPricePanelListDisplay ? styles.display : ''} >
                            <li
                                onClick={() => this.setState({ limitPricePanelListDisplay: false, limitPriceType: '全部' })}
                                className={styles.selectItem}
                            >全部</li>
                            <li
                                onClick={() => this.setState({ limitPricePanelListDisplay: false, limitPriceType: '限价' })}
                                className={styles.selectItem}
                            >限价</li>
                            <li
                                onClick={() => this.setState({ limitPricePanelListDisplay: false, limitPriceType: '止损止盈' })}
                                className={styles.selectItem}
                            >止损止盈</li>
                        </ul>
                    </span> */}

                <div className={styles.bottomBannerContent} style={{}}>
                    <Scrollbar
                        damping={0.1}
                        thumbMinSize={2}
                        renderByPixels={true}
                        alwaysShowTracks={true}
                        continuousScrolling={true}
                    >
                        <ul className={styles.bannerBody}>
                            {this.bannerBodyList(this.state.commissionType)}
                        </ul>
                    </Scrollbar>
                </div>
            </div>
        )
    }
}
