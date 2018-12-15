// 历史委托记录
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styles from './historyEntrustReco.less'
import Icon from '../../../components/Icon'
import { Button, Select } from 'element-react'
import { AutoComplete } from '../FinanceManage/AutoComplete'
import ScrollTable from '../../../components/ScrollTable'
import {formatTime} from '../../../utils'
import intl from 'react-intl-universal'
@connect(state => ({
  global: state.global,
  historyEntrustReco: state.historyEntrustReco
}))
export default class HistoryEntrustReco extends PureComponent {
  constructor(props) {
    super(props)
  }

  state = {
    options1: [
      {label: intl.get("intl"), value: 1},
      {label: intl.get("BUY_OUT"), value: 2},
    ],
    options2: [
      {label: intl.get("COMMISSIONED"), value: 1},
      {label: intl.get("REVOKED"), value: 2},
      {label: intl.get("DEAL_DONE"), value: 3},
    ],
    option1Value: '',
    option2Value: '',
    restaurants: [],
    value: '',
    id: ''
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
      type: 'historyEntrustReco/fetch',
      payload: params
    })
  }

  componentWillUnmount(){
    this.resetList({})
  }

  resetList(){
    this.props.dispatch({
      type: 'historyEntrustReco/reset',
      payload: {}
    })
  }

  transactionStatus(code){
    if (parseInt(code) === 2) {

      return 'revoked'
    } else if (parseInt(code) === 1) {
      return 'trading'
    } else{
      return 'finished'
    }
  }

  status(code){
    code = parseInt(code)
    if (code === 3) {
      return intl.get("COMPLETED")
    } else if (code === 1) {
      return intl.get("COMMISSIONED")
    } else{
      return intl.get("REVOKED")
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
      type: 'historyEntrustReco/reset',
      payload: {}
    })
    this.props.dispatch({
      type: 'historyEntrustReco/fetch',
      payload: {
        num: '20',
        page: '1',
        type: this.state.option1Value,
        status: this.state.option2Value,
        coinid: this.state.id
      }
    })
  }

  render() {
    const { historyEntrustReco } = this.props

    historyEntrustReco.columns = [
      {
        label: intl.get("COMMISSION_TIME"),
        prop: "time",
        width:165,
        render: function(row,column,index){
          return (
            <span>
             {(row.time || '').trim() ? formatTime('yyyy-MM-dd hh:mm:ss', row.time) : ''}
            </span>
          )
        }
      },
      {
        label: intl.get("PAIR"),
        prop: "coinname",
        width:120
      },
      {
        label: intl.get("PRICE"),
        prop: "price"
      },
      {
        label: intl.get("AMMOUNT_OF_COMMISSION"),
        prop: "entrustnumber"
      },
      {
        label: intl.get("THE_NUMBER_OF_TRANSACTIOS"),
        prop: "volume"
      },
      {
        label: intl.get("SIDE"),
        prop: "type",
        width:85,
        render: function(row,column,index){
          return (
            <span>
             {row.type === '1' ? intl.get("BUY_IN") : intl.get("BUY_OUT")}
            </span>
          )
        }
      },
      {
        label: intl.get("STATUS"),
        prop: "status",
        align:'right',
        width: 108,
        render: (row,column,index) => {
          return (
            <span className='assetBalanceOperation'>
             <span className={this.transactionStatus(row.status)} >{ this.status(row.status) }</span>
            </span>
          )
        }
      }
    ]
    return (
      <div className={styles.historyEntrustReco + " historyEntrustReco"}>
        <div className="title">
          {intl.get("HISTIRIAL_COMMISSION_RECORD")}
        </div>
        <div className={styles.search}>
          <span  className={styles.searchIcon} >
            <Icon size={14} color={'#c0bbce'} type='sousuo'/>
          </span>

          <AutoComplete
            placeholder={intl.get("TOKEN_ABBREV")}
            value={this.state.value}
            fetchSuggestions={this.querySearchAsync.bind(this)}
            onChange={this.handleChange.bind(this)}
            onSelect={this.handleSelect.bind(this)}
          ></AutoComplete>
          <span className={styles.transactionAction}>
            <span>{intl.get("SIDE")}</span>
            <Select value={this.state.option1Value}
                    placeholder={intl.get("TOKEN_ABBREV")}
              style={{width: '150px'}}
              onChange={this.handleOption1Change.bind(this)}
            >
              {
                this.state.options1.map(el => {
                  return <Select.Option key={el.value} label={el.label} value={el.value} />
                })
              }
            </Select>
          </span>
          <span className={styles.transactionStatus}>
            <span>{intl.get("STATUS")}</span>
            <Select value={this.state.option2Value}
             placeholder={intl.get("TOKEN_ABBREV")}
              style={{width: '150px'}}
              onChange={this.handleOption2Change.bind(this)}
            >
              {
                this.state.options2.map(el => {
                  return <Select.Option key={el.value} label={el.label} value={el.value} />
                })
              }
            </Select>
          </span>
          <Button onClick={this.handleSearch.bind(this)}>{intl.get("ASSER_SEARCH")}</Button>
        </div>

        <ScrollTable
          columns={historyEntrustReco.columns}
          data={historyEntrustReco.data}
          loading={historyEntrustReco.loading}
          queryAmount={historyEntrustReco.count}
          onScrollDisptchQuery={
            page => {
              console.log(`请求的页码是：${page}`,)
              this.fetchList({
                num: '20',
                page: page,
                type: this.state.option1Value,
                status: this.state.option2Value,
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
