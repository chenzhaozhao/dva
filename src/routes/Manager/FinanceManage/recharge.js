//充币
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import styles from './recharge.less'
import Icon from '../../../components/Icon'
import { Button } from 'element-react'
import { Message, Dialog,Notification } from 'element-react'
import { AutoComplete } from './AutoComplete'
import copy from 'copy-to-clipboard'
import QRCode from 'qrcode.react'
import ScrollTable from '../../../components/ScrollTable'
import record from '../../../assets/images/record.png'
import labelWarning from '../../../assets/images/labelWarning.png'
import images from '../../../common/images';
import intl from 'react-intl-universal'
@connect(state => ({
  global: state.global,
  recharge: state.recharge
}))
export default class Recharge extends PureComponent {

  constructor(props) {
    super(props)
  }

  state = {
    rechargeDialogVisible: false,
    userWalletAddr: '',
    restaurants: [],
    value: '',
    id: '',
    selectCoinType: '',
    labelRechargeStep: 1,
    labelRechargeDialogVisible: false,
    read: false,
    label: ''
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
      type: 'recharge/reset',
      payload: {}
    })
  }

  fetchList(params) {
    this.props.dispatch({
      type: 'recharge/fetch',
      payload: params
    })
  }

  copyWalletAddr = (addr) => {
    copy(addr)
    Notification({
      title:intl.get('Reminder'),
      type: 'success',
      message: intl.get('Copy_success'),
      duration: 2000
    });
  }

  // copyLabel = (label) =>{
  //   copy(label)
  //   Message('复制成功，如果失败，请手动复制.')
  // }

  rechargeDialogVisible = (index, row) => {
    this.setState({
      rechargeDialogVisible: true,
      userWalletAddr: row.walletaddress,
      selectCoinType: row.coinname
    })
  }

  labelDialogVisible = (index, row) => {
    this.setState({
      labelRechargeDialogVisible: true,
      userWalletAddr: row.walletaddress,
      selectCoinType: row.coinname,
      labelRechargeStep: 1,
      label: row.label
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
      type: 'recharge/reset',
      payload: {}
    })
    this.props.dispatch({
      type: 'recharge/fetch',
      payload: {
        num: '20',
        page: '1',
        coinid: this.state.id,
        search: true
      }
    })
  }

  hasRead() {
    this.setState({
      read: !this.state.read
    })
  }
  CopyAdress(addr){
    copy(addr);
    Notification({
      title:intl.get('Reminder'),
      type: 'success',
      message: intl.get('Copy_success'),
      duration: 2000
    });
  }
  render() {
    const { recharge } = this.props
    const _this = this
    recharge.columns = [
      {
        label: intl.get("COIN"),
        prop: "coinname",
        width: 94
      },
      {
        label: intl.get("DEPOSIT_ADDRESS"),
        prop: "walletaddress",
      },
      {
        label: intl.get("ASSER_OPERATION"),
        prop: "operation",
        align: 'right',
        width: '200',
        render: function (row, column, index) {
          return (
            <span className='assetBalanceOperation'>


              {
                row.coinname === 'EOS' ? '' : (<span onClick={_this.copyWalletAddr.bind(this, row.walletaddress)}>{intl.get("COPY_WALLET_ADDRESS")}</span>)
              }
              {
                row.coinname === 'EOS' ? (<span onClick={_this.labelDialogVisible.bind(this, index, row)}>{intl.get("DEPOSIT")}</span>)
                  : <span onClick={_this.rechargeDialogVisible.bind(this, index, row)}>{intl.get("DEPOSIT")}</span>
              }

            </span>
          )
        }
      }
    ]
    return (
      <div className={styles.recharge + " recharge"}>
        <div className="title">
          {intl.get("DEPOSIT")}
        </div>
        <Dialog
          title={intl.get("DEPOSIT")}
          visible={this.state.rechargeDialogVisible}
          onCancel={(e) => this.setState({ rechargeDialogVisible: false })}
        >
          <Dialog.Body>
            <p className={styles.promptMessage}>{intl.get("PLEASE")} {this.state.selectCoinType} {intl.get("CHARGE_TO_THE_FOLLOWING")}:</p>
            <div className={styles.warp} onDoubleClick={this.CopyAdress.bind(this,this.state.userWalletAddr)} >
              <div className={styles.walletAddrWarp}><div className={styles.titleWarp}>
                  {intl.get("DOUBLE_CLICK_TO_COPY")}
                <div className={styles.arrowup}/></div></div>
              <p  id='address' className={styles.walletAddr}>{this.state.userWalletAddr}</p>
            </div>
            <div className={styles.qrCode}>
              <QRCode size={180} value={this.state.userWalletAddr} />
              <p className={styles.promptMessage}>{intl.get("SCAN_QR_CODE_TO_DEPOSITS")}</p>
            </div>
          </Dialog.Body>
        </Dialog>
        <Dialog
          title={intl.get("DEPOSIT")}
          visible={this.state.labelRechargeDialogVisible}
          onCancel={(e) => this.setState({ labelRechargeDialogVisible: false })}
        >
          <Dialog.Body>
            <div className={this.state.labelRechargeStep === 1 ? styles.labelContent : styles.hidden}>
              <p className={styles.info}>{intl.get("INPORTANT_HINT")}：</p>
              <div className={styles.warningInfo}>
                <img src={labelWarning} />
                <span>{intl.get("REMARKS_AND_ANDDRESSER_CAN__BE")}</span>
              </div>
              <div className={styles.warningContent}>
                <img
                  onClick={this.hasRead.bind(this)}
                  src={this.state.read ? images.checkbox_select : images.checkbox_default}
                />
                <span>{intl.get("IAREADY_KNOWN_THAT")}</span>
              </div>
              <div className={styles.action}>
                {
                  this.state.read ? (<Button type="primary" onClick={() => this.setState({ labelRechargeStep: 2 })}>{intl.get("CONTINU")}</Button>)
                    : (<button className={styles.disableButton}>{intl.get("CONTINUE_TO_REFILL")}</button>)
                }
              </div>
              <div className={styles.tips}>
                <p>{intl.get("CONTINUE_TO_REFILL")}</p>
                <p>{intl.get("TO_REFILL_THE_ADDRESS")}</p>
              </div>
            </div>
            <div className={this.state.labelRechargeStep === 2 ? styles.labelContent : styles.hidden}>
              <div className={styles.warningInfo}>
                <img src={labelWarning} />
                <span>{intl.get("REMARKS_AND_ANDDRESSER_CAN__BE")}</span>
              </div>
              <div className={styles.section}>
                <p className={styles.infoTitle}>{intl.get("CURRENCY_ADDRESS")}</p>
                <div className={styles.infoContainer}>
                  <p className={styles.infoContent}>{this.state.userWalletAddr}</p>
                  <Button type='default'
                    onClick={() => this.copyWalletAddr(this.state.userWalletAddr)}
                  >{intl.get("COPY")}</Button>
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.infoTitle}>{intl.get("COIN_LABEL")}</p>
                <div className={styles.infoContainer}>
                  <p className={styles.infoContent}>{this.state.label}</p>
                  <Button type='default'
                    onClick={() => this.copyWalletAddr(this.state.label)}
                  >{intl.get("COPY")}</Button>
                </div>
              </div>
              <div className={styles.tips}>
                <p>{intl.get("CONTINUE_TO_REFILL")}</p>
                <p>{intl.get("TO_REFILL_THE_ADDRESS")}</p>
              </div>
            </div>
          </Dialog.Body>
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
          />
          <Button onClick={this.handleSearch.bind(this)}>{intl.get("ASSER_SEARCH")}</Button>
          <Link to='/manager/financeManage/rechargeReco' className={styles.toRecord}><img src={record} alt="" /> {intl.get("DEPOSIT_HISTORY")}</Link>
          <div className={styles.clearfix} />
        </div>

        <ScrollTable
          columns={recharge.columns}
          data={recharge.data}
          loading={recharge.loading}
          queryAmount={recharge.count}
          onScrollDisptchQuery={
            page => {
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
