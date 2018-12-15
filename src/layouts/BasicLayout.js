import React, { PureComponent } from 'react'
import DocumentTitle from 'react-document-title'
import { Route, Redirect, Switch } from 'dva/router'
import { Layout } from 'element-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getNavConfig, getRouteParams } from '../common/nav'
import styles from './BasicLayout.less'

export default class BasicLayout extends PureComponent {

    UNSAFE_componentWillMount() {
        const { app } = this.props
        // debugger
        const navConfig = getNavConfig(app, 'BasicLayout')
        const routeParams = getRouteParams(navConfig, 'BasicLayout')
        this.routeParams = routeParams
    }

    render() {
        const { location: { pathname } } = this.props
        // const { patnamhe } = location
        let title = 'crebe'
        const getPageTitle = () => {
            this.routeParams.forEach(item => {
                if (item.path === pathname) {
                    title = `crebe - ${item.name}`
                }
            })
            return title
        }
        const layout = (
            <div className={styles.container}>
                <Layout.Row>
                    <Layout.Col span="24">
                        <Header />
                    </Layout.Col>
                </Layout.Row>
                <Layout.Row>
                    <Layout.Col span="24">
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
                                <Redirect exact from="/" to="/home" />
                                <Redirect to="/404" />
                            </Switch>
                        </div>
                    </Layout.Col>
                </Layout.Row>
                <Layout.Row>
                    <Layout.Col span="24">
                        <Footer 
                            links={[{
                                title: 'xxxx',
                                href: 'http://www.xikeyun.cn/',
                                blankTarget: true,
                            }]}
                            copyright={
                                <div>
                                    Copyright dssddssd
                                </div>
                            }
                        />
                    </Layout.Col>
                </Layout.Row>
            </div>
        )
        return (
            <DocumentTitle title={getPageTitle()}>
                {layout}
            </DocumentTitle>
        )
    }
}
