// 成交记录
import React, {PureComponent} from 'react'
import {connect} from 'dva'
import styles from './currentEntrustReco.less'
import Icon from '../../../components/Icon'
import {Button} from 'element-react'
import {AutoComplete} from '../FinanceManage/AutoComplete'
import ScrollTable from '../../../components/ScrollTable'
import {formatTime} from '../../../utils'
import {Message, Notification} from 'element-react';
import intl from 'react-intl-universal'
@connect(state => ({
    global: state.global,
    currentEntrustReco: state.currentEntrustReco
}))
export default class CurrentEntrustReco extends PureComponent {
    constructor(props) {
        super(props)
    }

    state = {
        options1: [
            {label: intl.get("BUY_IN"), value: 1},
            {label: intl.get("BUY_OUT"), value: 2},
        ],
        option1Value: '',
        restaurants: [],
        value: '',
        id: ''
    }

    querySearchAsync(queryString, cb) {
        const {restaurants} = this.state
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

    componentWillUnmount() {
        this.resetList({})
    }

    resetList() {
        this.props.dispatch({
            type: 'currentEntrustReco/reset',
            payload: {}
        })
    }

    fetchList(params) {
        console.log('请求数据')
        this.props.dispatch({
            type: 'currentEntrustReco/fetch',
            payload: params
        })
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
            type: 'currentEntrustReco/reset',
            payload: {}
        })
        this.props.dispatch({
            type: 'currentEntrustReco/fetch',
            payload: {
                num: '20',
                page: '1',
                coinid: this.state.id
            }
        })
    }

    revokeEntrust(item) {
        this.props.dispatch({
            type: 'transaction/fetchEntrustRevoke',
            payload: {
                entrustid: item.entrustid
            },
            callback: (data) => {
                if (data.success) {
                    let mes="Undo_success";
                    if (data.msg){
                     mes=data.msg;
                    }
                    Notification({
                        title:intl.get('Reminder'),
                        type: 'success',
                        message: intl.get(mes),
                        duration: 2000
                    });
                    // this.resetList({})
                    this.fetchList({
                        num: '20',
                        page: '1'
                    })
                } else {
                    this.fetchList({
                        num: '20',
                        page: '1'
                    })
                    // Notification({
                    //     title:intl.get('Reminder'),
                    //     type: 'error',
                    //     message: intl.get(data.msg),
                    //     duration: 2000
                    // });
                }
            }
        })
    }

    render() {
        const {currentEntrustReco} = this.props
        const _this = this
        currentEntrustReco.columns = [
            {
                label: intl.get("COMMISSION_TIME"),
                prop: "time",
                width: 160,
                render: function (row, column, index) {
                    return (
                        <span>
              {(row.date || '').trim() ? formatTime('yyyy-MM-dd hh:mm:ss', row.date) : ''}
            </span>
                    )
                }
            },
            {
                label: intl.get("PAIR"),
                prop: "tradepair",
                width: 80
            },
            {
                label: intl.get("DIRECTION"),
                prop: "type",
                width: 65,
                render: (row, columun) => {
                    return (
                        <span>{row.type === '1' ? intl.get("BUY_IN") : intl.get("BUY_OUT")}</span>
                    )
                }
            },
            {
                label: intl.get("PRICE"),
                prop: "price"
            },
            {
                label: intl.get("AMOUNT"),
                prop: "volume"
            },
            {
                label: intl.get("TOTAL"),
                prop: "tradesumentrust"
            },
            {
                label: intl.get("DEAL_DONE"),
                prop: "volume"
            },
            {
                label: intl.get("UNFILLED"),
                prop: "novolume"
            },
            {
                label: intl.get("ASSER_OPERATION"),
                prop: "operation",
                // width: 60,
                render: (row, column, index) => {
                    return (
                        <span className='assetBalanceOperation'>
                            {row.status==4?<span >{intl.get("Undo_ing")}</span>:<span onClick={_this.revokeEntrust.bind(this, row)}>{intl.get("CANCELS")}</span>}
                         </span>
                    )
                }
            }
        ]

        return (
            <div className={styles.transactionReco + " transactionReco"}>
                <div className="title">
                  {intl.get("CURRENT_COMMOSSION")}
                </div>
                <div className={styles.search}>
          <span className={styles.searchIcon}>
            <Icon size={14} color={'#c0bbce'} type='sousuo'/>
          </span>

                    <AutoComplete
                        placeholder={intl.get("TOKEN_ABBREV")}
                        value={this.state.value}
                        fetchSuggestions={this.querySearchAsync.bind(this)}
                        onSelect={this.handleSelect.bind(this)}
                    ></AutoComplete>

                    <Button onClick={this.handleSearch.bind(this)}>{intl.get("ASSER_SEARCH")}</Button>
                </div>

                <ScrollTable
                    columns={currentEntrustReco.columns}
                    data={currentEntrustReco.data}
                    loading={currentEntrustReco.loading}
                    queryAmount={currentEntrustReco.count}
                    onScrollDisptchQuery={
                        page => {
                            console.log(`请求的页码是：${page}`)
                            this.fetchList({
                                num: '20',
                                page: page,
                                coinid: this.state.id
                            })
                        }
                    }
                    border={false}
                />
            </div>
        )
    }
}
