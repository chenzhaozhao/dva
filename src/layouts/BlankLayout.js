import React, { PureComponent } from 'react'
import DocumentTitle from 'react-document-title'
import { Route, Redirect, Switch } from 'dva/router'
import { getNavConfig, getRouteParams } from '../common/nav'

export default class BlankLayout extends PureComponent {

    UNSAFE_componentWillMount() {
        const { app } = this.props
        // debugger
        const navConfig = getNavConfig(app, 'BlankLayout')
        const routeParams = getRouteParams(navConfig, 'BlankLayout')
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
        // debugger
        return (
            <DocumentTitle title={getPageTitle()}>
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
                    <Redirect to="/404" />
                </Switch>
            </DocumentTitle>
        )
    }
}
