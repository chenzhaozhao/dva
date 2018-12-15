import intl from 'react-intl-universal'
import find from 'lodash.find'
// import http from 'axios'
import React, { PureComponent } from 'react'
import { SUPPOER_LOCALES } from './common/global'
import { Router, Route, Switch, Redirect } from 'dva/router'
import { getLayout } from './common/nav'
import { tokenVerify } from './utils'
import NotFound from './routes/Exception/404'
import UpgradeMaintenance from './routes/UpgradeMaintenance'
class App extends PureComponent {

    render() {
        // 加载本地化语言包
        this.loadLocales()

        const { app, history } = this.props
        const BasicLayout = getLayout('BasicLayout', app)
        const UserLayout = getLayout('UserLayout', app)
        const ManagerLayout = getLayout('ManagerLayout', app)
        const BlankLayout = getLayout('BlankLayout', app)
        // debugger
        const passProps = { app }
        const whiteList = ['home', 'transaction', 'transactionAdvanced', 'mregister', 'posterPage', 'newlogin', 'newforgetpwd']
        return (
            <Router history={history}>
                <Switch>
                    <Route path='/404' exact component={NotFound} />
                    <Route path='/upgrade' exact component={UpgradeMaintenance} />
                    <Route path='/user' render={
                      props => (
                        !tokenVerify() ? (
                          <UserLayout {...props} {...passProps} />
                        ) : (
                          <Redirect to='/' />
                        )
                      )
                    } />
                    <Route path='/manager' render={
                      props => (
                        tokenVerify() ? (
                          <ManagerLayout {...props} {...passProps} />
                        ) : (
                          <Redirect to='/newlogin' />
                        )
                      )
                    } />
                    <Route path="/" render={
                      props => {
                        const curPathName = history.location.pathname.split('/')[1]
                        return whiteList.indexOf(curPathName) > -1 ?
                          <BlankLayout {...props} {...passProps} /> :
                          <BasicLayout {...props} {...passProps} />
                        }
                    } />
                </Switch>
            </Router>
        )
    }

    loadLocales() {
      let currentLocale = intl.determineLocale({
        urlLocaleKey: 'lang',
        cookieLocaleKey: 'lang'
      })
      if (!find(SUPPOER_LOCALES, { value: currentLocale })) {
        currentLocale = 'zh-CN'
      }

      /* http
        .get(`locales/${currentLocale}.json`)
        .then(res => {

          // init method will load CLDR locale data according to currentLocale
          return intl.init({
            currentLocale,
            locales: {
              [currentLocale]: res.data
            }
          })
        })
        .then(() => {
          // After loading CLDR locale data, start to render
          this.setState({ initDone: true })
          sessionStorage.setItem('qq-to-locale-lang', currentLocale)
        }) */
      const localeData = require(`../public/locales/${currentLocale}.json`);
      intl.init({
        currentLocale,
        locales: {
          [currentLocale]: localeData
        }
      });
      window.currentLocale=currentLocale;
      sessionStorage.setItem('qq-to-locale-lang', currentLocale)
    }

  }

  export default App
