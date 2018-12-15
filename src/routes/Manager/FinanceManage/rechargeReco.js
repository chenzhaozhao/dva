// 提币记录
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styles from './rechargeReco.less'
import Icon from '../../../components/Icon'
import { Button } from 'element-react'
import { AutoComplete } from './AutoComplete'
import ScrollTable from '../../../components/ScrollTable'
import {formatTime} from '../../../utils'
import intl from 'react-intl-universal'
@connect(state => ({
  global: state.global,
  rechargeReco: state.rechargeReco
}))
export default class RechargeReco extends PureComponent {
  constructor(props) {
    super(props)
  }

  state = {
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

  componentWillUnmount(){
    this.resetList({})
  }

  resetList(){
    this.props.dispatch({
      type: 'rechargeReco/reset',
      payload: {}
    })
  }

  fetchList(params) {
    this.props.dispatch({
      type: 'rechargeReco/fetch',
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

  handleSearch() {
    // console.log(`coinid=>${this.state.id}`)
    this.props.dispatch({
      type: 'rechargeReco/reset',
      payload: {}
    })
    this.props.dispatch({
      type: 'rechargeReco/fetch',
      payload: {
        num: '20',
        page: '1',
        coinid: this.state.id
      }
    })
  }

  render() {
    const { rechargeReco } = this.props
    rechargeReco.columns = [
      {
        label: intl.get("DATE"),
        prop: "time",
        width:'180',
        render: function(row,column,index){
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
        width:"80"
      },
      {
        label: intl.get("CURRENCY_ADDRESS"),
        prop: "fromaddress"
      },
      {
        label: intl.get("Number of coins"),
        prop: "innum",
        width:"120"
      },
      {
        label: intl.get("STATUS"),
        prop: "status",
        align:'right',
        width:"80",
        render: function(row,column,index){
          return (
            <span className='assetBalanceOperation'>
             <span className={row.status === '1' ? 'received' : 'unreceived' } >{ row.status === '1' ? '未到账' : '已到账' }</span>
            </span>
          )
        }
      }
    ]
    
    return (
      <div className={styles.recharge + " recharge"}>
        <div className="title">
          {intl.get("DEPOSIT_HISTORY")}
        </div>
        <div className={styles.search}>
          <span  className={styles.searchIcon} >
            <Icon size={14} color={'#c0bbce'} type='sousuo'/>    
          </span>
          
          <AutoComplete
            placeholder={intl.get("TOKEN_ADDREV")}
            value={this.state.value}
            fetchSuggestions={this.querySearchAsync.bind(this)}
            onChange={this.handleChange.bind(this)}
            onSelect={this.handleSelect.bind(this)}
          ></AutoComplete>
           <Button onClick={this.handleSearch.bind(this)}>{intl.get("ASSER_SEARCH")}</Button>
        </div>
        
        <ScrollTable
          columns={rechargeReco.columns}
          data={rechargeReco.data}
          loading={rechargeReco.loading}
          queryAmount={rechargeReco.count}
          onScrollDisptchQuery={
            page => { 
              console.log(`请求的页码是：${page}`,)
              this.fetchList({
                num: '20',
                page: page
              })
            }
          }
          border={false}
        />
      </div>
    )
  }
}
