import React, {PureComponent} from 'react'
import {connect} from 'dva'
import {Link} from 'dva/router'
import images from '../../common/images'
import Icon from '../../components/Icon'
import {tokenVerify, formatTime, createScript} from '../../utils'
import {WS_URL as socketUrl} from '../../common/global'
import speaker from "../../assets/images/speaker.png"
import publicity from "../../assets/images/lpublicity.png"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import {socket} from '../../services/socket'
import SwiperBox from './SwiperBox'
import PersonalBillboard from './PersonalBillboard'
import styles from './index.less'
import intl from 'react-intl-universal'
import android from '../../assets/images/android.png';
import apple from '../../assets/images/apple.png';
import NewFooter from "../../components/Footer/NewFooter";
import {Notification} from "element-react";
//import "https://static.zdassets.com/ekr/snippet.js?key=db122a30-a454-4d39-8e16-b6a30683cf41"
@connect(state => ({
    user: state.user,
    home: state.home,
}))
export default class Home extends PureComponent {
    state = {
        decreaseBillboards: null,
        increaseBillboard: null,
        profitTopboardList: null,
        yesterdayProfitTopboardList: null,
        profitTopboards: [],
        yesterdayProfitTopboards: [],
        billboardType: 1,
        markeType: 1,
        searchContent: '',
        myYesterdayProfit: '',
        profitType: 2,
        Ranges: [],
        Franks: [],
        sumiss: {},
        lazyStop: true, // false
    }

    tradepairSocket = undefined
    requestStatus = {
        status: true
    }

    boardListFilter(e) {
        this.setState({
            searchContent: e.target.value
        })
    }

    componentDidMount() {
        // console.log(this.props)
        createScript('https://static.zdassets.com/ekr/snippet.js?key=095a696f-dd1c-4cda-8539-fbde6b36f676', function () {
            console.log('OK');
        });
        let launcher = document.getElementById("launcher");
        if (launcher) {
            launcher.style.display = 'block'
        }
        this.requestStatus.status = true
        this.initFetch();
        this.lazyFetch();
        this.getBannerAndNews();
        document.body.style.backgroundImage = 'none';
    }

    componentWillReceiveProps(nextProps) {
        this.increaseBillboard(nextProps.home.increaseBillboards);
        this.decreaseBillboard(nextProps.home.decreaseBillboards);
    }

    componentWillUnmount() {
        let launcher = document.getElementById("launcher");
        if (launcher) {
            launcher.style.display = 'none'
        }
        this.requestStatus.status = false;
        if (this.tradepairSocket) {
            this.tradepairSocket.close()
        }

    }
     getBannerAndNews(){
         this.props.dispatch({
             type: 'home/getBannerNews',
             payload: {},
             callback:  (data)=> {
                console.log(data)
             }
         })
     }
    initFetch() {
        this.fetchFavorites()
        // this.fetchAnnounce()
        // this.fetchList()
        // this.increaseBillboard()
        // this.profitTopboard()
    }

    lazyFetch() {
        const _this = this
        setTimeout(() => {
            this.fetchCoin()
            this.fetchList({})
            this.fetchAnnounce()
            this.fetchYesterdayProfit({})
            this.fetchProfitNewsBoard({})
            this.profitNewsTopBoard()
            this.yesterdayProfitNewsTopBoard()
            this.fetchRang();
            // this.fetchgetFranks();
            this.fetchgetissue();
        }, 200)
        setTimeout(() => {
            console.log(socketUrl)
            this.tradepairSocket = socket(data => {
                if (data) {
                    // console.log(`这里是ws推过来的消息：`, JSON.parse(data))
                    this.props.dispatch({
                        type: 'home/webSocket',
                        payload: JSON.parse(data),
                        callback: (res) => {
                            // debugger

                        }
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

        }, 1000)
    }

    fetchFavorites() {
        const _this = this
        this.props.dispatch({
            type: 'home/fetchFavorites',
            payload: {},
            callback: function (data) {
                if (data.success && data.data.length > 0) {

                    window.localStorage.setItem('_favorite_', '')
                    let favorites = data.data.toString()
                    window.localStorage.setItem('_favorite_', favorites)
                } else {
                    window.localStorage.setItem('_favorite_', '')
                }
                _this.fetchMarketList()
            }
        })
    }

    fetchCoin() {
        /* this.props.dispatch({
          type: 'global/fetchCoinType',
        }) */
        this.props.dispatch({
            type: 'global/fetchCoin',
            payload: {}
        })
    }

    fetchgetissue() {
        this.props.dispatch({
            type: 'home/getissues',
            payload: {},
            callback: (data) => {
                console.log(data);
                if (data.success) {
                    this.setState({sumiss: data.data})
                    // this.setState({Ranges:data.data})
                    // this.fetchGetFranks(data.data);
                }
            }
        })
    }

    //推荐
    fetchgetFranks() {
        this.props.dispatch({
            type: 'home/getFranks',
            payload: {},
            callback: (data) => {
                console.log(data);
                if (data.success) {
                    // this.setState({Ranges:data.data})
                    this.fetchGetFranks(data.data);
                }
            }
        })
    }

    fetchGetFranks = async (data) => {
        let res = []
        let decreaseBillboards = data;
        let length = decreaseBillboards.length > 10 ? 10 : decreaseBillboards.length
        for (let i = 0; i < length;) {
            const response = await import(`../../assets/images/ranking_${++i}.png`)
            // console.log(profitTopboards[i-1])
            res.push(
                <li className={styles.decreaseItem} key={i}>
                    <a>
                        <span className={styles.number}><img src={response}/></span>
                        <span className={styles.name}>
              <span className={styles.username}> {decreaseBillboards[i - 1].nickname} </span>
            </span>
                        <span className={styles.inviatNumber}>{decreaseBillboards[i - 1].invitationnumber}人</span>
                        <span className={styles.profit}>{decreaseBillboards[i - 1].dividend} CT</span>
                    </a>
                </li>
            )
        }
        this.setState({
            Franks: res
        })
    }

    //等级榜
    fetchRang() {
        this.props.dispatch({
            type: 'home/getRanges',
            payload: {},
            callback: (data) => {
                console.log(data);
                if (data.success) {
                    // this.setState({Ranges:data.data})
                    this.fetchRangboard(data.data);
                }

            }
        })
    }

    fetchRangboard = async (data) => {
        let res = []
        let decreaseBillboards = data;
        let length = decreaseBillboards.length > 10 ? 10 : decreaseBillboards.length
        for (let i = 0; i < length;) {
            const response = await import(`../../assets/images/ranking_${++i}.png`)
            // console.log(profitTopboards[i-1])
            res.push(
                <li className={styles.decreaseItem} key={i}>
                    <a>
                        <span className={styles.number}><img src={response}/></span>
                        <span className={styles.name}>
              <span className={styles.username}> {decreaseBillboards[i - 1].nickname} </span>
              <span className={styles.userLevel}>LV {decreaseBillboards[i - 1].level}</span>
            </span>
                        <span className={styles.profit}>{decreaseBillboards[i - 1].ct} CT</span>
                    </a>
                </li>
            )
        }
        this.setState({
            Ranges: res
        })
    }

    fetchAnnounce() {
        this.props.dispatch({
            type: 'home/fetchAnnounce',
            payload: {}
        })
    }

    fetchYesterdayProfit({}) {
        this.props.dispatch({
            type: 'home/fetchYesterdayProfit',
            payload: {},
            callback: (data) => {
                if (data.success) {
                    // console.log(data)
                    this.setState({myYesterdayProfit: data.data.sharenumber})
                }
            }
        })
    }

    profitNewsTopBoard() {
        this.props.dispatch({
            type: 'home/fetchProfitNewsTopBoard',
            payload: {},
            callback: (data) => {
                if (data.success) {
                    this.state.profitTopboards = data.data
                    this.setState({
                        profitTopboards: [...this.state.profitTopboards]
                    })
                    this.profitTopboard(this.state.profitTopboards)

                }
            }
        })
    }

    yesterdayProfitNewsTopBoard() {
        this.props.dispatch({
            type: 'home/fetchProfitYesterdayTopBoard',
            payload: {},
            callback: (data) => {
                if (data.success) {
                    this.state.yesterdayProfitTopboards = data.data
                    this.setState({
                        yesterdayProfitTopboards: [...this.state.yesterdayProfitTopboards]
                    })
                    this.yesterdayProfitTopboard(this.state.yesterdayProfitTopboards)
                }
            }
        })
    }

    fetchMarketList() {
        this.props.dispatch({
            type: 'home/fetchMarket',
            payload: {},
            /* callback: (res) => {
              if (res.success) {
                setTimeout(() => {
                  this.increaseBillboard(this.props.home.increaseBillboards)
                  this.decreaseBillboard(this.props.home.decreaseBillboards)
                }, 100)

              }
            } */
        })
    }

    fetchProfitNewsBoard({}) {
        this.props.dispatch({
            type: 'home/profitNewsBoard',
            payload: {},
            callback: (data) => {
                if (data.success) {

                }
            }
        })
    }

    fetchList(params) {
        this.props.dispatch({
            type: 'coin/fetchList',
            payload: params
        })
    }

    // 跌幅榜
    decreaseBillboard = (list) => {
        let res = []

        let listLength = list.length >= 10 ? 10 : list.length
        for (let i = 0; i < listLength;) {
            const response = require(`../../assets/images/ranking_${++i}.png`)
            let cointype = (list[i - 1] || '').tradepair.split('/')[0]
            let paycointype = (list[i - 1] || '').tradepair.split('/')[1]
            res.push(
                <li className={styles.decreaseItem} key={'descrese' + i}>
                    <Link
                        to={`/transactionAdvanced/${(list[i - 1] || '').coinid}/${(list[i - 1] || '').paycoinid}/${cointype}/${paycointype}`}>
                        <span className={styles.number}><img src={response} alt=""/></span>
                        <span className={styles.name}>
              <span className={styles.blockCoin}> {(list[i - 1] || '').tradepair} </span>
                            {/* <span className={styles.desc}>{list[i-1].tradepair.split('/')[1]}</span> */}
            </span>
                        <span className={styles.price}>
              <span className={styles.priceValue}>{(list[i - 1].nowprice || '').split('/')[0]}</span>
              <span className={styles.base}> /{(list[i - 1].nowprice || '').split('/')[1]}</span>
            </span>
                        <span className={styles.decrease}>{list[i - 1].fluctuation}%</span>
                    </Link>
                </li>
            )
        }
        return res;

        /* this.setState({
          decreaseBillboards: res
        }) */
    }
    // 涨幅榜
    increaseBillboard = (list) => {
        let res = []
        let listLength = list.length >= 10 ? 10 : list.length
        for (let i = 0; i < listLength;) {
            const response = require(`../../assets/images/ranking_${++i}.png`)
            let cointype = (list[i - 1] || '').tradepair.split('/')[0]
            let paycointype = (list[i - 1] || '').tradepair.split('/')[1]
            res.push(
                <li className={styles.increaseItem} key={'increase' + i}>
                    <Link
                        to={`/transactionAdvanced/${(list[i - 1] || '').coinid}/${(list[i - 1] || '').paycoinid}/${cointype}/${paycointype}`}>
                        <span className={styles.number}><img src={response} alt=""/></span>
                        <span className={styles.name}> <span
                            className={styles.blockCoin}> {(list[i - 1] || '').tradepair} </span></span>
                        <span className={styles.price}>
              <span className={styles.priceValue}>{(list[i - 1].nowprice || '').split('/')[0]}</span>
              <span className={styles.base}> /{(list[i - 1].nowprice || '').split('/')[1]}</span>
            </span>
                        <span className={styles.increase}>{list[i - 1].fluctuation}%</span>
                    </Link>
                </li>
            )
        }
        return res;

        /* this.setState({
          increaseBillboards: res
        }) */
    }
    // 分红榜
    profitTopboard = async (profitTopboards) => {
        let res = []

        let decreaseBillboards = this.props.home.profitTopList
        let length = decreaseBillboards.length > 10 ? 10 : decreaseBillboards.length
        for (let i = 0; i < length;) {
            const response = await import(`../../assets/images/ranking_${++i}.png`)
            // console.log(profitTopboards[i-1])
            res.push(
                <li className={styles.decreaseItem} key={i}>
                    <a>
                        <span className={styles.number}><img src={response}/></span>
                        <span className={styles.name}>
              <span className={styles.username}> {decreaseBillboards[i - 1].nickname} </span>
              <span className={styles.userLevel}>LV {decreaseBillboards[i - 1].level}</span>
            </span>
                        <span className={styles.profit}>{decreaseBillboards[i - 1].dividend} CT</span>
                    </a>
                </li>
            )
        }
        this.setState({
            profitTopboardList: res
        })
    }
    yesterdayProfitTopboard = async (profitTopboards) => {
        let res = [];

        let decreaseBillboards = this.props.home.yesterdayProfitTopList
        let length = decreaseBillboards.length < 10 ? decreaseBillboards.length : 10
        for (let i = 0; i < length;) {
            const response = await import(`../../assets/images/ranking_${++i}.png`)

            // console.log(profitTopboards[i-1])
            res.push(
                <li className={styles.decreaseItem} key={i}>
                    <a>
                        <span className={styles.number}><img src={response}/></span>
                        <span className={styles.name}>
              <span className={styles.username}> {decreaseBillboards[i - 1].nickname} </span>
              <span className={styles.userLevel}>LV {decreaseBillboards[i - 1].level}</span>
            </span>
                        <span className={styles.profit}>{decreaseBillboards[i - 1].dividend} CT</span>
                    </a>
                </li>
            )
        }
        this.setState({
            yesterdayProfitTopboardList: res
        })
    }

    profitTopboard = async (profitTopboards) => {
        let res = []

        let decreaseBillboards = this.props.home.profitTopList
        let length = decreaseBillboards.length < 10 ? decreaseBillboards.length : 10
        for (let i = 0; i < length;) {
            const response = await import(`../../assets/images/ranking_${++i}.png`)
            // console.log(profitTopboards[i-1])
            res.push(
                <li className={styles.decreaseItem} key={i}>
                    <a>
                        <span className={styles.number}><img src={response}/></span>
                        <span className={styles.name}>
              <span className={styles.username}> {decreaseBillboards[i - 1].nickname} </span>
              <span className={styles.userLevel}>LV {decreaseBillboards[i - 1].level}</span>
            </span>
                        <span className={styles.profit}>{decreaseBillboards[i - 1].dividend} CT</span>
                    </a>
                </li>
            )
        }
        this.setState({
            profitTopboardList: res
        })
    }

    marketTypeChange(type) {
        this.setState({
            markeType: type
        })
    }

    selfSelectCoin(e, item, coinTypeList) {
        if (e.target.nodeName.toUpperCase() === 'SPAN' || e.target.nodeName.toUpperCase() === 'I') {
            e.preventDefault()
            // item.selfChoose = !item.selfChoose
            console.log(item)
            this.props.dispatch({
                type: 'home/editFavorites',
                payload: {
                    item,
                    cmd: item.selfChoose ? 'del' : 'add',
                }
            })
            // this.setState({
            //   coinTypeList: [...coinTypeList]
            // })
        }

    }

    coinTypeList(coinTypeList) {
        let filterCoinTypeList = []
        if (coinTypeList.length > 0) {
            filterCoinTypeList = coinTypeList.filter((coin) => {
                return (coin.tradepair.indexOf(this.state.searchContent.toUpperCase()) >= 0)

            })
        }
        let res = []

        if (filterCoinTypeList.length > 0) {
            filterCoinTypeList.map((item, index) => {
                let cointype = item.tradepair.split('/')[0]
                let paycointype = item.tradepair.split('/')[1]
                res.push(
                    <Link to={`/transactionAdvanced/${item.coinid}/${item.paycoinid}/${cointype}/${paycointype}`}
                          className={styles.panelItem} key={index}>
            <span className={styles.coinType}
                  onClick={(e) => this.selfSelectCoin(e, item, coinTypeList)}>
              <Icon
                  type={item.selfChoose ? 'xingxing' : 'xingxing1'}
                  color={item.selfChoose ? '#07b097' : '#666'} size='14'
              />
            </span>
                        <span className={styles.coinKind}><span className={styles.moleculeCoin}>{item.tradepair}</span></span>
                        <span className={styles.newestPriceBd}>
              <span className={styles.coinprice}>{(item.nowprice || '').split('/')[0]}</span>
              <span>/{(item.nowprice || '').split('/')[1]}</span>
            </span>
                        <span
                            className={parseFloat(item.fluctuation) > 0 ? styles.priceWaveAdd
                                : (parseFloat(item.fluctuation) < 0 ? styles.priceWaveDecrease : styles.priceWaveNone)}>{item.fluctuation}%</span>
                        <span className={styles.maxValue}>{item.high}</span>
                        <span className={styles.minValue}>{item.low}</span>
                        <span className={styles.tradeAmount}>{item.volume}</span>
                        <span className={styles.toTrade}><img src={images.toTrade}/></span>
                    </Link>
                )
            })
        } else {
            res.push(
                <a href="#" className={styles.panelItem}
                   style={{textAlign: 'center', color: '#999', justifyContent: 'center'}}
                   key='noneData'>{intl.get("ASSER_NO_DATA")}</a>
            )
        }
        return res
    }

    render() {
        return (
            <div className={styles.normal}>

                <Header {...this.props} loginStatus={tokenVerify()}/>
                <div className={styles.info}>
                    <SwiperBox/>
                    <div className={styles.notice}>
                        <div className={styles.noticeContainer}>
                            <div className={styles.speaker}>
                                <img src={speaker} alt=""/>
                            </div>
                            <div className={styles.infoContainer}>

                                <a href={`https://crebe.zendesk.com/hc/zh-cn/articles/360020190131-%E6%8E%A8%E8%8D%90%E5%A5%BD%E5%8F%8B-%E6%8B%BF%E5%8F%8C%E9%87%8D%E7%A6%8F%E5%88%A9?tdsourcetag=s_pcqq_aiomsg`}
                                   className={styles.newsItem}
                                   target='_blank'
                                >
                                    {intl.get("NOTICE_ONE")}
                                    <span className={styles.date}>  11-26</span>
                                </a>
                                <a href={window.currentLocale === "zh-CN" ? `https://crebe.zendesk.com/hc/zh-cn/articles/360020492832-crebe%E5%B9%B3%E5%8F%B0%E5%88%86%E7%BA%A2%E8%A7%84%E5%88%99%E5%8D%87%E7%BA%A7%E5%85%AC%E5%91%8A?tdsourcetag=s_pcqq_aiomsg` : `https://crebe.zendesk.com/hc/en-us/articles/360020533112-Upgrade-of-crebe-Dividend-Rule`}
                                   className={styles.newsItem}
                                   target='_blank'
                                >
                                    {intl.get("NOTICE_TWO")}
                                    <span className={styles.date}>  11-26</span>
                                </a>

                            </div>
                            <a className={styles.more}
                               href="https://crebe.zendesk.com/hc/zh-cn/categories/360001116992-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83"
                               target='_blank'>{intl.get("MORE")}</a>
                        </div>
                    </div>
                    <div className={styles.billboard}>
                        <div className={styles.increaseBillboard}>
                            <h5 className={styles.title}>
                <span
                    onClick={() => this.setState({billboardType: 1})}
                    className={this.state.billboardType === 1 ? styles.actived : ''}
                >{intl.get('LEVER_RANK')}</span>
                                {/*<span*/}
                                {/*onClick={() => this.setState({ billboardType: 2 })}*/}
                                {/*className={this.state.billboardType === 2 ? styles.actived : ''}*/}
                                {/*>{intl.get('Decline')}</span>*/}
                                {/* <a className={styles.more} href="#">更多</a> */}
                            </h5>
                            <ul className={styles.decreaseList}
                                style={{display: this.state.billboardType === 1 ? 'block' : 'none'}}>
                                {/*{this.increaseBillboard(this.props.home.increaseBillboards)}*/}
                                {this.state.Ranges}
                            </ul>
                            {/*<ul className={styles.increaseList} style={{ display: this.state.billboardType === 2 ? 'block' : 'none' }}>*/}
                            {/*/!*{this.decreaseBillboard(this.props.home.decreaseBillboards)}*!/*/}
                            {/*{this.state.Franks}*/}
                            {/*</ul>*/}
                        </div>
                        <div className={styles.decreaseBillboard}>
                            <h5 className={styles.title}>
                <span
                    onClick={() => this.setState({profitType: 2})}
                    className={this.state.profitType === 2 ? styles.actived : ''}
                >{intl.get('Daily_Profit_List')}</span>
                                <span
                                    onClick={() => this.setState({profitType: 1})}
                                    className={this.state.profitType === 1 ? styles.actived : ''}
                                >{intl.get('Total_Profit_List')}</span>

                                {/* <a className={styles.more} href="#">更多</a> */}
                            </h5>
                            <ul className={styles.decreaseList}
                                style={{display: (this.state.profitType === 1 ? 'block' : 'none')}}>
                                {
                                    this.state.profitTopboardList
                                }
                            </ul>
                            <ul className={styles.decreaseList}
                                style={{display: (this.state.profitType === 2 ? 'block' : 'none')}}>
                                {
                                    this.state.yesterdayProfitTopboardList
                                }
                            </ul>
                        </div>
                        <PersonalBillboard sumiss={this.state.sumiss} {...this.props}
                                           myYesterdayProfit={this.state.myYesterdayProfit}/>
                    </div>
                </div>
                {this.state.lazyStop &&
                <div className={styles.boardContainer}>
                    <div className={styles.boardList}>
                        <div className={styles.navContainer}>
                            <nav className={styles.tabList}>
                <span
                    onClick={this.marketTypeChange.bind(this, 0)}
                    className={this.state.markeType === 0 ? styles.actived : ''}>
                  <Icon type='xingxing' color='#999999' size='14'/>{intl.get('HOME_Favorite')}
                </span>
                                <span
                                    onClick={this.marketTypeChange.bind(this, 1)}
                                    className={this.state.markeType === 1 ? styles.actived : ''}>{intl.get("MOTHERBOARD")}
                </span>
                                {/*<span*/}
                                {/*onClick={this.marketTypeChange.bind(this, 2)}*/}
                                {/*className={this.state.markeType === 2 ? styles.actived : ''}>{intl.get('HOME_USDT')}*/}
                                {/*</span>*/}
                                {/*<span*/}
                                {/*onClick={this.marketTypeChange.bind(this, 3)}*/}
                                {/*className={this.state.markeType === 3 ? styles.actived : ''}>{intl.get('HOME_BTC')}*/}
                                {/*</span>*/}
                                {/*<span*/}
                                {/*onClick={this.marketTypeChange.bind(this, 4)}*/}
                                {/*className={this.state.markeType === 4 ? styles.actived : ''}>{intl.get('HOME_ETH')}*/}
                                {/*</span>*/}
                            </nav>
                            <div className={styles.search}>
                                <input type="text" placeholder={intl.get("ASSER_SEARCH")}
                                       onChange={(e) => this.boardListFilter(e)}/>
                                <Icon type='sousuo' color='#bbbbbb' size='12'/>
                            </div>
                        </div>
                        <p className={styles.panelHead}>
                            <span className={styles.tradeCouple}>{intl.get('PAIR')}</span>
                            <span className={styles.newestPriceHd}>{intl.get('LAST_PRICE')}</span>
                            <span className={styles.priceWaveAddHd}>{intl.get('CHANGE_24')}</span>
                            <span className={styles.maxValueHd}>{intl.get('HIGH_24')}</span>
                            <span className={styles.minValueHd}>{intl.get('LOW_24')}</span>
                            <span className={styles.tradeAmountHd}>{intl.get('VOLUME_24')} </span>
                            <span className={styles.toTradeHd}>{intl.get('TRADE')}</span>
                        </p>
                        <div className={styles.coinPanels}>
                            <div className={this.state.markeType == 1 ? styles.display : ''}>
                                {this.coinTypeList(this.props.home.MarketMain)}
                            </div>
                            {/*<div className={this.state.markeType == 0 ? styles.display : ''} >*/}
                            {/*{this.coinTypeList(this.props.home.favorite)}*/}
                            {/*</div>*/}
                            {/*<div className={this.state.markeType == 1 ? styles.display : ''} >*/}
                            {/*{this.coinTypeList(this.props.home.qqMarket)}*/}
                            {/*</div>*/}
                            {/*<div className={this.state.markeType == 2 ? styles.display : ''} >*/}
                            {/*{this.coinTypeList(this.props.home.usdtMarket)}*/}
                            {/*</div>*/}
                            {/*<div className={this.state.markeType == 3 ? styles.display : ''} >*/}
                            {/*{this.coinTypeList(this.props.home.btcMarket)}*/}
                            {/*</div>*/}
                            {/*<div className={this.state.markeType == 4 ? styles.display : ''} >*/}

                            {/*{this.coinTypeList(this.props.home.ethMarket)}*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>}
                {/*<div className={styles.consultationOnline}>*/}
                {/*<img src={consultationOnline} alt="" />*/}
                {/*<span>在线咨询</span>*/}
                {/*</div> */}
                <div className={styles.linkApp}>
                    <div className={styles.warp}>
                        <img className={styles.publicity} src={publicity} alt=""/>
                        <div className={styles.appWarp}>
                            <div><p className={styles.tranTitle}>{intl.get("ANYTIME_ANYWHERE")}</p>
                                <p>iOS、Android、Mac、Windows {intl.get("SUPPORT_ALL")}</p>
                            </div>

                            <div className={styles.buttornWarp}>
                                <div><span><img src={apple} alt=""/>iPhone {intl.get("DOWN")}</span></div>
                                <div><span><img src={android} alt=""/>Android {intl.get("DOWN")}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer {...this.props} />
            </div>
        )
    }
}
