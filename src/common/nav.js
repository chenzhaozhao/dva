/**
 * @author ar.insect
 * @description here is the dynamic routing module configured by react
 */
import dynamic from 'dva/dynamic'
import { getPlainNode } from '../utils'
import intl from 'react-intl-universal'
// import Icon from '../components/Icon'
/**
 * @description get the specified layout
 * @param {string} layoutName name
 * @param {*} app
 * @returns react module
 */
export function getLayout(layoutName, app) {
    switch (layoutName) {
        case 'BasicLayout':
            return dynamicWrapper(
                app, ['global', 'user', 'levelProfit'], () => import('../layouts/BasicLayout')
            )
            // break
        case 'UserLayout':
            return dynamicWrapper(
                app, ['global', 'user', 'levelProfit'], () => import('../layouts/UserLayout')
            )
            // break
        case 'ManagerLayout':
            return dynamicWrapper(
                app, ['global', 'user', 'levelProfit'], () => import('../layouts/ManagerLayout')
            )
            // break
        case 'BlankLayout':
            return dynamicWrapper(
                app, ['global', 'user', 'levelProfit'], () => import('../layouts/BlankLayout')
            )
            // break
        default:
            return null
    }
}
/**
 *
 * @param {*} app
 * @param {string} layout
 * @description get navigation object
 */
export const getNavConfig = (app, layout) => {
    if ('BlankLayout' === layout) {
        return {
            name: '首页',
            exact: true,
            path: '/',
            layout: 'BlankLayout',
            component: dynamicWrapper(app, ['home'], () => import('../layouts/BlankLayout')),
            children: [
                {
                    name: 'creb数字资产交易中心-crebe交易所-crebe等级分红-比特币数字货币交易所',
                    path: 'home',
                    component: dynamicWrapper(app, ['announce', 'home'], () => import('../routes/Home')),
                },
                {
                    name: '交易中心',
                    path: 'transaction/:coinid?/:paycoinid?/:cointype?/:paycointype?',
                    component: dynamicWrapper(app, ['transaction', 'home', 'assetBalance'], () => import('../routes/Transaction')),
                },
                {
                    name: '交易中心 - 专业版',
                    path: 'transactionAdvanced/:coinid?/:paycoinid?/:cointype?/:paycointype?',
                    component: dynamicWrapper(app, ['transaction', 'home', 'assetBalance'], () => import('../routes/Transaction/Advanced')),
                },
                {
                    name: '注册',
                    path: 'mregister/:fid?',
                    component: dynamicWrapper(app, [], () => import('../routes/User/mRegister')),
                },
                {
                    name: '海报页面',
                    path: 'posterPage/:fid?',
                    component: dynamicWrapper(app, [], () => import('../routes/User/posterPage')),
                },
                {
                    name: '登录注册',
                    path: 'newlogin/:tab?/:fid?',
                    component: dynamicWrapper(app, [], () => import('../routes/User/newLogin')),
                },
                {
                    name: '忘记密码',
                    path: 'newforgetpwd',
                    component: dynamicWrapper(app, [], () => import('../routes/User/newForgetPwd')),
                },
            ],
        }
    } else if ('BasicLayout' === layout) {
        return {
            name: '首页',
            exact: true,
            path: '/',
            layout: 'BasicLayout',
            component: dynamicWrapper(app, ['home'], () => import('../layouts/BasicLayout')),
            children: [
                {
                    name: '等级分红',
                    path: 'levelProfit',
                    component: dynamicWrapper(app, ['user','levelProfit'], () => import('../routes/LevelProfit')),
                },
                {
                    name: 'CT接龙',
                    path: 'qqGame/:dragonid?',
                    component: dynamicWrapper(app, ['game'], () => import('../routes/QQGame')),
                },
                {
                    name: 'crebe共识',
                    path: 'consensus',
                    component: dynamicWrapper(app, [], () => import('../routes/Consensus')),
                },
                {
                    name: '隐私条款',
                    path: 'privacy',
                    component: dynamicWrapper(app, [], () => import('../routes/Message/privacy')),
                },
                {
                    name: '手续费',
                    path: 'handlingfee',
                    component: dynamicWrapper(app, ['home','handlingfee'], () => import('../routes/Message/handlingfee')),
                },
                {
                    name: '法律声明',
                    path: 'statement',
                    component: dynamicWrapper(app, [], () => import('../routes/Message/statement')),
                },
                {
                    name: '联系我们',
                    path: 'contact',
                    component: dynamicWrapper(app, [], () => import('../routes/Message/contact')),
                },
                {
                    name: '用户协议',
                    path: 'protocol',
                    component: dynamicWrapper(app, [], () => import('../routes/Message/protocol')),
                },
                {
                    name: '买卖盘',
                    path: 'transactionDetails/:coinid?/:paycoinid?/:cointype?/:paycointype?',
                    component: dynamicWrapper(app, ['home', 'transaction'], () => import('../routes/Message/transactionDetails')),
                },

            ],
        }
    } else if ('UserLayout' === layout) {
        return {
            name: '用户中心',
            exact: true,
            path: '/user',
            layout: 'UserLayout',
            component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
            children: [
                {
                    name: '登录',
                    path: 'login',
                    component: dynamicWrapper(app, ['user'], () => import('../routes/User/login')),
                },
                {
                    name: '注册',
                    path: 'register/:fid?',
                    component: dynamicWrapper(app, [], () => import('../routes/User/register')),
                },

                {
                    name: '忘记密码',
                    path: 'forgetPwd',
                    component: dynamicWrapper(app, [], () => import('../routes/User/forgetPwd')),
                },

            ],
        }
    } else if ('ManagerLayout' === layout) {
        return {
            name: intl.get("USER_CENTER"),
            exact: true,
            path: '/manager',
            layout: 'ManagerLayout',
            children: [
                {
                    name: intl.get("FINANCIAL_MANAGEMENT"),
                    icon: 'qianbao',
                    path: 'financeManage',
                    children: [
                        {
                            name: intl.get("ASSET_BALANCE"),
                            path: 'assetBalance',
                            component: dynamicWrapper(
                                app,
                                ['assetBalance'],
                                () => import('../routes/Manager/FinanceManage/assetBalance')
                            ),
                        },
                        {
                            name: intl.get("DEPOSIT"),
                            path: 'recharge',
                            component: dynamicWrapper(
                                app,
                                ['recharge'],
                                () => import('../routes/Manager/FinanceManage/recharge')
                            ),
                        },
                        {
                            name: intl.get("DEPOSIT_HISTORY"),
                            path: 'rechargeReco',
                            component: dynamicWrapper(
                                app,
                                ['rechargeReco'],
                                () => import('../routes/Manager/FinanceManage/rechargeReco')
                            ),
                        },
                        {
                            name: intl.get("WITHDRAW"),
                            path: 'extract',
                            component: dynamicWrapper(
                                app,
                                ['extract','safeCertify'],
                                () => import('../routes/Manager/FinanceManage/extract')
                            ),
                        },
                        {
                            name: intl.get("TICK_RECORD"),
                            path: 'extractReco',
                            component: dynamicWrapper(
                                app,
                                ['extractReco'],
                                () => import('../routes/Manager/FinanceManage/extractReco')
                            ),
                        },
                        {
                            name: intl.get("WITHDRAW_ADDRESS_MANAGE"),
                            path: 'extractAddress',
                            component: dynamicWrapper(
                                app,
                                ['extractAddress'],
                                () => import('../routes/Manager/FinanceManage/extractAddress')
                            ),
                        },
                        {
                            name: intl.get("ASSER_DETAILS"),
                            path: 'assetDetail',
                            component: dynamicWrapper(
                                app,
                                ['assetDetail'],
                                () => import('../routes/Manager/FinanceManage/assetDetail')
                            ),
                        }
                    ]
                },
                {
                    name: intl.get("TRANSACTION_MANAGEMENT"),
                    icon: 'jiaoyi',
                    path: 'transManage',
                    children: [
                        {
                            name: intl.get("CURRENT_COMMOSSION"),
                            path: 'currentEntrustReco',
                            component: dynamicWrapper(
                                app,
                                ['currentEntrustReco', 'transaction'],
                                () => import('../routes/Manager/TransManage/currentEntrustReco')
                            ),
                        },
                        {
                            name: intl.get("HISTIRIAL_COMMISSION_RECORD"),
                            path: 'historyEntrustReco',
                            component: dynamicWrapper(
                                app,
                                ['historyEntrustReco'],
                                () => import('../routes/Manager/TransManage/historyEntrustReco')
                            ),
                        },
                        {
                            name: intl.get("TRANSACTION_RECORD"),
                            path: 'transactionReco',
                            component: dynamicWrapper(
                                app,
                                ['transactionReco'],
                                () => import('../routes/Manager/TransManage/transactionReco')
                            ),
                        },

                    ]
                },
                {
                    name: intl.get("DIVIDEND_STATISTICS"),
                    icon: 'qian',
                    path: 'profitStatistic',
                    children: [
                        {
                            name: intl.get("PROFIT_RECORD"),
                            path: 'profitReco',
                            component: dynamicWrapper(
                                app,
                                ['profitReco'],
                                () => import('../routes/Manager/ProfitStatistic/profitReco')
                            ),
                        },
                    ]
                },
                {
                    name: intl.get("RECOMMENDED_STATISTICS"),
                    icon: 'tongji',
                    path: 'recommendStatistic',
                    children: [
                        {
                            name: intl.get("RECOMMEND"),
                            path: 'recommendFriend',
                            component: dynamicWrapper(
                                app,
                                ['recommendFriend'],
                                () => import('../routes/Manager/RecommendStatistic/recommendFriend')
                            ),
                        },
                        {
                            name: intl.get("RECOMMEND_LIST"),
                            path: 'recommendReco',
                            component: dynamicWrapper(
                                app,
                                ['recommendReco'],
                                () => import('../routes/Manager/RecommendStatistic/recommendReco')
                            ),
                        },
                    ]
                },
                {
                    name: intl.get("SECURITY_SETTINGS"),
                    icon: 'anquan',
                    path: 'safeConfig',
                    children: [
                        {
                            name: intl.get("SAFETY_CERTIFICATE"),
                            path: 'safeCertify',
                            component: dynamicWrapper(
                                app,
                                ['safeCertify'],
                                () => import('../routes/Manager/SafeConfig/safeCertify')
                            ),
                        },
                        {
                            name: intl.get("IDENTITY_VERIFICATION"),
                            path: 'Authentication',
                            component: dynamicWrapper(
                                app,
                                ['authentication'],
                                () => import('../routes/Manager/SafeConfig/Authentication')
                            ),
                        },
                        {
                            name: intl.get("LOGIN_LOG"),
                            path: 'loginLog',
                            component: dynamicWrapper(
                                app,
                                ['loginLog'],
                                () => import('../routes/Manager/SafeConfig/loginLog')
                            ),
                        },
                    ]
                },
            ],
        }
    }

    return null
}

export const getRouteParams = (nav, layout) => {
    if (layout === nav.layout) {
        const clone = {...nav}
        // debugger
        return getPlainNode(clone.children, clone.path)
    }
    return []
}

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
    app,
    models: () => models.map(model => import(`../models/${model}`)),
    component,
})
