import React, { PureComponent } from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Link, Route, Redirect, Switch } from 'dva/router'
import DocumentTitle from 'react-document-title'
import { getNavConfig, getRouteParams } from '../common/nav'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Account from '../routes/Manager/Account'
import { Menu } from 'element-react'
import Icon from '../components/Icon'
import { scrollToAnchor } from '../utils'
import intl from 'react-intl-universal'
import styles from './ManagerLayout.less'

@withRouter
@connect(state => ({}))
export default class ManagerLayout extends PureComponent {

    state = {
        defaultActive: '' // 默认菜单选择项
    }

    menuSelect(pathname) {
        this.setState({
            defaultActive: pathname
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged()
        }
    }

    onRouteChanged() {
        // console.log("ROUTE CHANGED", this.props.location.pathname)
        this.setState({
            defaultActive: this.props.location.pathname
        })
    }

    UNSAFE_componentWillMount() {
        document.body.setAttribute('id', 'manager-container')
        const { app, location: { pathname } } = this.props
        const navConfig = getNavConfig(app, 'ManagerLayout')
        const routeParams = getRouteParams(navConfig, 'ManagerLayout')
        this.routeParams = routeParams
        this.navItems = navConfig
        this.setState({
            defaultActive: pathname
        })
    }

    componentWillUnmount() {
        document.body.removeAttribute('id')
    }

    changeRouter(pathname) {
        this.props.history.replace({
            pathname: pathname,
        })
        const timer = setTimeout(() => {
            scrollToAnchor('manager-container')
            clearTimeout(timer)
        }, 100)
    }

    render() {
        const { location: { pathname } } = this.props
        // const { patnamhe } = location
        let title = '管理中心'
        const getPageTitle = () => {
            this.routeParams.forEach((item) => {
                if (item.path === pathname) {
                    title = `${intl.get("USER_CENTER")} - ${item.name}`
                }
            })
            return title
        }

        return (
            <DocumentTitle title={getPageTitle()}>
                <div className="manager">
                    <Header />
                    <div className="main">
                        <div className="left-side">
                            <Account />
                            <Menu
                                mode="vertical"
                                defaultActive={this.state.defaultActive}
                                onSelect={this.menuSelect.bind(this)}>
                                {
                                    this.navItems.children && this.navItems.children.map(item =>
                                        <Menu.ItemGroup
                                            title={item.name}
                                            key={item.key}
                                        >
                                            <Icon size="16" color="#999" type={item.icon} style={{ margin: '-33px 0 10px 19px', display: 'block' }} />
                                            {
                                                item.children && item.children.map(item => {
                                                    if (item.name === '充币记录' || item.name === '提币记录'||item.name==="Withdrawal records"||item.name==="Deposit History") {
                                                        return
                                                    }
                                                        return (
                                                            <Menu.Item
                                                                key={item.key}
                                                                index={item.key}>
                                                                <a onClick={this.changeRouter.bind(this, item.path)}
                                                                >
                                                                    {item.name}
                                                                </a>
                                                            </Menu.Item>
                                                        )
                                                    }


                                                )
                                            }
                                        </Menu.ItemGroup>
                                    )
                                }
                            </Menu>
                        </div>
                        <div className="right-content">
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
                                <Redirect exact from="/manager" to="/manager/financeManage/assetBalance" />
                                <Redirect to="/404" />
                            </Switch>
                        </div>
                    </div>
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
                </div>
            </DocumentTitle>
        )
    }
}
