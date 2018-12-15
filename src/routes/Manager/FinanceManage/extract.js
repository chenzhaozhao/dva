// 提币
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import styles from './extract.less'
import Icon from '../../../components/Icon'
import Selectrix from 'react-selectrix'
import { Button, Form, Input } from 'element-react'
import { Dialog,Notification } from 'element-react'
import { AutoComplete } from './AutoComplete'
import ScrollTable from '../../../components/ScrollTable'
import record from '../../../assets/images/record.png'
import intl from 'react-intl-universal'
@connect(state => ({
  global: state.global,
  extract: state.extract
}))
export default class Extract extends PureComponent {
  constructor(props) {
    super(props)
  }

  state = {
    coinType: '',
    coinAmount: null,
    coinBalance: 0,
    minHandlingFee: 0,
    maxtransfer: 0,
    transferminimum: '',
    extractDialogVisible: false,
    extractForm: {},
    restaurants: [],
    value: '',
    id: '',
    addresslist: [],
    positions: '',
    transferfeespercentage: 0,
    extractVerify: true,
    extractAddr: '',
    googleVerifyCode: '',
    GoogleVerifyStatus: false,
    label: '',
    googleVerify:true
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
    this.fetchList({})
    this.fetchGoogleVerifyStatus()
  }

  resetList() {
    this.props.dispatch({
      type: 'extract/reset',
      payload: {}
    })
  }
  fetchList(params) {
    this.props.dispatch({
      type: 'extract/fetch',
      payload: params
    })
  }

  fetchGoogleVerifyStatus() {
    this.props.dispatch({
      type: 'safeCertify/fetchGoogleVerifyStatus',
      payload: {},
      callback: (data) => {
        if (data.success) {
          this.setState({
            GoogleVerifyStatus: true
          })
        } else {
          this.setState({
            GoogleVerifyStatus: false
          })
        }
      }
    })
  }

  extractDialogVisible = (index, row) => {
    if (this.state.GoogleVerifyStatus) {
      this.state.addresslist = (row.addresslist || []).map((item, index) => {
        let res = {}
        res.key = item
        res.label = item
        return res
      })
      this.setState({
        coinType: row.abbreviation,
        positions: row.positions,
        addresslist: [...this.state.addresslist],
        mintransferfee: row.mintransferfee,
        maxtransfer: row.maxtransfer,
        mintransfer: row.mintransfer,
        transferfeespercentage: (parseFloat(row.transferfeespercentage) / 100),
        extractDialogVisible: true,
        id: row.coinid
      })
    } else {
      Notification({
        title:intl.get('Reminder'),
        type: 'warning',
        message: intl.get('SET_GOOGLE_VERIFICATION'),
        duration: 2000
      });
    }
  }

  //提币额度
  extractVerifyAction() {
    if ((parseInt(this.state.coinAmount) <= parseInt(this.state.maxtransfer)) && (parseInt(this.state.coinAmount) >= parseInt(this.state.mintransfer))) {
      this.setState({ extractVerify: true })
    } else {
      this.setState({ extractVerify: false })
    }
  }
  setGoogleVerifyCode(val) {
    this.setState({
      googleVerifyCode: val
    })
  }
  extractGoogleVerify() {
    if (this.state.googleVerifyCode && this.state.googleVerifyCode.trim()) {
      this.setState({ googleVerify: true })
    } else {
      this.setState({ googleVerify: false })
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

  handleSearch() {
    // console.log(`coinid=>${this.state.id}`)
    this.props.dispatch({
      type: 'extract/reset',
      payload: {}
    })
    this.props.dispatch({
      type: 'extract/fetch',
      payload: {
        coinid: this.state.id
      }
    })
  }

  coinAmountValue(e) {
    this.setState({ coinAmount: e })
  }

  extractaddr(item) {
    this.setState({
      extractAddr: item.key
    })
  }

  extractActionSubmit() {
    // if (this.state.extractVerify && this.state.extractAddr.length > 0
    //   && this.state.coinAmount <= this.state.positions && this.state.googleVerifyCode &&
    //   this.state.googleVerifyCode.trim()
    // ) {
      if (!this.state.extractAddr){
          Notification({
              title:intl.get('Reminder'),
              type: 'success',
              message: intl.get('ADDRESS_CANNOT_BE_EMPTY'),
              duration: 2000
          });
          return
      }
      if (!this.state.coinAmount){
          Notification({
              title:intl.get('Reminder'),
              type: 'success',
              message: intl.get('QUANTITY_CANOT_BE_EMPTY'),
              duration: 2000
          });
          return
      }
      // if (!this.state.extractVerify){
      //     Notification({
      //         title:intl.get('Reminder'),
      //         type: 'success',
      //         message: intl.get('QUANTITY_CANOT_BE_EMPTY'),
      //         duration: 2000
      //     });
      //     return
      // }
      this.props.dispatch({
        type: 'extract/fetchExtractAction',
        payload: {
          address: this.state.extractAddr,
          coinid: this.state.id,
          num: this.state.coinAmount,
          secondcode: this.state.googleVerifyCode
        },
        callback: (res) => {
          if (res.success) {
            Notification({
              title:intl.get('Reminder'),
              type: 'success',
              message: intl.get('Withdraw_success'),
              duration: 2000
            });
              this.setState({ extractDialogVisible: false })
          } else {
            Notification({
              title:intl.get('Reminder'),
              type: 'error',
              message:intl.get(res.msg),
              duration: 2000
            });
          }
        }
      })

    // } else {
    //
    // }
  }

  labelValue(value) {
    this.setState({
      label: value
    })
  }

  render() {
    const { extract } = this.props
    const _this = this
    extract.columns = [
      {
        label: intl.get("COIN"),
        prop: "abbreviation",
        width: 80
      },
      {
        label: intl.get("AVAILABLE_AMOUNT"),
        prop: "positions"
      },
      {
        label: intl.get("MINIMUM_WITHDRAW_AMOUNT"),
        prop: "mintransfer"
      },
      // {
      //   label: "最高提币额",
      //   prop: "maxtransfer"
      // },
      // {
      //   label: "手续费率",
      //   prop: "transferfeespercentage",
      //   width:85
      // },
      {
        label: intl.get("FEE"),
        prop: "mintransferfee"
      },
      {
        label: intl.get("ASSER_OPERATION"),
        prop: "operation",
        align: 'right',
        width: 88,
        render: (row, column, index) => {
          return (
            <span className='assetBalanceOperation'>
              <span onClick={_this.extractDialogVisible.bind(this, index, row)}>{intl.get("WITHDRAW")}</span>
            </span>
          )
        }
      }
    ]

    return (
      <div className={styles.infoRequest + " extract"}>
        <div className="title">
            {intl.get("WITHDRAW")}
        </div>
        <Dialog
          title={`crebe ${intl.get("WITHDRAWT")}`}
          visible={this.state.extractDialogVisible}
          onCancel={() => this.setState({ extractDialogVisible: false })}
        >
          <Dialog.Body>
            <p className={styles.balance}>
              <span className={styles.label}>{intl.get("AVAILABLE_AMOUNT")}：</span>
              <span className={styles.number}>{this.state.positions}</span>
            </p>
            <Form model={this.state.extractForm}>
              <Form.Item className="m-form-item">
                <Selectrix
                  multiple={false}
                  materialize={true}
                  tags={true}
                  placeholder={`*${intl.get("PLEASE_SELECT_AN_ADDRESS")}`}
                  options={this.state.addresslist}
                  value={this.state.extractAddr}
                  onChange={ value =>this.setState({extractAddr:value.key})}
                />
              </Form.Item>
              <Form.Item>
                <Input placeholder={intl.get("LABEL_FILLING_IN_ERROS")}
                  onChange={(e) => this.labelValue(e)}
                  value={this.state.label}
                ></Input>
              </Form.Item>
              <Form.Item>
                <Input placeholder={`*${intl.get("AMOUNT")}`}
                  onChange={(e) => this.coinAmountValue(e)}
                  onBlur={(e) => this.extractVerifyAction(e)}
                  value={this.state.coinAmount}
                ></Input>

                <p className={this.state.extractVerify ? styles.hidden : styles.error}>

                    {intl.get("AMOUNTS")}[{this.state.mintransfer}~{this.state.maxtransfer}]之间
                  </p>
              </Form.Item>

              <Form.Item>
                <Input placeholder={intl.get("GOOLE_VERIFICATION")}
                  onChange={(e) => this.setGoogleVerifyCode(e)}
                  onBlur={(e) => this.extractGoogleVerify(e)}
                  value={this.state.googleVerifyCode}
                ></Input>

                <p
                  className={this.state.googleVerify ? styles.hidden : styles.error}
                >
                  {intl.get("REQUIRED")}
                </p>
              </Form.Item>
            </Form>
            <p className="infoTips">
              {intl.get("FEE")}：
              <span>
                 {this.state.mintransferfee}
              </span>
              <span>  /{this.state.coinType}</span>
            </p>
            <ul className={styles.promptMessage}>
              <li>{intl.get("MINIMUM_CASH_WITHDRAWAL")}</li>
              <li>{intl.get("ONCE_YOU_SUBMIT_YOUR_WITDRAWAL")}</li>
              <li>{intl.get("IF_THE_ADDRESS")}</li>
            </ul>
          </Dialog.Body>
          <Dialog.Footer className="dialog-footer">
            <Button type="primary" onClick={() => this.extractActionSubmit()}>{intl.get("SUBMIT_SPACE")}</Button>
          </Dialog.Footer>
        </Dialog>
        <div className={styles.search}>
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
          <Button onClick={this.handleSearch.bind(this)}>{intl.get("ASSER_SEARCH")}</Button>
          {/* <Link className={styles.}></Link> */}
          <Link to='/manager/financeManage/extractReco' className={styles.toRecord}><img src={record} alt="" /> {intl.get("TICK_RECORD")}</Link>
          <div className={styles.clearfix}></div>
        </div>

        <ScrollTable
          columns={extract.columns}
          data={extract.data}
          loading={extract.loading}
          queryAmount={extract.count}
          onScrollDisptchQuery={
            page => {
              console.log(`请求的页码是：${page}`)
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
