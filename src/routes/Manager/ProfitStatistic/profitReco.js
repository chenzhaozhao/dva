// 分红记录
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styles from './profitReco.less'
import { Layout } from 'element-react'
import ScrollTable from '../../../components/ScrollTable'
import {formatTime} from '../../../utils'
import intl from 'react-intl-universal'
@connect(state => ({
  profitReco: state.profitReco
}))
export default class ProfitReco extends PureComponent {

  state = {

  }

  componentDidMount() {
    this.fetchList({
      num: '20',
      page: '1'
    })
    this.fetchTongjiDividend()
  }

  componentWillUnmount(){
    this.resetList({})
  }

  resetList(){
    this.props.dispatch({
      type: 'profitReco/reset',
      payload: {}
    })
  }

  fetchList(params) {
    this.props.dispatch({
      type: 'profitReco/fetch',
      payload: params
    })
  }

  fetchTongjiDividend(){
    this.props.dispatch({
      type: 'profitReco/dividend',
      payload: {}
    })
  }

  render() {
    const { profitReco } = this.props
    profitReco.columns = [
      {
        label: intl.get("DIVIDEND"),
        prop: "time",
        render: function(row,column,index){
          return (
            <span>
             {formatTime('yyyy-MM-dd hh:mm:ss', row.time)}
            </span>
          )
        }
      },
      {
        label: intl.get("PROFIT_AMOUNT"),
        prop: "sharenumber",
      },
      {
        label: intl.get("PROFIT_TYPE"),
        prop: "type",
        align:'right',
        render: (row, column) => {
          switch (row.type) {
            case '1':
              return intl.get("PLATFORM_PROFIT");
            case '2':
              return intl.get("REFERAL_PROFIT");
            case '3':
              return intl.get("CT_SOLITAIRE");
            default:
              return ""
          }
        }
      }
    ]
    return (
      <div className={styles.profitReco}>
        <div className="title">
            {intl.get("PROFIT_RECORD")}
        </div>
        <Layout.Row className={styles.amount}>
          <Layout.Col span="12">
            <div className={styles.title}>{intl.get("ALL_ACCUMULATED_PROFIT")}</div>
            <div className={styles.number}>{this.props.profitReco.all_dividend}</div>
          </Layout.Col>
          <Layout.Col span="12">
            <div className={styles.title}>{intl.get("DAIY_PROFIT")}</div>
            <div className={styles.number}>{this.props.profitReco.today_dividend}</div>
          </Layout.Col>
        </Layout.Row>
        <ScrollTable
          columns={profitReco.columns}
          data={profitReco.data}
          loading={profitReco.loading}
          queryAmount={profitReco.count}
          onScrollDisptchQuery={
            page => {
              //console.log(`请求的页码是：${page}`,)
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
