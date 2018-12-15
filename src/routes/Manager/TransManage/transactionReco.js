// 成交记录
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styles from './transactionReco.less'
import Icon from '../../../components/Icon'
import PaginationTable from '../../../components/PaginationTable'
import { Select,Button} from 'element-react'
import { AutoComplete } from '../FinanceManage/AutoComplete'
import ScrollTable from '../../../components/ScrollTable'
import { formatTime } from '../../../utils'
import intl from 'react-intl-universal'
@connect(state => ({
  global: state.global,
  transactionReco: state.transactionReco
}))
export default class TransactionReco extends PureComponent {
  constructor(props) {
    super(props)
  }

  state = {
    options1: [
      { label: intl.get("BUY_IN"), value: 1 },
      { label: intl.get("BUY_OUT"), value: 2 },
    ],
    option1Value: '',
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

  componentWillUnmount() {
    this.resetList({})
  }

  resetList() {
    this.props.dispatch({
      type: 'transactionReco/reset',
      payload: {}
    })
  }

  fetchList(params,isFetch) {
    console.log('请求数据');
    if (isFetch){
        isFetch(false);
    }
    this.props.dispatch({
      type: 'transactionReco/fetch',
      payload: params,
      cb: ()=>{
        if (isFetch){
            isFetch(true)
        }

      }
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
      type: 'transactionReco/reset',
      payload: {},
        cb:()=>{
            this.props.dispatch({
                type: 'transactionReco/fetch',
                payload: {
                    num: '20',
                    page: '1',
                    type: this.state.option1Value,
                    coinid: this.state.id
                }
            })
        }
    });

  }

  render() {
    const { transactionReco } = this.props;

    transactionReco.columns = [
      {
        label: intl.get("TRANSACTION_TIME"),
        prop: "time",
        width: 160,
        render: function (row, column, index) {
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
        width: 100
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
        label: intl.get("TURNOVER"),
        prop: "tradevolumet"
      },
      {
        label: intl.get("SIDE"),
        prop: "type",
        width: 85,
        render: (row, columun) => {
          return (
            <span>{row.type === '1' ? intl.get("BUY_IN") : intl.get("BUY_OUT")}</span>
          )
        }
      },
      {
        label: intl.get("FEE"),
        prop: "buyerfee",
        align: 'right',
        render: (row, columun) => {
          return (
            <span>{row.type === '1' ? row.buyerfee : row.sellerfee}</span>
          )
        }
      }
    ]

    return (
      <div className={styles.transactionReco + " transactionReco"}>
        <div className="title">
            {intl.get("TRANSACTION_RECORD")}
        </div>
        <div className={styles.search}>
          <span className={styles.searchIcon} >
            <Icon size={14} color={'#c0bbce'} type='sousuo' />
          </span>

          <AutoComplete
            placeholder={intl.get("TOKEN_ABBREV")}
            value={this.state.value}
            fetchSuggestions={this.querySearchAsync.bind(this)}
            onSelect={this.handleSelect.bind(this)}
          ></AutoComplete>
          <span className={styles.transactionAction}>
            <span>{intl.get("SIDE")}</span>
            <Select value={this.state.option1Value}
                    placeholder={intl.get("TOKEN_ABBREV")}
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
          <Button onClick={this.handleSearch.bind(this)}>{intl.get("ASSER_SEARCH")}</Button>
        </div>
          {/*<PaginationTable   columns={transactionReco.columns}*/}
                             {/*data={transactionReco.data}*/}
                             {/*loading={transactionReco.loading}*/}
                             {/*queryAmount={transactionReco.count}*/}
                             {/*onScrollDisptchQuery={*/}
                                 {/*(page)=> {*/}
                                     {/*console.log(`请求的页码是：${page}`);*/}
                                         {/*this.fetchList({*/}
                                             {/*num: '20',*/}
                                             {/*page: page,*/}
                                             {/*type: this.state.option1Value,*/}
                                             {/*coinid: this.state.id*/}
                                         {/*})*/}
                                 {/*}*/}
                             {/*}*/}
                             {/*border={false} />*/}
        <ScrollTable
          columns={transactionReco.columns}
          data={transactionReco.data}
          loading={transactionReco.loading}
          queryAmount={transactionReco.count}
          onScrollDisptchQuery={
              (page)=> {
                //作为上个数据请求是否完成的依据
                  this.fetchList({
                      num: '20',
                      page: page,
                      type: this.state.option1Value,
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
