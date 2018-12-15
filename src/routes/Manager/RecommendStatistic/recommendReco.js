// 邀请记录
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styles from './recommendReco.less'
import { Layout, Table } from 'element-react'
import ScrollTable from '../../../components/ScrollTable'
import {formatTime} from '../../../utils'
import intl from 'react-intl-universal'
@connect(state => ({
  recommendReco: state.recommendReco,
  user:state.user
}))
export default class RecommendReco extends PureComponent {
  state = {
    columns: [
      {
        label: intl.get("REGISTRATION_DATE"),
        prop: "registerDateTime",
      },
      {
        label: intl.get("NICKNAME"),
        prop: "nickname",
      },
      {
        label: intl.get("LOCATION"),
        prop: "city",
        align:'right'
      }
    ],
    data: [{
      registerDateTime: '2018-07-21 15:20:10',
      nickname: '张晓松',
      city: '海南岛',
    }, {
      registerDateTime: '2018-07-21 15:20:10',
      nickname: '张晓松',
      city: '海南岛',
    }]
  };

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
      type: 'recommendReco/reset',
      payload: {}
    })
  }

  fetchList(params) {
    console.log('请求数据')
    this.props.dispatch({
      type: 'recommendReco/fetch',
      payload: params
    })
  }

  render() {
    const { recommendReco } = this.props
    recommendReco.columns = [
      {
        label: intl.get("REGISTRATION_DATE"),
        prop: "addtime",
        render: function(row,column,index){
          return (
            <span>
             {(row.addtime || '').trim() ? formatTime('yyyy-MM-dd hh:mm:ss', row.addtime) : ''}
            </span>
          )
        }
      },
      {
        label: intl.get("NICKNAME"),
        prop: "username",
      },
      {
        label: intl.get("LOCATION"),
        prop: "address",
        align:'right'
      }
    ]
    return (
      <div className={styles.recommendReco}>
        <div className="title">
            {intl.get("RECOMMEND_LIST")}
        </div>
        <Layout.Row className={styles.amount}>
          <Layout.Col span="12">
            <div className={styles.title}>{intl.get("ACCOUMMULATED_RECOMMENDATIONS")}</div>
            <div className={styles.number}>{this.props.user.invitationnumber}</div>
          </Layout.Col>
          <Layout.Col span="12">
            <div className={styles.title}>{intl.get("RECOMMENDED_INVITATION")}</div>
            <div className={styles.number}>{this.props.user.today_number}</div>
          </Layout.Col>
        </Layout.Row>
        <ScrollTable
          columns={recommendReco.columns}
          data={recommendReco.data}
          loading={recommendReco.loading}
          queryAmount={recommendReco.count}
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
