// 充币记录
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styles from './extractReco.less'
import Icon from '../../../components/Icon'
import { Button } from 'element-react'
import { AutoComplete } from './AutoComplete'
import ScrollTable from '../../../components/ScrollTable'
import {formatTime} from '../../../utils'
import intl from 'react-intl-universal'

@connect(state => ({
  global: state.global,
  extractReco: state.extractReco
}))
export default class ExtractReco extends PureComponent {
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
      type: 'extractReco/reset',
      payload: {}
    })
  }

  fetchList(params) {
    console.log('请求数据')
    this.props.dispatch({
      type: 'extractReco/fetch',
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
      type: 'extractReco/fetch',
      payload: {
        num: '20',
        page: '1',
        coinid: this.state.id
      }
    })
  }

  render() {
    const { extractReco } = this.props

    extractReco.columns = [
      {
        label: intl.get("DATE"),
        prop: "time",
        width:'160',
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
        width:"60"
      },
      {
        label: intl.get("ACCEPT_ADDRESS"),
        prop: "outaddress"
      },
      {
        label: intl.get("NUMBER_OF_COINS"),
        prop: "rolloutnum",
        width:"110"
      },
      {
        label: intl.get("FEE"),
        prop: "fee",
        width:"110"
      },
      {
        label: intl.get("ACTUAL_ARRIVAL"),
        prop: "realaccountnum",
        width:"110"
      },
      {
        label: intl.get("STATUS"),
        prop: "status",
        align:'right',
        width:"80",
        render: (row,column,index) => {
          return (
            <span className='assetBalanceOperation'>
              <span className={row.status === '1' ? 'received' : 'unreceived' } >
                { row.status === '1' ? intl.get("DELAYED") : intl.get("ARRIVED") }
              </span>
            </span>
          )
        }
      }
    ]

    return (
      <div className={styles.recharge + " recharge"}>
        <div className="title">
          {intl.get("TICK_RECORD")}
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
           <Button onClick={this.handleSearch.bind(this)}>{intl.get("SEARCH")}</Button>
        </div>
        
        <ScrollTable
          columns={extractReco.columns}
          data={extractReco.data}
          loading={extractReco.loading}
          queryAmount={extractReco.count}
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
