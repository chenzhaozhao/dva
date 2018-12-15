// 登录日志
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styles from './loginLog.less'
import ScrollTable from '../../../components/ScrollTable'
import {formatTime} from '../../../utils'
import intl from 'react-intl-universal'
@connect(state => ({
  loginLog: state.loginLog,
}))
export default class LoginLog extends PureComponent {
  state = {
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
      type: 'loginLog/reset',
      payload: {}
    })
  }

  fetchList(params) {
    this.props.dispatch({
      type: 'loginLog/fetch',
      payload: params
    })
  }

  render() {
    const { loginLog } = this.props
// debugger
    loginLog.columns = [
      {
        label: intl.get("LOG_IN_TIME"),
        prop: "time",
        render: function(data){
          return (
            <span>
             {(data.time || '').trim() ? formatTime('yyyy-MM-dd hh:mm:ss', data.time) : ''}
            </span>
          )
        }
      },
      {
        label:intl.get("LOG_IN_IP"),
        prop: "ip",
      },
      {
        label: intl.get("IP_ADDRESS"),
        prop: "ipterritoriality",
      },
      {
        label: intl.get("NOTE"),
        prop: "content",
        align:'right',
        render: (data) => {
          return (
            data && (<span style={data.error ? {"color":"red"}: {}}>
              {data.content}
            </span>)
          )
        }
      }
    ]
    // debugger
    return (
      <div className={styles.loginLog}>
        <div className="title">
            {intl.get("LOGIN_LOG")}
        </div>
        <ScrollTable
          columns={loginLog.columns}
          data={loginLog.data}
          loading={loginLog.loading}
          queryAmount={loginLog.count}
          onScrollDisptchQuery={
            page => { 
              // console.log(`请求的页码是：${page}`,)
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
