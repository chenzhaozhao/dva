// 资产余额
import React, { PureComponent } from 'react'
import { Link } from 'dva/router'
import { connect } from 'dva'
import styles from './assetBalance.less'
import Icon from '../../../components/Icon'
import { Button } from 'element-react'
import { AutoComplete } from './AutoComplete'
import ScrollTable from '../../../components/ScrollTable'
import intl from 'react-intl-universal'
@connect(state => ({
  global: state.global,
  assetBalance: state.assetBalance
}))
export default class AssetBalance extends PureComponent {
  constructor(props) {
    super(props)
    // this.handleSearch = this.handleSearch.bind(this)
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
    this.resetList({})
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
      type: 'assetBalance/reset',
      payload: {}
    })
  }
  fetchList(params) {
    console.log('请求数据')
    this.props.dispatch({
      type: 'assetBalance/fetch',
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
      type: 'assetBalance/reset',
      payload: {}
    })
    this.props.dispatch({
      type: 'assetBalance/fetch',
      payload: {
        num: '20',
        page: '1',
        coinid: this.state.id
      }
    })
  }

  toTransactionPage(row) {
    console.log(row)
    if (row.coinid === '2') {
      return (
        <Link to='/transactionAdvanced/2/1/USDT/CT'>{intl.get("TRANSACTION")}</Link>
      )
    } else {
      return (
        <Link to={`/transactionAdvanced/${row.coinid}/2/${row.coinname}/USDT`}>{intl.get("TRANSACTION")}</Link>
      )
    }
  }

  render() {
    const { assetBalance } = this.props;
    const _this = this;
    assetBalance.columns = [
      {
        label: intl.get("COIN"),
        prop: "coinname",
        width: 60
      },
      {
        label: intl.get("AVAILABLE"),
        prop: "positions",
        width: 150
      },
      {
        label: intl.get("FROZEN_HEDGE"),
        prop: "freeze",
        width: 100
      },
        {
            label: intl.get("HEDGE"),
            prop: "locknumber",
            width: 100
        },
      {
        label: intl.get("ASSER_EQUIVALENT"),
        prop: "compromise"
      },
      {
        label: intl.get("ASSER_OPERATION"),
        prop: "operation",
        width: 240,
        render: (row) => {
          return (
            <span className='assetBalanceOperation'>

              <span>  {row.coinname === 'CT' ? '' : (<Link to='/manager/financeManage/recharge'>{intl.get("TRANSFER")}</Link>)} </span>
              <span >{row.coinname === 'CT' ? '' : (<Link to='/manager/financeManage/extract'>{intl.get("TRANSFER_OUT")}</Link>)} </span>
              <span> {_this.toTransactionPage(row)} </span>
            </span>
          )
        }
      }
    ]

    return (
      <div className={styles.assetBalance + " assetBalance"}>
        <div className="title">
            {intl.get("ASSET_BALANCE")}
        </div>
        <div className={styles.search}>
          <span className={styles.searchIcon}>
            <Icon size={14} color={'#c0bbce'} type='sousuo' />
          </span>
          <AutoComplete
            placeholder={intl.get("TOKEN_ABBREV")}
            value={this.state.value}
            fetchSuggestions={this.querySearchAsync.bind(this)}
            onChange={this.handleChange.bind(this)}
            onSelect={this.handleSelect.bind(this)}
          ></AutoComplete>
          <Button onClick={this.handleSearch.bind(this)}>{intl.get("ASSER_SEARCH")}</Button>
        </div>
        <ScrollTable
          columns={assetBalance.columns}
          data={assetBalance.data}
          loading={assetBalance.loading}
          queryAmount={assetBalance.count}
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
