// 提币地址管理s
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styles from './extractAddress.less'
import { Table, Button,  Select, Input } from 'element-react'
import { MessageBox, Message,Notification} from 'element-react'
import { AutoComplete } from './AutoComplete'
import ScrollTable from '../../../components/ScrollTable'
import Icon from '../../../components/Icon'
import intl from 'react-intl-universal'
@connect(state => ({
  global: state.global,
  extractAddress: state.extractAddress
}))
export default class ExtractAddress extends PureComponent {
  constructor(props) {
    super(props)

    this.messageTips = this.messageTips.bind(this)
    this.state = {
      restaurants: [],
      value: '',
      id: '',
      addressValue:'',
      remark: ''
    }
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
      type: 'extractAddress/reset',
      payload: {}
    })
  }
  fetchList(params) {
    console.log('请求数据')
    this.props.dispatch({
      type: 'extractAddress/fetch',
      payload: params
    })
  }

  addressAddAction(){

    if (!(this.state.addressValue.trim())) {
      Notification({
        title:intl.get('Reminder'),
        type: 'error',
        message: intl.get('Address_must_fill'),
        duration: 2000
      });
      return
    }
    let addItem = []
    addItem.push({
      coinname : this.state.value,
      walletaddress : this.state.addressValue,
      remarks : this.state.remark
    })
    // debugger
    this.props.dispatch({
      type : 'extractAddress/fetchAddressAdd',
      payload:{
        coinid : this.state.id,
        balancenum : this.state.addressValue,
        content : this.state.remark
      },
      callback:(res)=>{
        if (res.success) {
          Notification({
            title:intl.get('Reminder'),
            type: 'success',
            message: intl.get('Add_success'),
            duration: 2000
          });
          // this.props.dispatch({
          //   type : 'extractAddress/fetchAdd',
          //   payload:{
          //     addItem : addItem
          //   },
          // })
            this.fetchList({
                num: '20',
                page: '1'
            })
        } else {
          Notification({
            title:intl.get('Reminder'),
            type: 'error',
            message: intl.get('Add_failed'),
            duration: 2000
          });
        }
      }
    })
  }

  messageTips(index, row) {
    let _this = this
    MessageBox.confirm('此操作将永久删除该地址, 是否继续?', '提示').then(() => {
      this.props.dispatch({
        type : 'extractAddress/fetchAddressDel',
        payload:{
          addressid : row.addressid
        },
        callback:function(res){
          if (res.success) {
            _this.props.dispatch({
              type:'extractAddress/delAttress',
              payload:{
                index:index
              }
            })
            Notification({
              title:intl.get('Reminder'),
              type: 'success',
              message: intl.get('Delete_success'),
              duration: 2000
            });

          } else {
            Notification({
              title:intl.get('Reminder'),
              type: 'error',
              message: intl.get('Delete_failed'),
              duration: 2000
            });
          }
        }
      })

    })
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

  querySearchAsync(queryString, cb) {
    const { restaurants } = this.state;
    const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;

    cb(results)
  }

  createFilter(queryString) {
    return (restaurant) => {
      return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    };
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
  addressValueChange(e){
    this.setState({
      addressValue : e
    })
  }
  remarkChange(e){
    this.setState({
      remark : e
    })
  }
  render() {
    const { extractAddress } = this.props
    const _this = this
    extractAddress.columns = [
      {
        label: intl.get("COIN"),
        prop: "coinname",
        width:80
      },
      {
        label: intl.get("COIN_ADDRESS"),
        prop: "walletaddress"
      },
      {
        label: intl.get("NOTE"),
        prop: "remarks"
      },
      {
        label: intl.get("ASSER_OPERATION"),
        prop: "operation",
        align:'right',
        width: 80,
        render: (row, column, index) => {
          return (
            <span className='assetBalanceOperation'>
              <span onClick={_this.messageTips.bind(this,index, row)} >{intl.get("DELETE")}</span>
            </span>
          )
        }
      }
    ]

    return (
      <div className={styles.extract + " extract"}>
        <div className="title">
          {intl.get("WITHDRAW_ADDRESS_MANAGE")}
        </div>
        <div className={styles.search}>
          <span className={styles.transactionAction}>
            <span  className={styles.searchIcon}>
              <Icon size={14} color={'#c0bbce'} type='sousuo' />
            </span>
            <AutoComplete
              placeholder={intl.get("TOKEN_ABBREV")}
              value={this.state.value}
              fetchSuggestions={this.querySearchAsync.bind(this)}
              onChange={this.handleChange.bind(this)}
              onSelect={this.handleSelect.bind(this)}
              style={{ width: '160px' }}
            ></AutoComplete>
          </span>
          <span className={styles.extractAddr}>
            <Input
              placeholder={intl.get("COIN_ADDRESS")}
              onChange={(e)=>this.addressValueChange(e)}
              value={this.state.addressValue} />
          </span>
          <span className={styles.extractAddr}>
          <Input
            placeholder={intl.get("NOTE")}
            onChange={(e)=>this.remarkChange(e)}
          />
          </span>
           <Button onClick={(e)=>this.addressAddAction(e)} >{intl.get("ADD")}</Button>
        </div>

        <ScrollTable
          columns={extractAddress.columns}
          data={extractAddress.data}
          loading={extractAddress.loading}
          queryAmount={extractAddress.count}
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

