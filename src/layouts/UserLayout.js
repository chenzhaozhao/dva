import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Link, Route, Redirect, Switch } from 'dva/router'
import DocumentTitle from 'react-document-title'
import { getNavConfig, getRouteParams } from '../common/nav'
import Header from '../components/Header'
import styles from './UserLayout.less'

@connect(state => ({}))
export default class UserLayout extends PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }

  getChildContext() {
    const { location } = this.props
    return { location }
  }

  UNSAFE_componentWillMount() {
    const { app } = this.props
    const navConfig = getNavConfig(app, 'UserLayout')
    const routeParams = getRouteParams(navConfig,'UserLayout')
    this.routeParams = routeParams
  }

  render() {
    const { location: { pathname } } = this.props
    // const { patnamhe } = location
    let title = '用户中心'
    // debugger
    const getPageTitle = () => {
        this.routeParams.forEach((item) => {
            if (item.path === pathname) {
                title = `用户中心 - ${item.name}`
            }
        })
        return title
    }
    return (
      <DocumentTitle title={getPageTitle()}>
        <div className={styles.container}>
          <Header />
          <div className={styles.main}>
            <Switch>
                {
                    this.routeParams && 
                    this.routeParams.map(item => 
                        <Route 
                            exact={item.exact}
                            key={item.path}
                            path={item.path}
                            component={item.component}
                        />
                    )
                }
                <Redirect exact from="/user" to="/newlogin" />
                <Redirect to="/404" />
            </Switch>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
