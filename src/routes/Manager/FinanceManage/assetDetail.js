
// 历史委托记录
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styles from './assetDetail.less'
import Icon from '../../../components/Icon'
import { Select, DateRangePicker } from 'element-react'
import { Button } from 'element-react'
import { AutoComplete } from './AutoComplete'
import ScrollTable from '../../../components/ScrollTable'
import { formatTime } from '../../../utils'
import intl from 'react-intl-universal'
@connect(state => ({
    global: state.global,
    assetDetail: state.assetDetail
}))
export default class AssetDetail extends PureComponent {
    constructor(props) {
        super(props)
    }

    state = {
        options1: [
            { label: intl.get("RECHARGE"), value: 1 },
            { label: intl.get("WITHDRAW"), value: 2 },
            { label: intl.get("VOTE"), value: 3 },
            { label: intl.get("BUY_IN"), value: 4 },
            { label: intl.get("BUY_OUT"), value: 5 },
            { label: intl.get("TRANSACTION_FEE"), value: 6 },
            { label: intl.get("WITHDRAW_FEE"), value: 7 },
            { label: intl.get("PLATFORM_PROFIT"), value: 8 },
            { label: intl.get("SOLITAIRE_PROFI"), value: 9 },
            { label: intl.get("REFERAL_PROFIT"), value: 10 },
            { label: intl.get("MANUAL_TRANSFER"), value: 11 },
            { label: intl.get("BUY_SOLITAIRE"), value: 12 },
            { label: intl.get("SOLITAIRE_REWARD"), value: 13 },
            { label: intl.get("AIR_DROP"), value: 14 },
            { label: intl.get("SENDING_OUT"), value: 15 },
            { label: intl.get("UBLOCK"), value: 16 },
            { label: intl.get("CANCELT"), value: 17 },
            { label: intl.get("BUY_VIP"), value: 18 },
            { label: intl.get("SOLITAIRE_FEE"), value: 19 }
        ],
        options2: [
            { label: intl.get("ARRIVED"), value: 1 },
            { label: intl.get("DELAYED"), value: 2 },
            { label: intl.get("EXECUTED"), value: 3 },
            { label: intl.get("FROZEND"), value: 4 },
            { label: intl.get("THAW"), value: 5 },
        ],
        option1Value: '',
        option2Value: '',
        restaurants: [],
        value: '',
        id: '',
        value1: null,
        startDate: '',
        endDate: '',
    }

    querySearchAsync(queryString, cb) {
        const { restaurants } = this.state
        const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        cb(results)
    }

    createFilter(queryString) {
        return (restaurant) => {
            return (restaurant.value.toUpperCase().indexOf(queryString.toUpperCase()) === 0)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            restaurants: nextProps.global.coinTypes.map(item => ({
                id: item.coinid,
                value: item.abbreviation,
                name: item.chinesename
            }))
        })
    }

    componentDidMount() {
        this.fetchList({
            num: '20',
            page: '1'
        })
    }

    fetchList(params) {
        console.log('请求数据')
        this.props.dispatch({
            type: 'assetDetail/fetch',
            payload: params
        })
    }

    componentWillUnmount() {
        this.resetList({})
    }

    resetList() {
        this.props.dispatch({
            type: 'assetDetail/reset',
            payload: {}
        })
    }

    transactionStatus(code) {
        if (parseInt(code) === 2) {
            return 'trading'
        } else {
            return 'finished'
        }
    }

    status(code) {
        code = parseInt(code)
        if (code === 1) {
            return intl.get("ARRIVED")
        } else if (code === 2) {
            return intl.get("DELAYED")
        }else if (code === 3) {
            return intl.get("EXECUTED")
        }else if (code === 4) {
            return intl.get("FROZEND")
        }else if (code === 5) {
            return intl.get("THAW")
        }
    }
    freezetype(code) {
        code = parseInt(code)
        if (code === 1) {
            return intl.get("RECHARGE")
        } if (code === 2) {
            return intl.get("WITHDRAW")
        } if (code === 3) {
            return intl.get("VOTE")
        } else if (code === 4) {
            return intl.get("BUY_IN")
        } if (code === 5) {
            return intl.get("BUY_OUT")
        } if (code === 6) {
            return intl.get("TRANSACTION_FEE")
        } else if (code === 7) {
            return intl.get("WITHDRAW_FEE")
        } if (code === 8) {
            return intl.get("PLATFORM_PROFIT")
        } if (code === 9) {
            return intl.get("CT_SOLITAIRE")
        } else if (code === 10) {
            return intl.get("REFERAL_PROFIT")
        } if (code === 11) {
            return intl.get("MANUAL_TRANSFER")
        } if (code === 12) {
            return intl.get("SOLITAIRE")
        } else if (code === 13) {
            return intl.get("SOLITAIRE_REWARD")
        } if (code === 14) {
            return intl.get("AIR_DROP")
        } if (code === 15) {
            return intl.get("SENDING_OUT")
        } else if (code === 16) {
            return intl.get("UNLOCK")
        } if (code === 17) {
            return intl.get("CANCELT")
        } if (code === 18) {
            return intl.get("BUY_VIP")
        } if (code === 19) {
            return intl.get("SOLITAIRE_FEE")
        } 
    }

    handleSelect(item) {
        this.setState({
            value: item.value,
            id: item.id
        })
    }

    handleChange(value) {
        this.setState({
            value,
            id: ''
        })
    }

    handleOption1Change(value) {
        this.setState({
            option1Value: value
        })
    }

    handleOption2Change(value) {
        this.setState({
            option2Value: value
        })
    }

    handleSearch() {
        // console.log(`coinid=>${this.state.id}`)
        this.props.dispatch({
            type: 'assetDetail/reset',
            payload: {}
        })
        this.props.dispatch({
            type: 'assetDetail/fetch',
            payload: {
                num: '20',
                page: '1',
                type: this.state.option1Value,
                status: this.state.option2Value,
                coinid: this.state.id,
                sdate: this.state.startDate,
                edate: this.state.endDate
            }
        })
    }

    chooseTime(data) {
        console.log(data)
        let startDate;
        let endDate
        if (data) {
            startDate = data[0].getTime() / 1000
            endDate = data[1].getTime() / 1000
        }
        console.log(startDate, endDate)
        this.setState({
            startDate: startDate,
            endDate: endDate,
            value1: data
        })
    }

    render() {
        const { assetDetail } = this.props
        const _this = this
        assetDetail.columns = [
            {
                label: intl.get("DATE"),
                prop: "time",
                width: 170,
                render: function (row, column, index) {
                    return (
                        <span>
                            {(row.time || '').trim() ? formatTime('yyyy-MM-dd hh:mm:ss', row.time) : ''}
                        </span>
                    )
                }
            },
            {
                label: intl.get("COIN"),
                prop: "coinname",
                width: 120
            },
            {
                label: intl.get("NOTE"),
                prop: "freezetype",
                align: 'left',
                render: (row, column, index) => {
                    return (
                        <span>
                            <span>{this.freezetype(row.freezetype)}</span>
                        </span>
                    )
                }
            },
            {
                label: intl.get("AMOUNT"),
                prop: "changenum"
            },
            {
                label: intl.get("STATUS"),
                prop: "status",
                align: 'right',
                width: 100,
                render: (row, column, index) => {
                    return (
                        <span className='assetBalanceOperation'>
                            <span className={this.transactionStatus(row.status)} >{this.status(row.status)}</span>
                        </span>
                    )
                }
            }
        ]
        return (
            <div className={styles.historyEntrustReco + " historyEntrustReco"}>
                <div className="title">
                  {intl.get("ASSER_DETAILS")}
                </div>
                <div>
                    <span className={styles.transactionAction}>
                        <span>{intl.get("DATE")}</span>
                        <DateRangePicker
                            value={this.state.value1}
                            placeholder={intl.get("SELECT")}
                            onChange={date => {
                                _this.chooseTime(date)
                            }}
                        />
                    </span>
                    <span className={styles.transactionAction +' ' +styles.selectItem}>
                        <span>{intl.get("TYPE")}</span>
                        <Select value={this.state.option1Value}
                                placeholder={intl.get("PLEASE_CHOOSE")}
                            style={{ width: '150px' }}
                            onChange={this.handleOption1Change.bind(this)}
                        >
                            {
                                this.state.options1.map(el => {
                                    return <Select.Option key={el.value} label={el.label} value={el.value} />
                                })
                            }
                        </Select>
                    </span>
                    <span className={styles.transactionStatus +' ' +styles.selectItem}>
                        <span>{intl.get("STATUS")}</span>
                        <Select value={this.state.option2Value}
                                placeholder={intl.get("PLEASE_CHOOSE")}
                            style={{ width: '150px' }}
                            onChange={this.handleOption2Change.bind(this)}
                        >
                            {
                                this.state.options2.map(el => {
                                    return <Select.Option key={el.value} label={el.label} value={el.value} />
                                })
                            }
                        </Select>
                    </span>
                </div>
                <div className={styles.search}>
                    <span className={styles.transactionAction}>
                        <span>{intl.get("COIN")}</span>
                    </span>
                    <span className={styles.searchIcon} >
                        <Icon size={14} color={'#c0bbce'} type='sousuo' />
                    </span>

                    <AutoComplete
                        placeholder={intl.get("TOKEN_ABBREV")}
                        value={this.state.value}
                        fetchSuggestions={this.querySearchAsync.bind(this)}
                        onChange={this.handleChange.bind(this)}
                        onSelect={this.handleSelect.bind(this)}
                    ></AutoComplete>
                </div>
                <div className={styles.search}>
                    <Button
                        style={{ marginLeft: '34px' }}
                        onClick={this.handleSearch.bind(this)}
                    >{intl.get("ASSER_SEARCH")}</Button>
                </div>

                <ScrollTable
                    columns={assetDetail.columns}
                    data={assetDetail.data}
                    loading={assetDetail.loading}
                    queryAmount={assetDetail.count}
                    onScrollDisptchQuery={
                        page => {
                            console.log(`请求的页码是：${page}`)
                            this.fetchList({
                                num: '20',
                                page: page,
                                type: this.state.option1Value,
                                status: this.state.option2Value,
                                coinid: this.state.id,
                                sdate: this.state.startDate,
                                edate: this.state.endDate
                            })
                        }
                    }
                    border={false}
                />
            </div>
        )
    }
}
