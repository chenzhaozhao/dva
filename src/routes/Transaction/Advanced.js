import React, { PureComponent,Component} from 'react'
import { connect } from 'dva'
import { Link, routerRedux } from 'dva/router'
import styles from './Advanced.less'
import images from '../../common/images'
import logo from '../../assets/images/logo.png'
import SelecteLanguage from '../../components/SelectLanguage'
import Icon from '../../components/Icon'
import { TVChartContainer } from '../../components/TVChartContainer'
import {tokenVerify, logout, formatTime, getDigits,limitDecimal,getDecimal,clearUserInfo} from '../../utils'
import { WS_URL as socketUrl } from '../../common/global'
import Scrollbar from 'react-smooth-scrollbar'
import Commission from '../../components/Commission'
import Avatar from '../../components/Avatar'
import TopCommon from '../../components/TopCommon'
import VipType from '../../components/VipType'
import { socket } from '../../services/socket'
import { Notification ,Dropdown} from 'element-react'
import intl from 'react-intl-universal'
import Header from "../../components/Header";
let IntervalAsset=null;
@connect(state => ({
    user: state.user,
    transaction: state.transaction,
    home: state.home
}))
export default class Index extends Component {
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
            tradeCoupleItem: 'MarketMain',
            sortType: 'riseFall',
            precisionModelDisplay: false,
            dataSectionPanelAll: true,
            decreaseDataSectionPanelAll: true,
            increaseDataSectionPanelAll: true,
            dataTypePanel: 0,
            commissionType: 'current',
            chartPanelDataTypeDisplay: 0,
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
            selectSearchContent: '',
            transactionDecreaseList: [],
            transactionIncreaseList: [],
            sortShowList: [],
            coinid: '',
            paycoinid: '',
            cointype: '',
            paycointype: '',
            coinExchangeRate: '',
            paycoinExchangeRate: '',
            currentFilterTradepair: '',
            firstProps: true
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.getAllMyAsset=this.getAllMyAsset.bind(this);
        this.setIntervalAsset=this.setIntervalAsset.bind(this);
    }

    requestStatus = {
        status: true
    };

    coinSelectPanelShow(e) {
        this.setState({
            selectSearchContent: e.target.value
        })
    }
    //交易对切换触发
    linkTap(coinid, paycoinid, cointype, paycointype) {
        this.props.dispatch(routerRedux.push(`/transactionAdvanced/${coinid}/${paycoinid}/${cointype}/${paycointype}`));
        window.Pair=`${cointype}/${paycointype}`;
        //window.location.replace(`${window.location.origin}/#/transactionAdvanced/${coinid}/${paycoinid}/${cointype}/${paycointype}`)
        setTimeout(() => {
            window.location.reload()
        }, 200)

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
                        >{item.fluctuation}%</span>
                    </a>
                )
            })
        }
        return res
    }

    coinSelectShow(e) {
        this.setState({
            coinSelectPanel: !this.state.coinSelectPanel
        })
        e.nativeEvent.stopImmediatePropagation()
    }
    toggleModal() {
        this.setState({
            precisionModelDisplay: false,
            coinSelectPanel: false
        })
    }

    componentWillMount() {
        const {cointype,paycointype}=this.props.match.params;
        if (cointype&&paycointype){
            window.Pair=cointype+"/"+paycointype;
        } else {
            window.Pair=`BTC/USDT`;
        }
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
    clearHelpButton(){
        let countInex=0;
        let launcher = document.getElementById("launcher");
        if (launcher) {
            launcher.style.display = 'none';
           return
        }
     let interval=setInterval(()=>{
            countInex++;
         let launcher = document.getElementById("launcher");
           if (launcher) {
               launcher.style.display = 'none';
               clearInterval(interval)
           }
           if (countInex===100){
               clearInterval(interval)
           }
       },1000)
    }
    tradepairSocket = undefined;
    quotationSocket = undefined;
    componentDidMount() {
        //去掉帮助浮框
        this.clearHelpButton();
        // let launcher = document.getElementById("launcher");
        // if (launcher) {
        //     launcher.style.display = 'none'
        // }

        document.addEventListener('click', this.toggleModal)
        this.requestStatus.status = true;
        const _this = this;
        let coinid = this.props.match.params.coinid ? this.props.match.params.coinid : 3;
        let paycoinid = this.props.match.params.paycoinid ? this.props.match.params.paycoinid : 2;

        let tradepairId = coinid + '_' + paycoinid;
        const {cointype,paycointype}=this.props.match.params;
        //存储当前选择的交易地
        if (cointype&&paycointype){
            window.Pair=cointype+"/"+paycointype;
        } else {
            window.Pair=`BTC/USDT`;
        }

        this.setState({
            tradepairId: tradepairId
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
        this.fetchMarketList({});
        this.fetchCoinBalance('coinid', { coinid: coinid });
        this.fetchCoinBalance('paycoinid', { coinid: paycoinid });
        this.fetchCoinExchangeRate('coinid', { coinid: coinid });
        this.fetchCoinExchangeRate('paycoinid', { coinid: paycoinid });
        //定时刷新资产余额
        if (tokenVerify()){
            this.setIntervalAsset();
        }
        try {
            this.quotationSocket = socket(data => {
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
                    requestStatus: _this.requestStatus
                });
            this.tradepairSocket = socket(data => {
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
                    requestStatus: _this.requestStatus
                })
        } catch (err) {
            throw new Error(err);
        }

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
                    if (data.data.list && data.data.list.length > 0) {
                        let positions = data.data.list[0].positions
                        if (coinType === 'coinid') {
                            this.setState({ coinTotalAmountSell: parseFloat(positions) })
                        } else if (coinType === 'paycoinid') {
                            this.setState({ coinTotalAmountBuy: parseFloat(positions) })
                        }
                    } else {
                        let positions = 0
                        if (coinType === 'coinid') {
                            this.setState({ coinTotalAmountSell: parseFloat(positions) })
                        } else if (coinType === 'paycoinid') {
                            this.setState({ coinTotalAmountBuy: parseFloat(positions) })
                        }
                    }

                } else {

                }
            }
        })
    }

    fetchCoinExchangeRate(coinType, params) {
        this.props.dispatch({
            type: 'transaction/fetchCoinExchangeRate',
            payload: params,
            callback: (data) => {
                if (data.success) {
                    if (coinType === 'coinid') {
                        this.setState({
                            coinExchangeRate: data.data.rmbrate
                        })
                    } else if (coinType === 'paycoinid') {
                        this.setState({
                            paycoinExchangeRate: data.data.rmbrate
                        })
                    }

                }
            }
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
                    entrusttype: (type ? 2 : 1),
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
                        this.fetchCoinBalance('coinid', { coinid: this.state.coinid })
                        this.fetchCoinBalance('paycoinid', { coinid: this.state.paycoinid })
                    } else {
                      Notification({
                            title:intl.get('Reminder'),
                            type: 'error',
                            message: intl.get(response.msg)+""+(response.data&&response.data.lang_value?response.data.lang_value:""),
                            duration: 2000
                        });
                        this.fetchCoinBalance('coinid', { coinid: this.state.coinid })
                        this.fetchCoinBalance('paycoinid', { coinid: this.state.paycoinid })
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
                    entrusttype: (type ? 2 : 1),
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
                        this.fetchCoinBalance('coinid', { coinid: this.state.coinid })
                        this.fetchCoinBalance('paycoinid', { coinid: this.state.paycoinid })
                    } else {
                        Notification({
                            title:intl.get('Reminder'),
                            type: 'error',
                            message: intl.get(response.msg),
                            duration: 2000
                        });
                        this.fetchCoinBalance('coinid', { coinid: this.state.coinid })
                        this.fetchCoinBalance('paycoinid', { coinid: this.state.paycoinid })
                    }
                }
            })
        }

    }
    //获得资产总数
    getAllMyAsset(){
      this.fetchCoinBalance('coinid', { coinid: this.state.coinid })
      this.fetchCoinBalance('paycoinid', { coinid: this.state.paycoinid })
    }
    setIntervalAsset(){
        if (IntervalAsset){
            clearInterval(IntervalAsset)
        }
        IntervalAsset=setInterval(()=>{
            console.log(11);
            this.getAllMyAsset();
        },2000)
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.toggleModal, false)
        this.requestStatus.status = false;
        if (this.quotationSocket) {
            this.quotationSocket.close()
        }
        if (this.tradepairSocket) {
            this.tradepairSocket.close()
        }
        if (IntervalAsset){
            clearInterval(IntervalAsset)
        }
    }

    vipTypeDisplay(type, endDate) {
        type = parseInt(type)
        if (type === 1) {
            return (
                <span
                    className={styles.openVip}
                    onClick={() => this.setState({ rechargeDialogVisible: true })}
                >开通VIP加速升级</span>
            )
        } else {
            return (
                <span className={styles.vipType}>
                    <VipType vipType={type} />
                    <span className={styles.endDate}>{formatTime('yyyy-MM-dd', endDate)}</span>
                </span>

            )
        }
    }
    precisionModelDisplay(e) {
        this.setState({ precisionModelDisplay: !this.state.precisionModelDisplay })
        e.nativeEvent.stopImmediatePropagation()
    }

    newestTradeList() {
        let res = []
        this.props.transaction.newTransReco.forEach((item, index) => {
            res.push(
                <li className={styles.transactionItem} key={index} style={{display:'flex'}}>
                    <span className={item.type === '1' || item.type === 1 ? styles.tradeAmountIn : styles.tradeAmountOut}> <span>{item.price}</span></span>
                    <span className={styles.tradePrice}>{item.volume}</span>
                    <span className={styles.tradeTime}>{item.time}</span>
                </li>
            )
        });

        return res
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
        const {tradepair} =this.props.home.currentTradepair;
        // const {} =limitDecimal(tradepair,e.target.value,1)
        this.setState({ limitPriceBuyPercent: str })
        let canbuyAmount = parseFloat(this.state.coinTotalAmountBuy) / 1.002 / parseFloat(price);
        let canbuyAmountMarket = parseFloat(this.state.coinTotalAmountBuy) / 1.001 / parseFloat(price) / 1.1;
        if (type === 'buy') {

            if (this.state.chartPanelDataTypeDisplay === 0) {
                this.setState({
                    // entrustBuyAmountLimitPrice: (canbuyAmount * percent).toFixed(4),
                    //entrustSellAmountLimitPrice: (this.state.coinTotalAmountSell * percent).toFixed(6)
                    entrustBuyAmountLimitPrice: limitDecimal(tradepair,(canbuyAmount * percent),1)
                })

            } else if (this.state.chartPanelDataTypeDisplay === 1) {
                this.setState({
                    // entrustBuyAmountMarketPrice: (canbuyAmountMarket * percent).toFixed(4),
                    //entrustSellAmountMarketPrice: (this.state.coinTotalAmountSell * percent).toFixed(6)
                    entrustBuyAmountMarketPrice:  limitDecimal(tradepair,(canbuyAmountMarket * percent),1)
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

    transactionIncreaseListDisplay() {
        let res = []

        this.props.transaction.commissionListSell.forEach((item, index) => {
            let totalAmount = parseFloat(item.price) * parseFloat(item.volume)
            totalAmount = totalAmount > 1 ? totalAmount.toFixed(5) : totalAmount.toFixed(8)
            res.push(
                <li
                    className={styles.transactionItem} key={index}
                    onClick={this.setEntrustPrice.bind(this, item)}
                >
                    <span className={styles.transactionPrice}>{item.price}</span>
                    <span className={styles.transactionQuantity}>{item.volume}</span>
                    <span className={styles.transactionAmount}>
                        {item.turnover}
                    </span>
                </li>
            )
        })
        return res
    }

    transactionDecreaseListDisplay() {
        let res = []
        this.props.transaction.commissionListBuy.forEach((item, index) => {
            let totalAmount = parseFloat(item.price) * parseFloat(item.volume)
            totalAmount = totalAmount > 1 ? totalAmount.toFixed(5) : totalAmount.toFixed(8)
            res.push(
                <li
                    className={styles.transactionItem} key={index}
                    onClick={this.setEntrustPrice.bind(this, item)}
                >
                    <span className={styles.transactionPrice}>{item.price}</span>
                    <span className={styles.transactionQuantity}>{item.volume}</span>
                    <span className={styles.transactionAmount}>
                        {item.turnover}
                    </span>
                </li>
            )
        })
        return res
    }

    transactionAssetAmounts(price, amount) {
        let total
        if (price && amount) {
            total = parseFloat(price) * parseFloat(amount)
            total = total > 1 ? total.toFixed(2) : total.toFixed(6)
        }
        return total
    }

    //箭头表示涨跌，socket的变化
    arrowDirection(type) {
        const  nowPrice=Number((this.props.home.currentTradepair.nowprice || '').split('/')[0]).toFixed(getDecimal(window.Pair));
        if (type === 1 || type === '1') {
            return (
                <span className={styles.percentVary} style={{ color: '#4ac8b1' }}>
                    <span>{nowPrice}</span>
                    <Icon type='upblod' color='#4ac8b1' size='13' />
                </span>

            )
        } else if (type === -1 || type === '-1') {
            return (
                <span className={styles.percentVary} style={{ color: '#ec3833' }}>
                    <span>{nowPrice}</span>
                    <Icon type='xiangshang-copy' color='#ec3833' size='13' />
                </span>
            )

        } else {
            return (
                <span className={styles.percentVary} style={{ color: '#ffffff' }}>
                    <span>{nowPrice}</span>
                </span>
            )
        }
    }

    //24h波动量
    dayWaveDisplay(price, percent) {
        // frist price

        let princeLen;
        let fristprice;
        let prev;

        if (price && percent) {
          const  decimal=price.split('/')[0].split('.')[1];
          if(decimal){
            princeLen=decimal.length
          }
            fristprice = parseFloat(price.split('/')[0]) * (1 + percent / 100)
            prev = fristprice * percent / 100;
            // if (prev > 1 || prev < -1) {
            //     prev = prev.toFixed(princeLen)
            // } else {
            //     prev = prev.toFixed(princeLen)
            // }
          if (princeLen){
            prev = prev.toFixed(princeLen)
          }
        }
        return prev;

    }

    logout() {
        clearUserInfo();
        this.props.dispatch({
            type: 'user/fetchLoginOut',
            payload: {},
            callback: (data) => {
                if (data.success) {
                    Notification({
                        title:intl.get('Reminder'),
                        type: 'success',
                        message: intl.get('Logout_success'),
                        duration: 2000
                    });

                    setTimeout(() => {
                        window.location.href = '/'
                    }, 2000)
                }
            }
        })
    }

    computedActiveDays(level, type, viptype) {
        let speedup = 1

        if (type === 'days') {
            let nextLevel = (parseInt(level) + 1) * (parseInt(level) + 1) + 4 * (parseInt(level) + 1)
            let curLevel = parseInt(level) * parseInt(level) + 4 * parseInt(level)
            let thisLevelDays = nextLevel - curLevel
            let needDays = ((nextLevel - parseInt(this.props.user.activeday)) / speedup).toFixed(0)
            return needDays
        }
    }

    render() {
        return (
            <div className={styles.normal}>
                <div className={styles.header}>
                    <Link to='/' className={styles.icon}>
                        <img className={styles.qqto} src={logo} alt="" />
                    </Link>
                    <div className={styles.chartsHeader}>
                        <div className={styles.coinType} onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
                            <p onClick={(e) => this.coinSelectShow(e)}>
                                <span>{this.props.home.currentTradepair.tradepair}</span>
                                <span className={this.state.coinSelectPanel ? styles.rotate : styles.rotate1}>
                                    <Icon type='xialajiantouxiangxia' color='#4ac8b1' size='17' />
                                </span>
                            </p>
                            <p>{this.props.home.currentTradepair.fullname}</p>
                            <div className={this.state.coinSelectPanel ? styles.display + " " + styles.coinSelect : styles.coinSelect}>
                                <p className={styles.tradeCouple}>
                                    <span
                                        className={this.state.tradeCoupleItem === 'MarketMain' ? styles.selected : ''}
                                        onClick={() => this.setState({ tradeCoupleItem: 'MarketMain' })}
                                    >{intl.get("MOTHERBOARD")}</span>
                                    {/* <span
                                        className={this.state.tradeCoupleItem === 'CT' ? styles.selected : ''}
                                        onClick={() => this.setState({ tradeCoupleItem: 'CT' })}
                                    >CT</span> */}
                                    {/*<span*/}
                                        {/*className={this.state.tradeCoupleItem === 'USDT' ? styles.selected : ''}*/}
                                        {/*onClick={() => this.setState({ tradeCoupleItem: 'USDT' })}*/}
                                    {/*>USDT</span>*/}
                                    {/*<span*/}
                                        {/*className={this.state.tradeCoupleItem === 'BTC' ? styles.selected : ''}*/}
                                        {/*onClick={() => this.setState({ tradeCoupleItem: 'BTC' })}*/}
                                    {/*>BTC</span>*/}
                                    {/*<span*/}
                                        {/*className={this.state.tradeCoupleItem === 'ETH' ? styles.selected : ''}*/}
                                        {/*onClick={() => this.setState({ tradeCoupleItem: 'ETH' })}*/}
                                    {/*>ETH</span>*/}
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
                                        <ul className={this.state.tradeCoupleItem === 'MarketMain' ? styles.transactionInfo : ''}>
                                            {this.selectPanelListDiplay(this.props.home.MarketMain)}
                                        </ul>
                                        {/* <ul className={this.state.tradeCoupleItem === 'CT' ? styles.transactionInfo : ''}>
                                            {this.selectPanelListDiplay(this.props.home.qqMarket)}
                                        </ul> */}
                                        {/*<ul className={this.state.tradeCoupleItem === 'USDT' ? styles.transactionInfo : ''}>*/}
                                            {/*{this.selectPanelListDiplay(this.props.home.usdtMarket)}*/}
                                        {/*</ul>*/}
                                        {/*<ul className={this.state.tradeCoupleItem === 'BTC' ? styles.transactionInfo : ''}>*/}
                                            {/*{this.selectPanelListDiplay(this.props.home.btcMarket)}*/}
                                        {/*</ul>*/}
                                        {/*<ul className={this.state.tradeCoupleItem === 'ETH' ? styles.transactionInfo : ''}>*/}
                                            {/*{this.selectPanelListDiplay(this.props.home.ethMarket)}*/}
                                        {/*</ul>*/}
                                    </Scrollbar>
                                </div>
                            </div>
                        </div>
                        <div className={styles.coinInfo}>
                            <div className={styles.newestPrice}>
                                <p> <span>{this.props.home.currentTradepair.nowprice}</span> </p>
                                <p>{intl.get('LAST_PRICE')}</p>
                            </div>
                            <div className={styles.dayWave}>
                                <p className={parseFloat(this.props.home.currentTradepair.fluctuation) > 0 ? styles.increase : styles.decrease}>
                                    <span className={styles.fluctuationAmount}>
                                        {
                                            this.dayWaveDisplay(this.props.home.currentTradepair.nowprice, this.props.home.currentTradepair.fluctuation)
                                        }
                                    </span>
                                    <span>
                                        {this.props.home.currentTradepair.fluctuation ? this.props.home.currentTradepair.fluctuation + '%' : ''}
                                    </span>
                                </p>
                                <p>{intl.get('CHANGE_24')}</p>
                            </div>
                            <div className={styles.dayMax}>
                                <p> <span>{this.props.home.currentTradepair.high}</span> </p>
                                <p>{intl.get('HIGH_24')}</p>
                            </div>
                            <div className={styles.dayMin}>
                                <p> <span>{this.props.home.currentTradepair.low}</span> </p>
                                <p>{intl.get('LOW_24')}</p>
                            </div>
                            <div className={styles.dayAmount}>
                                <p> <span>{this.props.home.currentTradepair.volume}</span></p>
                                <p>{intl.get('VOLUME_24')}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.navInteractive}>
                        <TopCommon loginStatus={tokenVerify()}   />
                        <div style={{ display: tokenVerify() ? 'block' : 'none' }} className={styles.userInfo}>
                            <span className={styles.avatarContainer}>
                                <Avatar avatarSize='28' level={this.props.user.level} />
                            </span>
                            <span className={styles.userName}>
                                {this.props.user.nickname.trim() ? this.props.user.nickname : ''}
                            </span>
                            <span className={styles.userPanel}>
                                <span className={styles.userPanelBody}>
                                    <span className={styles.avatar}>
                                        <Avatar avatarSize='64' level={this.props.user.level} />
                                    </span>
                                    <span className={styles.infomation}>
                                        <span className={styles.username}>
                                            {this.props.user.nickname.trim() ? this.props.user.nickname : ''}
                                            <span className={styles.level}>
                                                <img src={images.level} />
                                                <span className={styles.levelNumber}>{this.props.user.level}</span>
                                            </span>
                                        </span>
                                        <span className={styles.email}>{this.props.user.email}</span>
                                        <span className={styles.activeDays}>{intl.get('CURRENTLY_ACTIVE')}：{this.props.user.activeday}{intl.get('DAY')}</span>
                                        <span className={styles.activeDays}>{intl.get("UPGRADE_REQUIRES")}：{this.computedActiveDays(this.props.user.level, 'days', 1)}{intl.get('DAY')}</span>
                                        {/* <span className={styles.vip}>
                                            {this.vipTypeDisplay(this.props.user.viptype, this.props.user.overduetime)}
                                        </span> */}
                                    </span>
                                </span>
                                <span className={styles.userPanelFooter}>
                                    <Link to='/manager'>{intl.get('USER_CENTER')}</Link>
                                    <span onClick={(e) => this.logout()}>{intl.get('SIGN_OUT')}</span>
                                </span>
                            </span>
                            {/* <span
                                className={styles.logout}
                                onClick={(e) => this.logout()}
                            >退出</span> */}
                        </div>
                    </div>
                </div>
                <div className={styles.container}>
                    <div className={styles.mainSection}>
                        <div className={styles.charts}>
                            <TVChartContainer
                                tradepair={(this.state.cointype + '_' + this.state.paycointype
                                    + '_' + this.state.coinid + '_' + this.state.paycoinid) || 'BTC_USDT_3_2'}
                            />
                        </div>
                        <div className={tokenVerify() ? styles.bottomBanner : styles.bottomBannerHidden}>
                            <Commission filters={this.state.currentFilterTradepair} getAllMyAsset={this.getAllMyAsset}  />
                        </div>
                    </div>
                    <div className={styles.totalSections}>
                        <div className={styles.sections}>
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

                                </div>
                                <div className={styles.dataTitle}>
                                    <span className={styles.transactionPrice}>{intl.get("PRICE")}({(this.props.home.currentTradepair.tradepair || '').split('/')[1]})</span>
                                    <span className={styles.transactionQuantity} style={{textAlign:'right'}}>{intl.get('AMOUNT')}</span>
                                    <span className={styles.transactionAmount}>{intl.get("TOTAL")}({(this.props.home.currentTradepair.tradepair || '').split('/')[1]})</span>
                                </div>
                                <div className={styles.dataSectionPanel}>
                                    <ul className={
                                        this.state.dataSectionPanelAll || this.state.decreaseDataSectionPanelAll ? styles.transactionInfo + " " + styles.transactionDecrease : ''
                                    }>
                                        {this.transactionIncreaseListDisplay()}
                                    </ul>
                                    <ul style={{ display: 'block' }} className={styles.transactionInfo + " " + styles.transactionInfonow}>
                                        <h5 className={styles.totalAnalysis}>
                                            {
                                                this.arrowDirection(this.props.home.currentTradepair.change)
                                            }

                                            <span className={styles.priceVary}>
                                                <span>{(this.props.home.currentTradepair.nowprice || '').split('￥')[1]} CNY</span>
                                            </span>
                                            <p className={styles.moreTransactionPair}>
                                                <Link to={`/transactionDetails/${this.state.coinid}/${this.state.paycoinid}/${this.state.cointype}/${this.state.paycointype}`}>
                                                  {intl.get("MORE")}
                                                </Link>
                                            </p>
                                        </h5>
                                    </ul>

                                    <ul className={this.state.dataSectionPanelAll || this.state.increaseDataSectionPanelAll ? styles.transactionInfo + " " + styles.transactionIncrease : ''}>
                                        {this.transactionDecreaseListDisplay()}
                                    </ul>

                                </div>

                            </div>
                            <div className={styles.section + " " + styles.sectionRight}>
                                <div className={styles.newestTrade}>
                                    <h5 className={styles.newestTitle}><span>{intl.get("Exchange_Market_Trades")}</span> </h5>
                                    <li className={styles.dataTitle} style={{ padding: '0 16px',display:'flex' }}>
                                        <span
                                            style={{ flex:1, marginLeft: '0px' }}
                                            className={styles.transactionPrice}
                                        >{intl.get('PRICE')}</span>
                                        <span
                                            style={{ flex:1 }}
                                            className={styles.transactionQuantity}
                                        >{intl.get('AMOUNT')}</span>
                                        <span
                                            style={{ marginRight: '6px',width:50 }}
                                            className={styles.transactionAmount}
                                        >{intl.get('TIME')}</span>
                                    </li>
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
                        <div className={styles.transaction}>
                            <div className={styles.transactionTitle + " " + styles.bannerHeader}>
                                <span
                                    className={this.state.chartPanelDataTypeDisplay === 0 ? styles.actived : ''}
                                    onClick={() => this.setState({ chartPanelDataTypeDisplay: 0 })}
                                >{intl.get("Exchange_Limit")}</span>
                                <span
                                    className={this.state.chartPanelDataTypeDisplay === 1 ? styles.actived : ''}
                                    onClick={() => this.setState({ chartPanelDataTypeDisplay: 1 })}
                                >{intl.get("Exchange_Market")}</span>
                                {/* <span
                                    className={this.state.chartPanelDataTypeDisplay === 2 ? styles.actived : ''}
                                    onClick={() => this.setState({ chartPanelDataTypeDisplay: 2 })}
                                >止盈止损</span> */}
                            </div>
                            <div style={{ display: (tokenVerify() ? 'block' : 'none') }}>
                                <div className={styles.assetBalance}>
                                    <div className={styles.section}>
                                        <span className={styles.title}>{(this.props.home.currentTradepair.tradepair || '').split('/')[1]}   {intl.get("ASSETS")}：</span>
                                        <span className={styles.assetBalanceValue}>{this.state.coinTotalAmountBuy}</span>
                                    </div>
                                    <div className={styles.section}>
                                        <span className={styles.title}>{(this.props.home.currentTradepair.tradepair || '').split('/')[0]}   {intl.get("ASSETS")}：</span>
                                        <span className={styles.assetBalanceValue}>{this.state.coinTotalAmountSell}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.transactionDetails}>
                                <div className={this.state.chartPanelDataTypeDisplay === 0 ? styles.display : ''}>
                                    <div>
                                        <div className={styles.purchase + " " + styles.transactions}>
                                            <div className={styles.purchasePrice}>
                                                <p>{intl.get("Exchange_Buy_Price")}</p>
                                                <p>
                                                    <input
                                                        autoComplete="off"
                                                        onChange={(e) => this.setState({ entrustBuyPriceLimitPrice: (parseFloat(e.target.value) <= 100000 && parseFloat(e.target.value) >= 0 ?getDigits(this.props.home.currentTradepair.tradepair,e.target.value,0) : '') })}
                                                        type="number"
                                                        step='0.00001'
                                                        value={getDigits(this.props.home.currentTradepair.tradepair,this.state.entrustBuyPriceLimitPrice,0)}
                                                        className={this.state.inputEmptyLimit1 ? '' : styles.error}
                                                        onBlur={(e) => this.inputEmptyVerify(e, 'limit1')}
                                                    />
                                                    {/*<span className={styles.exchangeRate}>
                                                        ￥{this.state.entrustBuyPriceLimitPrice
                                                            ? (parseFloat(this.state.paycoinExchangeRate) * parseFloat(this.state.entrustBuyPriceLimitPrice)).toFixed(6) : (0.000000).toFixed(6)}
                                                    </span>*/}
                                                    <span className={styles.currencyUnit}>
                                                        {(this.props.home.currentTradepair.tradepair || '').split('/')[1]}
                                                    </span>
                                                </p>
                                                {/* <p>≈ 44266.11 CNY</p> */}
                                            </div>
                                            <div className={styles.purchase + " " + styles.amount}>
                                                <p>{intl.get("Exchange_Buy_Amount")}</p>
                                                <p>
                                                    <input
                                                        autoComplete="off"
                                                        onChange={(e) => {
                                                          this.setState({
                                                            entrustBuyAmountLimitPrice: (parseFloat(e.target.value) <= 10000000 && parseFloat(e.target.value) >= 0 ? limitDecimal(this.props.home.currentTradepair.tradepair,e.target.value,1) : '')
                                                        })}}
                                                        type="number"
                                                        value={this.state.entrustBuyAmountLimitPrice}
                                                        className={this.state.inputEmptyLimit2 ? '' : styles.error}
                                                        onBlur={(e) => this.inputEmptyVerify(e, 'limit2')}

                                                    />

                                                    {/* <span className={styles.maxValueAction}>
                                                        最多买入
                                                            {parseFloat(this.state.entrustBuyPriceLimitPrice) ?
                                                            this.state.coinTotalAmountBuy / parseFloat(this.state.entrustBuyPriceLimitPrice) : '0.000000'}
                                                    </span> */}
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
                                                <span>{intl.get("Exchange_Transaction_Amount")}</span>
                                                <span>{

                                                    this.transactionAssetAmounts(this.state.entrustBuyPriceLimitPrice, this.state.entrustBuyAmountLimitPrice)
                                                }</span>
                                                <span>{(this.props.home.currentTradepair.tradepair || '').split('/')[1]}</span>
                                                <span className={
                                                    (1.001 * (parseFloat(this.state.entrustBuyAmountLimitPrice) || 0)
                                                        * (parseFloat(this.state.entrustBuyPriceLimitPrice) || 0)).toFixed(4) > this.state.coinTotalAmountBuy ?
                                                        styles.insufficientBalance + ' ' + styles.display : styles.insufficientBalance}
                                                >{intl.get("INSUFFICIENT_ACCOUNT_BALANCE")}</span>
                                            </div>
                                            {
                                                tokenVerify() ?
                                                    <button
                                                        className={styles.purchaseAction}
                                                        onClick={
                                                            (e) => this.buyCoin(this.state.entrustBuyPriceLimitPrice, this.state.entrustBuyAmountLimitPrice)
                                                        }
                                                    >{intl.get("BUY")}<span>{(this.props.home.currentTradepair.tradepair || '').split('/')[0]}</span></button>
                                                    :
                                                    <Link to='/newlogin' className={styles.purchaseAction}>{intl.get("LOGIN")}</Link>
                                            }
                                        </div>
                                        <div className={styles.sellOut + " " + styles.transactions}>
                                            <div className={styles.sellOutPrice}>
                                                <p>{intl.get("Exchange_Sell_Price")}</p>
                                                <p>
                                                    <input
                                                        autoComplete="off"
                                                        onChange={(e) => this.setState({ entrustSellPriceLimitPrice: (parseFloat(e.target.value) <= 100000 && parseFloat(e.target.value) >= 0 ? getDigits(this.props.home.currentTradepair.tradepair,e.target.value,0) : '') })}
                                                        type="number"
                                                        step='0.00001'
                                                        value={getDigits(this.props.home.currentTradepair.tradepair,this.state.entrustSellPriceLimitPrice,0)}
                                                        className={this.state.inputEmptyLimit3 ? '' : styles.error}
                                                        onBlur={(e) => this.inputEmptyVerify(e, 'limit3')}
                                                    />
                                                    {/*<span className={styles.exchangeRate}>
                                                        ￥{this.state.entrustBuyPriceLimitPrice
                                                            ? (parseFloat(this.state.paycoinExchangeRate) * parseFloat(this.state.entrustBuyPriceLimitPrice)).toFixed(6) : (0.000000).toFixed(6)}
                                                    </span>*/}
                                                    <span className={styles.currencyUnit}>
                                                        {(this.props.home.currentTradepair.tradepair || '').split('/')[1]}
                                                    </span>
                                                </p>
                                                {/* <p>≈ 44266.11 CNY</p> */}
                                            </div>
                                            <div className={styles.sellOut + " " + styles.amount}>
                                                <p>{intl.get("Exchange_Sell_Amount")}</p>
                                                <p>
                                                    <input
                                                        autoComplete="off"
                                                        onChange={(e) => this.setState({
                                                            entrustSellAmountLimitPrice: parseFloat(e.target.value) <= 10000000 && parseFloat(e.target.value) >= 0 ? limitDecimal(this.props.home.currentTradepair.tradepair,e.target.value,1) : ''
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
                                                <span>{intl.get("Exchange_Transaction_Amount")}</span>
                                                <span>{
                                                    this.transactionAssetAmounts(this.state.entrustSellPriceLimitPrice, this.state.entrustSellAmountLimitPrice)
                                                }</span>
                                                <span>{(this.props.home.currentTradepair.tradepair || '').split('/')[1]}</span>
                                                <span className={
                                                    (parseFloat(this.state.entrustSellAmountLimitPrice) || 0) > this.state.coinTotalAmountSell ?
                                                        styles.insufficientBalance + ' ' + styles.display : styles.insufficientBalance}
                                                >{intl.get("INSUFFICIENT_ACCOUNT_BALANCE")}</span>

                                            </div>
                                            {
                                                tokenVerify() ?
                                                    <button
                                                        className={styles.sellOutAction}
                                                        onClick={
                                                            (e) => this.sellCoin(this.state.entrustSellPriceLimitPrice, this.state.entrustSellAmountLimitPrice)
                                                        }
                                                    >{intl.get("SELL")}
                                                        <span>&nbsp;{(this.props.home.currentTradepair.tradepair || '').split('/')[0]}</span>
                                                    </button>
                                                    :
                                                    <Link to='/newlogin' className={styles.sellOutAction}>{intl.get("LOGIN")}</Link>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={this.state.chartPanelDataTypeDisplay === 1 ? styles.display : ''}>
                                    <div>
                                        <div className={styles.purchase + " " + styles.transactions}>
                                            <div className={styles.purchasePrice}>
                                                <p>{intl.get("Exchange_Buy_Price")}</p>
                                                <p>
                                                    <input
                                                        autoComplete="off"
                                                        //onChange={(e) => this.setState({ entrustBuyPriceMarketPrice: e.target.value })}
                                                        type="text"
                                                        value={intl.get("BUY_AT_THE_BEST_MARKET_PRICE")}
                                                        readOnly='readOnly'
                                                        className={styles.disableType}
                                                    />
                                                    <span className={styles.currencyUnit}>
                                                        {(this.props.home.currentTradepair.tradepair || '').split('/')[1]}
                                                    </span>
                                                </p>
                                                {/* <p>≈ 44266.11 CNY</p> */}
                                            </div>
                                            <div className={styles.purchase + " " + styles.amount}>
                                                <p>{intl.get("Exchange_Buy_Amount")}</p>
                                                <p>
                                                    <input
                                                        autoComplete="off"
                                                        onChange={(e) => this.setState({ entrustBuyAmountMarketPrice: (parseFloat(e.target.value) <= 10000000 && parseFloat(e.target.value) >= 0 ?limitDecimal(this.props.home.currentTradepair.tradepair,e.target.value,1) : '') })}
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
                                                    (1.001 * 1.1 * (parseFloat(this.state.entrustBuyAmountMarketPrice) || 0) * (parseFloat(((this.props.home.currentTradepair.nowprice || '').split('/')[0] || '').price) || 0)).toFixed(4)
                                                        > this.state.coinTotalAmountBuy ? styles.insufficientBalance + ' ' + styles.display : styles.insufficientBalance}
                                                >{intl.get("BUY_AT_THE_BEST_MARKET_PRICE")}</span>
                                            </div>
                                            {
                                                tokenVerify() ?
                                                    <button
                                                        className={styles.purchaseAction}
                                                        onClick={
                                                            (e) => this.buyCoin((this.props.home.currentTradepair.nowprice || '').split('/')[0], this.state.entrustBuyAmountMarketPrice, true)
                                                        }
                                                    >{intl.get("BUY")}
                                                        <span>{(this.props.home.currentTradepair.tradepair || '').split('/')[0]}</span>
                                                    </button>
                                                    :
                                                    <Link to='/newlogin' className={styles.purchaseAction}>{intl.get("LOGIN")}</Link>
                                            }
                                        </div>
                                        <div className={styles.sellOut + " " + styles.transactions}>
                                            <div className={styles.sellOutPrice}>
                                                <p>{intl.get("Exchange_Sell_Price")}</p>
                                                <p>
                                                    <input
                                                        autoComplete="off"
                                                        // onChange={(e) => this.setState({ entrustSellPriceMarketPrice: e.target.value })}
                                                        type="text"
                                                        //value={this.state.entrustSellPriceMarketPrice}
                                                        value={intl.get("SELL_AT_THE_BEST_MARKET_PRICE")}
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
                                                <p>{intl.get("Exchange_Sell_Amount")}</p>
                                                <p>
                                                    <input
                                                        autoComplete="off"
                                                        onChange={(e) => this.setState({ entrustSellAmountMarketPrice: (parseFloat(e.target.value) <= 10000000 && parseFloat(e.target.value) >= 0 ? limitDecimal(this.props.home.currentTradepair.tradepair,e.target.value,1) : '') })}
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
                                                >{intl.get("YOUR_ACCOUNT_BALANCE_IS_INSUFFICIENT")}</span>
                                            </div>
                                            {
                                                tokenVerify() ?
                                                    <button
                                                        onClick={
                                                            (e) => this.sellCoin((this.props.home.currentTradepair.nowprice || '').split('/')[0], this.state.entrustSellAmountMarketPrice, true)
                                                        }
                                                        className={styles.sellOutAction}
                                                    >{intl.get("BUY_OUT")}
                                                        <span>{(this.props.home.currentTradepair.tradepair || '').split('/')[0]}
                                                        </span>
                                                    </button>
                                                    :
                                                    <Link to='/newlogin' className={styles.sellOutAction}>{intl.get("LOGIN")}</Link>
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
                                                <span>999999.00</span>
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
                                            <div className={styles.transactionAmounts}><span>交易额</span><span>999.00</span><span>USDT</span></div>
                                            <button className={styles.sellOutAction}>卖出<span>BTC</span></button>
                                        </div>
                                    </div>
                                </div> */}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        )
    }

}
