import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import styles from './index.less'
import images from '../../common/images'
import { WS_URL as socketUrl } from '../../common/global'
import logo from '../../assets/images/logo.png'
import Icon from '../../components/Icon'
import { TVChartContainer } from '../../components/TVChartContainer'
import Scrollbar from 'react-smooth-scrollbar'
import { tokenVerify,getDigits } from '../../utils'
import Header from '../../components/Header'
import Commission from '../../components/Commission'
import { socket } from '../../services/socket'
import { Message } from 'element-react'
import intl from 'react-intl-universal'

@connect(state => ({
    user: state.user,
    transaction: state.transaction,
    home: state.home
}))
export default class Index extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            loginStatus: true,
            inputEmptyLimit1: true,
            inputEmptyLimit2: true,
            inputEmptyLimit3: true,
            inputEmptyLimit4: true,
            inputEmptyMarket1: true,
            inputEmptyMarket2: true,
            vipType: 0,
            precision: 2,
            precisionText: '两位小数',
            coinTotalAmountBuy: 0,
            coinTotalAmountSell: 0,
            coinSelectPanel: false,
            sortType: 'riseFall',
            precisionModelDisplay: false,
            dataSectionPanelAll: true,
            decreaseDataSectionPanelAll: true,
            increaseDataSectionPanelAll: true,
            dataTypePanel: 0,
            selectedCoinType: 0,
            limitPriceType: '全部',
            commissionType: 'current',
            chartPanelDataTypeDisplay: 0,
            limitPricePanelListDisplay: false,
            entrustBuyPriceLimitPrice: '',
            entrustBuyAmountLimitPrice: '',
            entrustSellPriceLimitPrice: '',
            entrustSellAmountLimitPrice: '',
            entrustBuyPriceMarketPrice: '',
            entrustBuyAmountMarketPrice: '',
            entrustSellPriceMarketPrice: '',
            entrustSellAmountMarketPrice: '',
            entrustBuyPriceTPSL: '',//止盈止损委托购买价
            entrustBuyAmountTPSL: '',
            entrustSellPriceTPSL: '',
            entrustSellAmountTPSL: '',
            commissionEntrustBuyPriceTPSL: '',//止盈止损的委托价
            commissionEntrustSellPriceTPSL: '',//止盈止损的委托价
            limitPriceBuyPercent: '25%',
            limitPriceSellPercent: '25%',
            marketPriceBuyPercent: '25%',
            marketPriceSellPercent: '25%',
            takeProfitStopLossBuyPercent: '25%',
            takeProfitStopLossSellPercent: '25%',
            totalAnalysisValue: 0.071855,
            tradeCoupleItem: 'QQ',
            searchContent: '',
            selectSearchContent: '',
            tradepairId: null,
            transactionDecreaseList: [],
            transactionIncreaseList: [],
            sortShowList: [],
            coinid: '',
            paycoinid: '',
            cointype: '',
            paycointype: '',
            currentFilterTradepair: ''
        }
        this.toggleModal = this.toggleModal.bind(this)
    }

    coinSelectPanelShow(e) {
        this.setState({
            selectSearchContent: e.target.value
        })
    }
    toggleModal() {
        this.setState({
            precisionModelDisplay: false,
            limitPricePanelListDisplay: false,
            coinSelectPanel: false
        })
    }

    fetchFavorites() {
        const favorite = localStorage.getItem('_favorite_')
        this.props.dispatch({
            type: 'home/fetchFavorites',
            payload: {
                tradepairids: favorite || ''
            }
        })
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.location !== this.props.location) {
    //         const coinid = nextProps.match.params.coinid ? nextProps.match.params.coinid : 1
    //         const paycoinid = nextProps.match.params.paycoinid ? nextProps.match.params.paycoinid : 3
    //         debugger
    //         window.location.replace(`${window.location.origin}/#/transaction/${coinid}/${paycoinid}`)
    //         // console.log(nextProps)
    //     }
    // }

    componentWillMount() {
        setTimeout(()=>{
            this.setState({
                cointype: (this.props.match.params.cointype ? this.props.match.params.cointype : 'BTC'),
                paycointype: (this.props.match.params.paycointype ? this.props.match.params.paycointype : 'USDT'),
                coinid: (this.props.match.params.coinid ? this.props.match.params.coinid : 3),
                paycoinid: (this.props.match.params.paycoinid ? this.props.match.params.paycoinid : 2)
            })
        },100)

    }

    componentWillReceiveProps() {
        if (this.props.home.currentTradepair.nowprice && !this.state.entrustBuyPriceLimitPrice && !this.state.entrustSellPriceLimitPrice) {
            this.setState({
                entrustBuyPriceLimitPrice: (this.props.home.currentTradepair.nowprice || '').split('/')[0],
                entrustSellPriceLimitPrice: (this.props.home.currentTradepair.nowprice || '').split('/')[0]
            })
        }

    }

    componentDidMount() {
        document.addEventListener('click', this.toggleModal)
        console.log('aaaaaaaaa', (this.props.home.currentTradepair.nowprice || '').split('/')[0])

        let coinid = this.props.match.params.coinid ? this.props.match.params.coinid : 3
        let paycoinid = this.props.match.params.paycoinid ? this.props.match.params.paycoinid : 2
        let tradepairId = coinid + '_' + paycoinid
        // console.log(tradepairId,tradepairId,tradepairId)
        this.setState({
            coinid,
            paycoinid,
            tradepairId
        })
        this.props.dispatch({
            type: 'transaction/fetchCommissionList',
            payload: {
                coinid: coinid,
                paycoinid: paycoinid
            }
        })
        this.props.dispatch({
            type: 'transaction/fetchNewTransReco',
            payload: {
                coinid: coinid,
                paycoinid: paycoinid
            }
        })
        //this.fetchFavorites()
        this.fetchMarketList()
        this.fetchCoinBalance('coinid', { coinid: coinid })
        this.fetchCoinBalance('paycoinid', { coinid: paycoinid })
        socket(data => {
            this.props.dispatch({
                type: 'transaction/webSocket',
                payload: data
            })
        }, {
                url: socketUrl,
                params: {
                    "type": tradepairId,
                    "ctoin": "add"
                },
            })
        socket(data => {
            if (data) {
                this.props.dispatch({
                    type: 'home/webSocket',
                    payload: JSON.parse(data),
                })
            }
        }, {
                url: socketUrl,
                params: {
                    ctoin: 'add',
                    type: 'index'
                },
            })
    }

    buyCoin(price, sumentrust, type) {
        let marketPrice;
        let flag = true
        if (price && sumentrust) {
            if (type) {
                marketPrice = 0
                if (!parseFloat(price) || parseFloat(sumentrust) <= 0 || 1.001 * 1.1 * parseFloat(price) * parseFloat(sumentrust) > this.state.coinTotalAmountBuy) {

                    flag = false
                    return
                }
            } else {
                marketPrice = price
                if (!parseFloat(price) || parseFloat(price) <= 0 || parseFloat(sumentrust) <= 0 || 1.001 * parseFloat(price) * parseFloat(sumentrust) > this.state.coinTotalAmountBuy) {
                    flag = false
                    return
                }
            }
            if (!flag) {
                return
            }
            this.props.dispatch({
                type: 'transaction/fetchBuy',
                payload: {
                    userid: localStorage.getItem('_userid_'),
                    token: localStorage.getItem('_token_'),
                    coinid: this.props.match.params.coinid || 3,
                    paycoinid: this.props.match.params.paycoinid || 2,
                    sumentrust: sumentrust,
                    price: marketPrice,
                    type: '1' // buy
                },
                callback: (response) => {
                    if (response.success) {
                        // Message({
                        //     type: 'success',
                        //     message: '下单成功',
                        //     duration: 2000
                        // });

                        this.props.dispatch({
                            type: 'transaction/fetchEntrustMarketHistory',
                            payload: {}
                        })
                        this.props.dispatch({
                            type: 'transaction/fetchEntrustMarket',
                            payload: {}
                        })

                    } else {
                        Message({
                            type: 'error',
                            message: intl.get(response.msg),
                            duration: 2000
                        });
                    }
                }
            })
        }

    }

    sellCoin(price, sumentrust, type) {
        if (price && sumentrust) {
            if (type) {
                if (parseFloat(sumentrust) <= 0 || parseFloat(sumentrust) > this.state.coinTotalAmountSell) {
                    return
                }
            } else {
                if (parseFloat(price) <= 0 || parseFloat(sumentrust) <= 0 || parseFloat(sumentrust) > this.state.coinTotalAmountSell) {
                    return
                }
            }
            this.props.dispatch({
                type: 'transaction/fetchSell',
                payload: {
                    userid: localStorage.getItem('_userid_'),
                    token: localStorage.getItem('_token_'),
                    coinid: this.props.match.params.coinid || 3,
                    paycoinid: this.props.match.params.paycoinid || 2,
                    sumentrust: sumentrust,
                    price: price,
                    type: '2' // sell
                },
                callback: (response) => {
                    if (response.success) {
                        // Message({
                        //     type: 'success',
                        //     message: '下单成功',
                        //     duration: 2000
                        // });

                        this.props.dispatch({
                            type: 'transaction/fetchEntrustMarketHistory',
                            payload: {}
                        })
                        this.props.dispatch({
                            type: 'transaction/fetchEntrustMarket',
                            payload: {}
                        })

                    } else {
                        Message({
                            type: 'error',
                            message: intl.get(response.msg),
                            duration: 2000
                        });
                    }
                }
            })
        }

    }

    searchHandle(e) {
        this.setState({
            searchContent: e.target.value
        })
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.toggleModal)
    }
    coinSelectShow(e) {
        this.setState({
            coinSelectPanel: !this.state.coinSelectPanel
        })
        e.nativeEvent.stopImmediatePropagation()
    }

    limitPricePanelListDisplay(e) {
        this.setState({
            limitPricePanelListDisplay: !this.state.limitPricePanelListDisplay
        })
        e.nativeEvent.stopImmediatePropagation();
    }

    precisionModelDisplay(e) {
        this.setState({ precisionModelDisplay: !this.state.precisionModelDisplay })
        e.nativeEvent.stopImmediatePropagation();
    }

    selfSelectCoin(e, item, sortShowList) {
        // this.props.dispatch({
        //     type: 'home/editFavorites',
        //     payload: {
        //         item,
        //         cmd: item.selfChoose ? 'del' : 'add',
        //     }
        // })
        // this.setState({
        //     sortShowList: [...sortShowList]
        // })
        if (e.target.nodeName.toUpperCase() === 'SPAN' || e.target.nodeName.toUpperCase() === 'I') {
            e.preventDefault()
            e.stopPropagation()
            // item.selfChoose = !item.selfChoose
            this.props.dispatch({
                type: 'home/editFavorites',
                payload: {
                    item,
                    cmd: item.selfChoose ? 'del' : 'add',
                }
            })
            this.setState({
                sortShowList: [...sortShowList]
            })
        }
    }

    linkTap(coinid, paycoinid, cointype, paycointype) {
        window.location.replace(`${window.location.origin}/#/transaction/${coinid}/${paycoinid}/${cointype}/${paycointype}`)
        window.location.reload()
    }

    coinTypeListDisplay(coinTypeList) {
        let res = []
        let filterCoinTypeList = []
        if (coinTypeList.length > 0) {
            filterCoinTypeList = coinTypeList.filter((item) => {
                return (item.tradepair.indexOf(this.state.searchContent.toUpperCase()) >= 0)
            })
        }
        if (filterCoinTypeList.length > 0) {
            filterCoinTypeList.map((item, index) => {
                let cointype = item.tradepair.split('/')[0]
                let paycointype = item.tradepair.split('/')[1]
                res.push(
                    <a key={index}
                        onClick={e => { this.linkTap(item.coinid, item.paycoinid, cointype, paycointype) }}
                        className={styles.transactionItem}
                    >
                        <span className={styles.coinTransaction}>
                            <span onClick={(e) => this.selfSelectCoin(e, item, coinTypeList)} >
                                <Icon size='14' type={item.selfChoose ? 'xingxing' : 'xingxing1'} color={item.selfChoose ? '#4ac8b1' : '#65628e'} />
                            </span>
                            <span>{item.tradepair}{item.coinid + item.paycoinid}</span>
                        </span>
                        <span className={styles.price}>{item.nowprice.split('/')[0]}</span>
                        {/* {this.fluctuationAndTransaction(item)} */}
                        <span className={parseFloat(item.fluctuation) > 0 ? styles.rise + " " + styles.riseIn : styles.rise + " " + styles.riseOut}>
                            {this.state.sortType === 'riseFall' ? item.fluctuation : item.volume}
                        </span>
                    </a>
                )
            })
        }
        return res
    }
    fetchMarketList() {
        this.props.dispatch({
            type: 'home/fetchMarket',
            payload: {},
            callback: (data) => {
                if (data.success) {
                    setTimeout(() => {
                        this.setState({
                            entrustBuyPriceLimitPrice: (this.props.home.currentTradepair.nowprice || '').split('/')[0],
                            entrustSellPriceLimitPrice: (this.props.home.currentTradepair.nowprice || '').split('/')[0],
                            currentFilterTradepair: this.props.home.currentTradepair.tradepair
                        })
                    })
                }
            }
        })
    }
    fetchCoinBalance(coinType, params) {
        this.props.dispatch({
            type: 'assetBalance/fetch',
            payload: params,
            callback: (data) => {
                if (data.success) {
                    let positions = data.data.list[0].positions
                    if (coinType === 'coinid') {
                        this.setState({ coinTotalAmountSell: parseFloat(positions) })
                    } else if (coinType === 'paycoinid') {
                        this.setState({ coinTotalAmountBuy: parseFloat(positions) })
                    }

                } else {

                }
            }
        })
    }
    selectPanelListDiplay(coinTypeList) {

        let res = []
        let filterCoinTypeList = []
        if (coinTypeList.length > 0) {
            filterCoinTypeList = coinTypeList.filter((item) => {
                return (item.tradepair.indexOf(this.state.selectSearchContent.toUpperCase()) >= 0)

            })
        }
        if (filterCoinTypeList.length > 0) {
            filterCoinTypeList.map((item, index) => {
                let cointype = item.tradepair.split('/')[0]
                let paycointype = item.tradepair.split('/')[1]
                res.push(
                    <a key={index}
                        className={styles.coinItem}
                        onClick={e => { this.linkTap(item.coinid, item.paycoinid, cointype, paycointype) }}
                    >
                        <span className={styles.coinType}>{item.tradepair}</span>
                        <span className={styles.value}>{item.nowprice.split('/')[0]}</span>
                        <span
                            className={parseFloat(item.fluctuation) > 0 ? styles.fallRiseRate + " " + styles.riseIn : styles.fallRiseRate + " " + styles.riseOut}
                        >{item.fluctuation}</span>
                    </a>
                )
            })
        }
        return res
    }
    newestTradeList() {
        let res = []
        this.props.transaction.newTransReco.forEach((item, index) => {
            res.push(
                <li className={styles.transactionItem} key={index}>
                    <span className={styles.tradeAmountIn}> <span>{item.tradepair}</span></span>
                    <span className={styles.tradePrice}>{item.price}</span>
                    <span className={styles.tradeTime}>{item.volume}</span>
                </li>
            )
        });

        return res
    }

    setEntrustPrice(item) {
        if (this.state.chartPanelDataTypeDisplay === 0) {
            this.setState({
                entrustBuyPriceLimitPrice: item.price,
                entrustSellPriceLimitPrice: item.price
            })
        }
    }

    setEntrustAmount(type, percent, str, price) {
        if (!parseFloat(price)) {
            return
        }
        this.setState({ limitPriceBuyPercent: str })
        let canbuyAmount = parseFloat(this.state.coinTotalAmountBuy) / 1.001 / parseFloat(price)
        let canbuyAmountMarket = parseFloat(this.state.coinTotalAmountBuy) / 1.001 / parseFloat(price) / 1.1
        if (type === 'buy') {

            if (this.state.chartPanelDataTypeDisplay === 0) {
                this.setState({
                    entrustBuyAmountLimitPrice: (canbuyAmount * percent).toFixed(4),
                    //entrustSellAmountLimitPrice: (this.state.coinTotalAmountSell * percent).toFixed(6)
                })

            } else if (this.state.chartPanelDataTypeDisplay === 1) {
                this.setState({
                    entrustBuyAmountMarketPrice: (canbuyAmountMarket * percent).toFixed(4),
                    //entrustSellAmountMarketPrice: (this.state.coinTotalAmountSell * percent).toFixed(6)
                })
            }
        } else if (type === 'sell') {
            if (this.state.chartPanelDataTypeDisplay === 0) {
                this.setState({
                    //entrustBuyAmountLimitPrice: (canbuyAmount * percent).toFixed(6),
                    entrustSellAmountLimitPrice: (this.state.coinTotalAmountSell * percent).toFixed(4)
                })

            } else if (this.state.chartPanelDataTypeDisplay === 1) {
                this.setState({
                    //entrustBuyAmountMarketPrice: (canbuyAmountMarket * percent).toFixed(6),
                    entrustSellAmountMarketPrice: (this.state.coinTotalAmountSell * percent).toFixed(4)
                })
            }
        }

    }

    inputEmptyVerify(e, type) {

        switch (type) {
            case 'limit1':
                this.setState({ inputEmptyLimit1: Boolean(e.target.value.trim()) })
                break;
            case 'limit2':
                this.setState({ inputEmptyLimit2: Boolean(e.target.value.trim()) })
                break;
            case 'limit3':
                this.setState({ inputEmptyLimit3: Boolean(e.target.value.trim()) })
                break;
            case 'limit4':
                this.setState({ inputEmptyLimit4: Boolean(e.target.value.trim()) })
                break;
            case 'market1':
                this.setState({ inputEmptyMarket1: Boolean(e.target.value.trim()) })
                break;
            case 'market2':
                this.setState({ inputEmptyMarket2: Boolean(e.target.value.trim()) })
                break;
            default:
                break;
        }
    }

    transactionIncreaseListDisplay() {
        let res = []

        this.props.transaction.commissionListSell.forEach((item, index) => {
            res.push(
                <li
                    className={styles.transactionItem} key={index}
                    onClick={this.setEntrustPrice.bind(this, item)}
                >
                    <span className={styles.transactionPrice}>{parseFloat(item.price).toFixed(this.state.precision)}</span>
                    <span className={styles.transactionQuantity}>{item.volume}</span>
                    <span className={styles.transactionAmount}>
                        {(parseFloat(item.price) * parseFloat(item.volume)).toFixed(6)}
                    </span>
                </li>
            )
        })
        return res
    }

    transactionDecreaseListDisplay() {
        let res = []
        this.props.transaction.commissionListBuy.forEach((item, index) => {
            res.push(
                <li
                    className={styles.transactionItem} key={index}
                    onClick={this.setEntrustPrice.bind(this, item)}
                >
                    <span className={styles.transactionPrice}>{parseFloat(item.price).toFixed(this.state.precision)}</span>
                    <span className={styles.transactionQuantity}>{item.volume}</span>
                    <span className={styles.transactionAmount}>
                        {(parseFloat(item.price) * parseFloat(item.volume)).toFixed(6)}
                    </span>
                </li>
            )
        })
        return res
    }
    render() {
        return (
            <div className={styles.normal}>
                <Header
                    headerWidth='1440px'
                    headerContainerWidth='98%'
                    headerInfoWidth='100%'
                    headerDescWidth='100%'
                />
                <div className={styles.container}>
                    <div className={styles.section + " " + styles.sectionLeft}>
                        <div className={styles.barTop + " " + styles.barLeft}>
                            <ul className={styles.dataList}>
                                <li onClick={() => {
                                    this.setState({
                                        dataSectionPanelAll: true,
                                        dataTypePanel: 0
                                    })
                                }}
                                    className={this.state.dataTypePanel === 0 ? styles.actived : ''}
                                >
                                    <img src={images.chartIcon1} alt="" />
                                </li>
                                <li
                                    className={this.state.dataTypePanel === 1 ? styles.actived : ''}
                                    onClick={() => {
                                        this.setState({
                                            dataSectionPanelAll: false,
                                            decreaseDataSectionPanelAll: true,
                                            increaseDataSectionPanelAll: false,
                                            dataTypePanel: 1
                                        })
                                    }}
                                >
                                    <img src={images.chartIcon2} alt="" /></li>
                                <li
                                    className={this.state.dataTypePanel === 2 ? styles.actived : ''}
                                    onClick={() => {
                                        this.setState({
                                            dataSectionPanelAll: false,
                                            decreaseDataSectionPanelAll: false,
                                            increaseDataSectionPanelAll: true,
                                            dataTypePanel: 2
                                        })
                                    }}
                                >
                                    <img src={images.chartIcon3} alt="" /></li>
                            </ul>
                            <div className={styles.select}>
                                <div className={styles.selectAccuracy}>
                                    <h5
                                        onClick={(e) => this.precisionModelDisplay(e)}
                                    >{this.state.precisionText} <Icon type='xialajiantouxiangxia' size='12' color='#6f6c99' /> </h5>
                                    <ul className={this.state.precisionModelDisplay ? styles.precisionModel : ''}>
                                        <li
                                            onClick={() => this.setState({
                                                precisionText: '零位小数',
                                                precisionModelDisplay: false,
                                                precision: 0
                                            })}
                                            className={styles.selectItem}
                                        >零位小数</li>
                                        <li
                                            onClick={() => this.setState({
                                                precisionText: '两位小数',
                                                precisionModelDisplay: false,
                                                precision: 2
                                            })}
                                            className={styles.selectItem}
                                        >两位小数</li>
                                        <li
                                            onClick={() => this.setState({
                                                precisionText: '三位小数',
                                                precisionModelDisplay: false,
                                                precision: 3
                                            })}
                                            className={styles.selectItem}
                                        >三位小数</li>
                                        <li
                                            onClick={() => this.setState({
                                                precisionText: '四位小数',
                                                precisionModelDisplay: false,
                                                precision: 4
                                            })}
                                            className={styles.selectItem}
                                        >四位小数</li>
                                        <li
                                            onClick={() => this.setState({
                                                precisionText: '五位小数',
                                                precisionModelDisplay: false,
                                                precision: 5
                                            })}
                                            className={styles.selectItem}
                                        >五位小数</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className={styles.dataTitle}>
                            <span className={styles.transactionPrice}>价格({(this.props.home.currentTradepair.tradepair || '').split('/')[1]})</span>
                            <span className={styles.transactionQuantity}>数量</span>
                            <span className={styles.transactionAmount}>成交金额({(this.props.home.currentTradepair.tradepair || '').split('/')[1]})</span>
                        </div>
                        <div className={styles.dataSectionPanel}>
                            <ul className={
                                this.state.dataSectionPanelAll || this.state.decreaseDataSectionPanelAll ? styles.transactionInfo + " " + styles.transactionDecrease : ''
                            }>
                                {this.transactionIncreaseListDisplay()}
                            </ul>
                            <ul style={{ display: 'block' }}>
                                <h5 className={styles.totalAnalysis}>
                                    <span className={styles.percentVary}>
                                        <span>{(this.props.home.currentTradepair.nowprice || '').split('/')[0]}</span>
                                        <Icon type='xiangshang' />
                                    </span>
                                    <span className={styles.priceVary}>
                                        <span>{(this.props.home.currentTradepair.nowprice || '').split('/')[1]}</span>

                                    </span>
                                    <span className={styles.iconChart}>
                                        <img src={images.iconChart} alt="" />
                                    </span>
                                </h5>
                            </ul>

                            <ul className={this.state.dataSectionPanelAll || this.state.increaseDataSectionPanelAll ? styles.transactionInfo + " " + styles.transactionIncrease : ''}>
                                {this.transactionDecreaseListDisplay()}
                            </ul>
                        </div>

                    </div>
                    <div className={styles.mainSection}>
                        <div className={styles.chartsHeader}>
                            <div className={styles.coinType} onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
                                <p onClick={() => this.setState({ coinSelectPanel: !this.state.coinSelectPanel })}>
                                    <span>{this.props.home.currentTradepair.tradepair}</span>
                                    <span className={this.state.coinSelectPanel ? styles.rotate : styles.rotate1}>
                                        <Icon type='xialajiantouxiangxia' color='#4ac8b1' size='17' />
                                    </span>
                                </p>
                                <p>{this.props.home.currentTradepair.fullname}</p>
                                <div className={this.state.coinSelectPanel ? styles.display + " " + styles.coinSelect : styles.coinSelect}>
                                    <p className={styles.tradeCouple}>
                                        <span
                                            className={this.state.tradeCoupleItem === 'QQ' ? styles.selected : ''}
                                            onClick={() => this.setState({ tradeCoupleItem: 'QQ' })}
                                        >QQ</span>
                                        <span
                                            className={this.state.tradeCoupleItem === 'USDT' ? styles.selected : ''}
                                            onClick={() => this.setState({ tradeCoupleItem: 'USDT' })}
                                        >USDT</span>
                                        <span
                                            className={this.state.tradeCoupleItem === 'BTC' ? styles.selected : ''}
                                            onClick={() => this.setState({ tradeCoupleItem: 'BTC' })}
                                        >BTC</span>
                                        <span
                                            className={this.state.tradeCoupleItem === 'ETH' ? styles.selected : ''}
                                            onClick={() => this.setState({ tradeCoupleItem: 'ETH' })}
                                        >ETH</span>
                                    </p>
                                    <div className={styles.coinSearch}>
                                        <Icon type='sousuo' color='#4ac8b1' size='14' />
                                        <input onChange={(e) => this.coinSelectPanelShow(e)} type="text" />
                                    </div>
                                    <div className={styles.categoryShow + ' ' + styles.panelList}>
                                        <Scrollbar
                                            damping={0.1}
                                            thumbMinSize={2}
                                            renderByPixels={true}
                                            alwaysShowTracks={true}
                                            continuousScrolling={true}

                                        >

                                            <ul className={this.state.tradeCoupleItem === 'QQ' ? styles.transactionInfo : ''}>
                                                {this.selectPanelListDiplay(this.props.home.qqMarket)}
                                            </ul>
                                            <ul className={this.state.tradeCoupleItem === 'USDT' ? styles.transactionInfo : ''}>
                                                {this.selectPanelListDiplay(this.props.home.usdtMarket)}
                                            </ul>
                                            <ul className={this.state.tradeCoupleItem === 'BTC' ? styles.transactionInfo : ''}>
                                                {this.selectPanelListDiplay(this.props.home.btcMarket)}
                                            </ul>
                                            <ul className={this.state.tradeCoupleItem === 'ETH' ? styles.transactionInfo : ''}>
                                                {this.selectPanelListDiplay(this.props.home.ethMarket)}
                                            </ul>
                                        </Scrollbar>
                                    </div>

                                </div>
                            </div>
                            <div className={styles.coinInfo}>
                                <div className={styles.newestPrice}>
                                    <p> <span>{this.props.home.currentTradepair.nowprice}</span> </p>
                                    <p>最新价格</p>
                                </div>
                                <div className={styles.dayWave}>
                                    <p className={parseFloat(this.props.home.currentTradepair.fluctuation) > 0 ? styles.increase : styles.decrease}>
                                        <span>{this.props.home.currentTradepair.fluctuation}</span> </p>
                                    <p>24h涨跌</p>
                                </div>
                                <div className={styles.dayMax}>
                                    <p> <span>{this.props.home.currentTradepair.high}</span> </p>
                                    <p>24h高点</p>
                                </div>
                                <div className={styles.dayMin}>
                                    <p> <span>{this.props.home.currentTradepair.low}</span> </p>
                                    <p>24h低点</p>
                                </div>
                                <div className={styles.dayAmount}>
                                    <p> <span>{this.props.home.currentTradepair.volume}</span></p>
                                    <p>24h交易量</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.charts}>
                            <TVChartContainer
                                tradepair={(this.state.cointype + '_' + this.state.paycointype
                                    + '_' + this.state.coinid + '_' + this.state.paycoinid) || 'BTC_USDT_3_2'}
                            />
                        </div>
                        <div className={styles.transaction}>
                            <div className={styles.transactionTitle + " " + styles.bannerHeader}>
                                <span
                                    className={this.state.chartPanelDataTypeDisplay === 0 ? styles.actived : ''}
                                    onClick={() => this.setState({ chartPanelDataTypeDisplay: 0 })}
                                >限价</span>
                                <span
                                    className={this.state.chartPanelDataTypeDisplay === 1 ? styles.actived : ''}
                                    onClick={() => this.setState({ chartPanelDataTypeDisplay: 1 })}
                                >市价</span>
                                {/* <span
                                    className={this.state.chartPanelDataTypeDisplay === 2 ? styles.actived : ''}
                                    onClick={() => this.setState({ chartPanelDataTypeDisplay: 2 })}
                                >止盈止损</span> */}
                            </div>
                            <div className={styles.transactionDetails}>
                                <div className={this.state.chartPanelDataTypeDisplay === 0 ? styles.display : ''}>
                                    <div>
                                        <div className={styles.purchase + " " + styles.transactions}>
                                            <div className={styles.purchasePrice}>
                                                <p>买入价</p>
                                                <p>
                                                    <input
                                                        onChange={(e) => this.setState({
                                                            entrustBuyPriceLimitPrice: (parseFloat(e.target.value) <= 100000000000000 &&  parseFloat(e.target.value) >=0? e.target.value : '')
                                                        })}
                                                        type="number"
                                                        step='0.00001'
                                                        value={getDigits(this.props.home.currentTradepair.tradepair,this.state.entrustBuyPriceLimitPrice,1)}
                                                        className={this.state.inputEmptyLimit1 ? '' : styles.error}
                                                        onBlur={(e) => this.inputEmptyVerify(e, 'limit1')}
                                                    />
                                                    <span className={styles.exchangeRate}>
                                                        ￥{this.state.entrustBuyPriceLimitPrice ? parseFloat(this.state.entrustBuyPriceLimitPrice).toFixed(2) : (0.000000).toFixed(2)}
                                                    </span>
                                                    <span className={styles.currencyUnit}>
                                                        {(this.props.home.currentTradepair.tradepair || '').split('/')[1]}
                                                    </span>
                                                </p>
                                                {/* <p>≈ 44266.11 CNY</p> */}
                                            </div>
                                            <div className={styles.purchase + " " + styles.amount}>
                                                <p>买入量</p>
                                                <p>
                                                    <input
                                                        onChange={(e) => this.setState({
                                                            entrustBuyAmountLimitPrice: (parseFloat(e.target.value) <= 100000000000000 &&  parseFloat(e.target.value) >=0? e.target.value : '')
                                                        })}
                                                        type="number"
                                                        step='0.00001'
                                                        value={this.state.entrustBuyAmountLimitPrice}
                                                        className={this.state.inputEmptyLimit2 ? '' : styles.error}
                                                        onBlur={(e) => this.inputEmptyVerify(e, 'limit2')}
                                                    />

                                                    {/* <span className={styles.maxValueAction}>
                                                        最多买入
                                                            {parseFloat(this.state.entrustBuyPriceLimitPrice) ?
                                                            this.state.coinTotalAmount / parseFloat(this.state.entrustBuyPriceLimitPrice) : '0.000000'}
                                                    </span>  */}
                                                    <span className={styles.currencyUnit}>
                                                        {(this.props.home.currentTradepair.tradepair || '').split('/')[0]}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className={styles.purchaseProgress + " " + styles.progress}>
                                                <p className={styles.line}>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('buy', 0.25, '25%', this.state.entrustBuyPriceLimitPrice)}
                                                    // className={this.state.limitPriceBuyPercent === '25%' ? styles.actived : ''}
                                                    >25%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('buy', 0.5, '50%', this.state.entrustBuyPriceLimitPrice)}
                                                    // className={this.state.limitPriceBuyPercent === '50%' ? styles.actived : ''}
                                                    >50%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('buy', 0.75, '75%', this.state.entrustBuyPriceLimitPrice)}
                                                    // className={this.state.limitPriceBuyPercent === '75%' ? styles.actived : ''}
                                                    >75%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('buy', 1, '100%', this.state.entrustBuyPriceLimitPrice)}
                                                    // className={this.state.limitPriceBuyPercent === '100%' ? styles.actived : ''}
                                                    >100%</span>
                                                </p>
                                            </div>
                                            <div className={styles.transactionAmounts}>
                                                <span>交易额</span>
                                                <span>{
                                                    parseFloat(this.state.entrustBuyAmountLimitPrice) && parseFloat(this.state.entrustBuyPriceLimitPrice) ?
                                                        (parseFloat(this.state.entrustBuyAmountLimitPrice) * parseFloat(this.state.entrustBuyPriceLimitPrice)).toFixed(4) : (0.00).toFixed(4)
                                                }</span>
                                                <span>{(this.props.home.currentTradepair.tradepair || '').split('/')[1]}</span>
                                                <span className={
                                                    (1.001 * (parseFloat(this.state.entrustBuyAmountLimitPrice) || 0)
                                                        * (parseFloat(this.state.entrustBuyPriceLimitPrice) || 0)).toFixed(4) > this.state.coinTotalAmountBuy ?
                                                        styles.insufficientBalance + ' ' + styles.display : styles.insufficientBalance}
                                                >账户余额不足</span>
                                            </div>
                                            {
                                                tokenVerify() ?
                                                    <button
                                                        className={styles.purchaseAction}
                                                        onClick={
                                                            (e) => this.buyCoin(this.state.entrustBuyPriceLimitPrice, this.state.entrustBuyAmountLimitPrice)
                                                        }
                                                    >买入<span>{(this.props.home.currentTradepair.tradepair || '').split('/')[0]}</span></button>
                                                    :
                                                    <Link to='/newlogin' className={styles.purchaseAction}>登录</Link>
                                            }

                                        </div>
                                        <div className={styles.sellOut + " " + styles.transactions}>
                                            <div className={styles.sellOutPrice}>
                                                <p>卖出价</p>
                                                <p>
                                                    <input
                                                        onChange={(e) => this.setState({
                                                            entrustSellPriceLimitPrice: (parseFloat(e.target.value) <= 100000000000000 &&  parseFloat(e.target.value) >=0? e.target.value : '')
                                                        })}
                                                        type="number"
                                                        step='0.00001'
                                                        value={this.state.entrustSellPriceLimitPrice}
                                                        className={this.state.inputEmptyLimit3 ? '' : styles.error}
                                                        onBlur={(e) => this.inputEmptyVerify(e, 'limit3')}
                                                    />
                                                    <span className={styles.currencyUnit}>
                                                        {(this.props.home.currentTradepair.tradepair || '').split('/')[1]}
                                                    </span>
                                                </p>
                                                {/* <p>≈ 44266.11 CNY</p> */}
                                            </div>
                                            <div className={styles.sellOut + " " + styles.amount}>
                                                <p>卖出量</p>
                                                <p>
                                                    <input
                                                        onChange={(e) => this.setState({
                                                            entrustSellAmountLimitPrice: (parseFloat(e.target.value) <= 100000000000000 &&  parseFloat(e.target.value) >=0? e.target.value : '')
                                                        })}
                                                        type="number"
                                                        step='0.00001'
                                                        value={this.state.entrustSellAmountLimitPrice}
                                                        className={this.state.inputEmptyLimit4 ? '' : styles.error}
                                                        onBlur={(e) => this.inputEmptyVerify(e, 'limit4')}
                                                    />
                                                    <span className={styles.currencyUnit}>
                                                        {(this.props.home.currentTradepair.tradepair || '').split('/')[0]}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className={styles.sellOutProgress + " " + styles.progress}>
                                                <p className={styles.line}>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('sell', 0.25, '25%', this.state.entrustSellPriceLimitPrice)}
                                                    // className={this.state.limitPriceBuyPercent === '25%' ? styles.actived : ''}
                                                    >25%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('sell', 0.5, '50%', this.state.entrustSellPriceLimitPrice)}
                                                    // className={this.state.limitPriceBuyPercent === '50%' ? styles.actived : ''}
                                                    >50%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('sell', 0.75, '75%', this.state.entrustSellPriceLimitPrice)}
                                                    // className={this.state.limitPriceBuyPercent === '75%' ? styles.actived : ''}
                                                    >75%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('sell', 1, '100%', this.state.entrustSellPriceLimitPrice)}
                                                    // className={this.state.limitPriceBuyPercent === '100%' ? styles.actived : ''}
                                                    >100%</span>
                                                </p>
                                            </div>
                                            <div className={styles.transactionAmounts}>
                                                <span>交易额</span>
                                                <span>{
                                                    parseFloat(this.state.entrustSellAmountLimitPrice) ? parseFloat(this.state.entrustSellAmountLimitPrice).toFixed(4) : (0.000000).toFixed(4)
                                                }</span>
                                                <span>{(this.props.home.currentTradepair.tradepair || '').split('/')[0]}</span>
                                                <span className={
                                                    (parseFloat(this.state.entrustSellAmountLimitPrice) || 0) > this.state.coinTotalAmountSell ?
                                                        styles.insufficientBalance + ' ' + styles.display : styles.insufficientBalance}
                                                >账户余额不足</span>

                                            </div>
                                            {
                                                tokenVerify() ?
                                                    <button
                                                        className={styles.sellOutAction}
                                                        onClick={
                                                            (e) => this.sellCoin(this.state.entrustSellPriceLimitPrice, this.state.entrustSellAmountLimitPrice)
                                                        }
                                                    >卖出
                                                        <span>{(this.props.home.currentTradepair.tradepair || '').split('/')[0]}</span>
                                                    </button>
                                                    :
                                                    <Link to='/newlogin' className={styles.sellOutAction}>登录</Link>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={this.state.chartPanelDataTypeDisplay === 1 ? styles.display : ''}>
                                    <div>
                                        <div className={styles.purchase + " " + styles.transactions}>
                                            <div className={styles.purchasePrice}>
                                                <p>买入价</p>
                                                <p>
                                                    <input
                                                        autoComplete="off"
                                                        //onChange={(e) => this.setState({ entrustBuyPriceMarketPrice: e.target.value })}
                                                        type="text"
                                                        value='市价'
                                                        readOnly='readOnly'
                                                        className={styles.disableType}
                                                    //value={this.state.entrustBuyPriceMarketPrice}
                                                    />
                                                    <span className={styles.currencyUnit}>
                                                        {(this.props.home.currentTradepair.tradepair || '').split('/')[1]}
                                                    </span>
                                                </p>
                                                {/* <p>≈ 44266.11 CNY</p> */}
                                            </div>
                                            <div className={styles.purchase + " " + styles.amount}>
                                                <p>买入量</p>
                                                <p>
                                                    <input
                                                        onChange={(e) => this.setState({
                                                            entrustBuyAmountMarketPrice: (parseFloat(e.target.value) <= 100000000000000 &&  parseFloat(e.target.value) >=0? e.target.value : '')
                                                        })}
                                                        type="number"
                                                        step='0.00001'
                                                        value={this.state.entrustBuyAmountMarketPrice}
                                                        className={this.state.inputEmptyMarket1 ? '' : styles.error}
                                                        onBlur={(e) => this.inputEmptyVerify(e, 'market1')}
                                                    />
                                                    <span className={styles.currencyUnit}>
                                                        {(this.props.home.currentTradepair.tradepair || '').split('/')[0]}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className={styles.purchaseProgress + " " + styles.progress}>
                                                <p className={styles.line}>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('buy', 0.25, '25%', this.props.home.currentTradepair.nowprice.split('/')[0])}
                                                    // className={this.state.limitPriceBuyPercent === '25%' ? styles.actived : ''}
                                                    >25%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('buy', 0.5, '50%', this.props.home.currentTradepair.nowprice.split('/')[0])}
                                                    // className={this.state.limitPriceBuyPercent === '50%' ? styles.actived : ''}
                                                    >50%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('buy', 0.75, '75%', this.props.home.currentTradepair.nowprice.split('/')[0])}
                                                    // className={this.state.limitPriceBuyPercent === '75%' ? styles.actived : ''}
                                                    >75%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('buy', 1, '100%', this.props.home.currentTradepair.nowprice.split('/')[0])}
                                                    // className={this.state.limitPriceBuyPercent === '100%' ? styles.actived : ''}
                                                    >100%</span>
                                                </p>
                                            </div>
                                            <div className={styles.transactionAmounts}>
                                                <span className={
                                                    (1.001 * 1.1 * (parseFloat(this.state.entrustBuyAmountMarketPrice) || 0) * (parseFloat((this.props.home.currentTradepair.nowprice || '').split('/')[0]) || 0)).toFixed(4)
                                                        > this.state.coinTotalAmountBuy ? styles.insufficientBalance + ' ' + styles.display : styles.insufficientBalance}
                                                >你的账号余额不足</span>
                                            </div>
                                            {
                                                tokenVerify() ?
                                                    <button
                                                        className={styles.purchaseAction}
                                                        onClick={
                                                            (e) => this.buyCoin((this.props.home.currentTradepair.nowprice || '').split('/')[0], this.state.entrustBuyAmountMarketPrice, true)
                                                        }
                                                    >买入
                                                        <span>{(this.props.home.currentTradepair.tradepair || '').split('/')[0]}</span>
                                                    </button>
                                                    :
                                                    <Link to='/newlogin' className={styles.purchaseAction}>登录</Link>
                                            }
                                        </div>
                                        <div className={styles.sellOut + " " + styles.transactions}>
                                            <div className={styles.sellOutPrice}>
                                                <p>卖出价</p>
                                                <p>
                                                    <input
                                                        autoComplete="off"
                                                        //onChange={(e) => this.setState({entrustSellPriceMarketPrice: e.target.value})}
                                                        type="text"
                                                        //value={this.state.entrustSellPriceMarketPrice}
                                                        value='市价'
                                                        readOnly='readOnly'
                                                        className={styles.disableType}
                                                    />

                                                    <span className={styles.currencyUnit}>
                                                        {(this.props.home.currentTradepair.tradepair || '').split('/')[1]}
                                                    </span>
                                                </p>
                                                {/* <!-- <p>≈ 44266.11 CNY</p> --> */}
                                            </div>
                                            <div className={styles.sellOut + " " + styles.amount}>
                                                <p>卖出量</p>
                                                <p>
                                                    <input
                                                        onChange={(e) => this.setState({
                                                            entrustSellAmountMarketPrice: parseFloat(e.target.value) <= 100000000000000 &&  parseFloat(e.target.value) >=0?e.target.value : ''
                                                        })}
                                                        type="number"
                                                        step='0.00001'
                                                        value={this.state.entrustSellAmountMarketPrice}
                                                        className={this.state.inputEmptyMarket2 ? '' : styles.error}
                                                        onBlur={(e) => this.inputEmptyVerify(e, 'market2')}
                                                    />
                                                    <span className={styles.currencyUnit}>
                                                        {(this.props.home.currentTradepair.tradepair || '').split('/')[0]}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className={styles.sellOutProgress + " " + styles.progress}>
                                                <p className={styles.line}>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('sell', 0.25, '25%', this.props.home.currentTradepair.nowprice.split('/')[0])}
                                                    // className={this.state.limitPriceBuyPercent === '25%' ? styles.actived : ''}
                                                    >25%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('sell', 0.5, '50%', this.props.home.currentTradepair.nowprice.split('/')[0])}
                                                    // className={this.state.limitPriceBuyPercent === '50%' ? styles.actived : ''}
                                                    >50%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('sell', 0.75, '75%', this.props.home.currentTradepair.nowprice.split('/')[0])}
                                                    // className={this.state.limitPriceBuyPercent === '75%' ? styles.actived : ''}
                                                    >75%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount('sell', 1, '100%', this.props.home.currentTradepair.nowprice.split('/')[0])}
                                                    // className={this.state.limitPriceBuyPercent === '100%' ? styles.actived : ''}
                                                    >100%</span>
                                                </p>
                                            </div>
                                            <div className={styles.transactionAmounts}>
                                                <span className={
                                                    (parseFloat(this.state.entrustSellAmountMarketPrice) || 0) > this.state.coinTotalAmountSell ?
                                                        styles.insufficientBalance + ' ' + styles.display : styles.insufficientBalance}
                                                >你的账号余额不足</span>
                                            </div>
                                            {
                                                tokenVerify() ?
                                                    <button
                                                        className={styles.sellOutAction}
                                                        onClick={
                                                            (e) => this.sellCoin((this.props.home.currentTradepair.nowprice || '').split('/')[0], this.state.entrustSellAmountMarketPrice, true)
                                                        }
                                                    >卖出
                                                        <span>{(this.props.home.currentTradepair.tradepair || '').split('/')[0]}</span>
                                                    </button>
                                                    :
                                                    <Link to='/newlogin' className={styles.sellOutAction}>登录</Link>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {/* <div className={this.state.chartPanelDataTypeDisplay === 2 ? styles.display : ''}>
                                    <div>
                                        <div className={styles.purchase + " " + styles.transactions}>
                                            <div className={styles.purchasePrice}>
                                                <p>买入价</p>
                                                <p>
                                                    <input onChange={(e) => this.setState({ entrustBuyPriceTPSL: e.target.value })}
                                                        type="number" value={this.state.entrustBuyPriceTPSL}
                                                    />
                                                    <span className={styles.currencyUnit}>USDT</span>
                                                </p>

                                            </div>
                                            <div className={styles.purchasePrice}>
                                                <p className={styles.entrustPrice}>委托价</p>
                                                <p>
                                                    <input onChange={(e) => this.handle(e)}
                                                        type="number" value={this.state.entrustBuyPriceTPSL}
                                                    />
                                                    <span className={styles.currencyUnit}>USDT</span>
                                                </p>
                                            </div>
                                            <div className={styles.purchase + " " + styles.amount}>
                                                <p>买入量</p>
                                                <p>
                                                    <input onChange={(e) => this.setState({ entrustBuyAmountTPSL: e.target.value })}
                                                        type="number" value={this.state.entrustBuyAmountTPSL}
                                                    />
                                                    <span className={styles.currencyUnit}>USDT</span>
                                                </p>
                                            </div>
                                            <div className={styles.purchaseProgress + " " + styles.progress}>
                                                <p className={styles.line}>
                                                    <span
                                                        onClick={() => this.setEntrustAmount(0.25, '25%')}
                                                    // className={this.state.limitPriceBuyPercent === '25%' ? styles.actived : ''}
                                                    >25%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount(0.5, '50%')}
                                                    // className={this.state.limitPriceBuyPercent === '50%' ? styles.actived : ''}
                                                    >50%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount(0.25, '75%')}
                                                    // className={this.state.limitPriceBuyPercent === '75%' ? styles.actived : ''}
                                                    >75%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount(1, '100%')}
                                                    // className={this.state.limitPriceBuyPercent === '100%' ? styles.actived : ''}
                                                    >100%</span>
                                                </p>
                                            </div>
                                            <div className={styles.transactionAmounts}>
                                                <span>交易额</span>
                                                <span>0.00000000</span>
                                                <span>USDT</span>
                                                <span>你的账号余额不足</span>
                                            </div>
                                            <button className={styles.purchaseAction}>买入<span>BTC</span></button>
                                        </div>
                                        <div className={styles.sellOut + " " + styles.transactions}>
                                            <div className={styles.sellOutPrice}>
                                                <p>卖出价</p>
                                                <p>
                                                    <input onChange={(e) => this.setState({ entrustSellPriceTPSL: e.target.value })}
                                                        type="number" value={this.entrustSellPriceTPSL}
                                                    />
                                                    <span className={styles.currencyUnit}>USDT</span>
                                                </p>
                                            </div>
                                            <div className={styles.sellOutPrice}>
                                                <p className={styles.entrustPrice}>委托价</p>
                                                <p>
                                                    <input onChange={(e) => this.handle(e)}
                                                        type="number" value={"6338.15"}
                                                    />
                                                    <span className={styles.currencyUnit}>USDT</span>
                                                </p>
                                            </div>
                                            <div className={styles.sellOut + " " + styles.amount}>
                                                <p>卖出量</p>
                                                <p>
                                                    <input onChange={(e) => this.setState({ entrustSellAmountTPSL: e.target.value })}
                                                        type="number" value={this.state.entrustSellAmountTPSL}
                                                    />
                                                    <span className={styles.currencyUnit}>USDT</span>
                                                </p>
                                            </div>
                                            <div className={styles.sellOutProgress + " " + styles.progress}>
                                                <p className={styles.line}>
                                                    <span
                                                        onClick={() => this.setEntrustAmount(0.25, '25%')}
                                                    // className={this.state.limitPriceBuyPercent === '25%' ? styles.actived : ''}
                                                    >25%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount(0.5, '50%')}
                                                    // className={this.state.limitPriceBuyPercent === '50%' ? styles.actived : ''}
                                                    >50%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount(0.25, '75%')}
                                                    // className={this.state.limitPriceBuyPercent === '75%' ? styles.actived : ''}
                                                    >75%</span>
                                                    <span
                                                        onClick={() => this.setEntrustAmount(1, '100%')}
                                                    // className={this.state.limitPriceBuyPercent === '100%' ? styles.actived : ''}
                                                    >100%</span>
                                                </p>
                                            </div>
                                            <div className={styles.transactionAmounts}><span>交易额</span><span>0.00000000</span><span>USDT</span></div>
                                            <button className={styles.sellOutAction}>卖出<span>BTC</span></button>
                                        </div>
                                    </div>
                                </div> */}
                            </div>

                        </div>
                    </div>
                    <div className={styles.section + " " + styles.sectionRight}>
                        <nav className={styles.barTop + " " + styles.barRight}>
                            <li
                                className={this.state.selectedCoinType === 0 ? styles.rightBarItem + " " + styles.selected : styles.rightBarItem}
                                onClick={() => this.setState({ selectedCoinType: 0 })}
                            ><i className={`icon iconfont icon-xingxing`}></i>自选</li>
                            <li
                                className={this.state.selectedCoinType === 1 ? styles.rightBarItem + " " + styles.selected : styles.rightBarItem}
                                onClick={() => this.setState({ selectedCoinType: 1 })}
                            > QQ</li>
                            <li
                                className={this.state.selectedCoinType === 2 ? styles.rightBarItem + " " + styles.selected : styles.rightBarItem}
                                onClick={() => this.setState({ selectedCoinType: 2 })}
                            >USDT</li>
                            <li
                                className={this.state.selectedCoinType === 3 ? styles.rightBarItem + " " + styles.selected : styles.rightBarItem}
                                onClick={() => this.setState({ selectedCoinType: 3 })}
                            >BTC</li>
                            <li
                                className={this.state.selectedCoinType === 4 ? styles.rightBarItem + " " + styles.selected : styles.rightBarItem}
                                onClick={() => this.setState({ selectedCoinType: 4 })}
                            >ETH</li>
                        </nav>
                        <div className={styles.sortShow}>
                            <span className={styles.search}>
                                <input
                                    onChange={(e) => this.searchHandle(e)}
                                    type="text"
                                    placeholder="查询"
                                />
                                <Icon type='sousuo' color='#4d4874' size='14' />
                            </span>
                            <span
                                onClick={() => this.setState({ sortType: 'riseFall' })}
                                className={styles.riseFallShow}>
                                <img src={this.state.sortType === 'riseFall' ? images.radio_01 : images.radio_02} alt="" />
                                <span>涨跌</span>
                            </span>
                            <span
                                onClick={() => this.setState({ sortType: 'transactionAmount' })}
                                className={styles.transactionAmountShow}>
                                <img src={this.state.sortType === 'transactionAmount' ? images.radio_01 : images.radio_02} alt="" />
                                <span>成交量</span>
                            </span>
                        </div>
                        <div className={styles.categoryShow}>
                            <h5 className={styles.titleShow}>
                                <span className={styles.market}>市场</span>
                                <span className={styles.price}>价格</span>
                                <span className={styles.riseFall}>{this.state.sortType === 'riseFall' ? '涨跌' : '成交量'}</span>
                            </h5>
                            <Scrollbar
                                damping={0.1}
                                thumbMinSize={2}
                                renderByPixels={true}
                                alwaysShowTracks={true}
                                continuousScrolling={true}

                            >
                                <ul className={this.state.selectedCoinType === 0 ? styles.transactionInfo : ''}>
                                    {this.coinTypeListDisplay(this.props.home.favorite)}
                                </ul>
                                <ul className={this.state.selectedCoinType === 1 ? styles.transactionInfo : ''}>
                                    {this.coinTypeListDisplay(this.props.home.qqMarket)}
                                </ul>
                                <ul className={this.state.selectedCoinType === 2 ? styles.transactionInfo : ''}>
                                    {this.coinTypeListDisplay(this.props.home.usdtMarket)}
                                </ul>
                                <ul className={this.state.selectedCoinType === 3 ? styles.transactionInfo : ''}>
                                    {this.coinTypeListDisplay(this.props.home.btcMarket)}
                                </ul>
                                <ul className={this.state.selectedCoinType === 4 ? styles.transactionInfo : ''}>
                                    {this.coinTypeListDisplay(this.props.home.ethMarket)}
                                </ul>
                            </Scrollbar>

                        </div>
                        <div className={styles.newestTrade}>
                            <h5 className={styles.newestTitle}><span>最新成交</span> </h5>

                            <Scrollbar
                                damping={0.1}
                                thumbMinSize={2}
                                renderByPixels={true}
                                alwaysShowTracks={true}
                                continuousScrolling={true}
                            >
                                <ul className={styles.transactionInfo}>
                                    {this.newestTradeList()}
                                </ul>
                            </Scrollbar>
                        </div>
                    </div>
                </div>
                <div className={styles.bottomContainer}>
                    <div className={styles.bottomBanner}>
                        <Commission filters={this.state.currentFilterTradepair} />
                    </div>
                    {/* <Footer
                        footerWidth='1440px'
                        footerContainerWidth='98%'
                        footerInfoWidth='100%'
                        footerDescWidth='100%'
                    /> */}
                </div>

            </div>
        )
    }

}
