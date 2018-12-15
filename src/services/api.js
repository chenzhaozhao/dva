import request, { post } from '../utils/request'

//用户层面
export async function LoginOut(params){
  return request('/member/out',{
    method:'POST',
    body: params
  })
}

export async function Login1(params){
  return request('/member/login1',{
    method:'POST',
    body: params
  })
}

export async function Login2(params){
  return request('/member/login2',{
    method:'POST',
    body: params
  })
}
// 自选
export async function Favorites(params){
  return request('/tradepair/favorite',{
    method:'POST',
    body: params
  })
}
//添加自选
export async function AddFavorites(params){
  return request('/tradepair/add_favorite',{
    method:'POST',
    body: params
  })
}
//删除自选
export async function DelFavorites(params){
  return request('/tradepair/del_favorite',{
    method:'POST',
    body: params
  })
}

export async function Register1(params){
  return request('/member/reg1',{
    method:'POST',
    body: params
  })
}

export async function Register2(params){
  return request('/member/reg2',{
    method:'POST',
    body: params
  })
}
//注册验证码重新发送
export async function RegMailSend(params){
  return request('/member/reg_mail_send',{
    method:'POST',
    body: params
  })
}

export async function CheckEmail(params){
  return request('/member/check_email',{
    method:'POST',
    body: params
  })
}

export async function CheckNickname(params){
  return request('/member/check_nickname',{
    method:'POST',
    body: params
  })
}

//找回密码
export async function ForgetPwdSetp1(params){
  return request('/member/forgetpwdsetp1', {
    method:'POST',
    body: params
  })
}

export async function ForgetPwdSetp2(params){
  return request('/member/forgetpwdsetp2', {
    method:'POST',
    body: params
  })
}

export async function ForgetPwdResend(params){
  return request('/member/forgetpwd_send', {
    method:'POST',
    body: params
  })
}

//用户信息
export async function userInfo(params){
  return request('/member/find', {
    method:'POST',
    body: params
  })
}

//用户昨日分红
export async function UserYesterdayProfit(params){
  return request('/member/fenhong', {
    method:'POST',
    body: params
  })
}

//用户分红公告
export async function profitNewsBoard(params){
  return request('/share_out/site_share_out', {
    method:'POST',
    body: params
  })
}

//首页分红榜单
export async function profitNewsTopBoard(params){
  return request('/share_out/site_share_user_top', {
    method:'POST',
    body: params
  })
}
export async function profitYesterdayTopBoard(params){
  return request('/share_out/site_share_user_top_yesterday', {
    method:'POST',
    body: params
  })
}
// 首页涨幅榜
export async function riseList(params={}) {
  return request('/kline/rise_list', {
    method:'POST',
    body: params
  })
}
// 首页跌幅榜
export async function declinesList(params={}) {
  return request('/kline/drop_range', {
    method:'POST',
    body: params
  })
}
// 首页市场交易对
export async function market(params) {
  return request('/tradepair/market_tradepair', {
    method:'POST',
    body: params
  })
}
// 交易中心 - 最新成交(公开接口强制不传用户信息)
export async function newTransReco(params) {
  return post('/coin_trade/new_drade', {
    body: params
  }, true)
}
// 交易中心 - 即时委托列表(公开接口强制不传用户信息)
export async function commissionList(params) {
  return post('/coin_entrust/select_sort', {
    body: params
  }, true)
}
// 币种查询
export async function Coin(params) {
  return request('/coin/search', {
    method: 'POST',
    body: params
  })
}
export async function CoinExchangeRate(params) {
  return request('/coin/rmbrate', {
    method: 'POST',
    body: params
  })
}
//提币手续费列表
export async function RollOutFee(params){
  return request('/coin/roll_out_fee',{
    method : 'POST',
    body: params
  })
}

// 公告
export async function Announce(params){
  return request('/announce/select',{
    method : 'POST',
    body: params
  })
}

//委托相关
export async function EntrustReco(params){
  return request('/coin_entrust/select',{
    method : 'POST',
    body: params
  })
}
export async function EntrustRevoke(params){
  return request('/Coin_entrust/market_entrust_revoke',{
    method : 'POST',
    body: params
  })
}
export async function EntrustMarket(params){
  return request('/Coin_entrust/market_now_entrust',{
    method : 'POST',
    body: params
  })
}
export async function EntrustMarketHistory(params){
  return request('/Coin_entrust/market_historical_entrust',{
    method : 'POST',
    body: params
  })
}
export async function EntrustTracsactionReco(params){
  return request('/Coin_entrust/market_entrusted',{
    method : 'POST',
    body: params
  })
}

//购买会员
export async function vipBuy(params){
  return request('/vip/buy',{
    method : 'POST',
    body: params
  })
}
export async function vipList(params){
  return request('/vip/viplist',{
    method : 'GET',
    ...params
  })
}

//qq接龙列表
export async function dragonGameList(params){
  return request('/dragon/select',{
    method : 'POST',
    body: params
  })
}

export async function dragonBuy(params){
  return request('/dragon/buy',{
    method : 'POST',
    body: params
  })
}
export async function dragonBuyFree(params){
  return request('/Dragon/freeBuy',{
    method : 'POST',
    body: params
  })
}
export async function dragonBuyFreeTimes(params){
  return request('/Dragon/freeDragon',{
    method : 'POST',
    body: params
  })
}
export async function dragonDetail(params){
  return request('/Dragon/find',{
    method : 'POST',
    body: params
  })
}
// 买入卖出
export async function trade(params){
  return request('/coin_entrust/gateway',{
    method : 'POST',
    body: params
  })
}
//急速驗證
export async function authCode(params) {
         return request('/Geetest/StartCaptchaServlet',{
           method : 'POST',
           body: params
         })
}
//急速驗證
export async function SecondAuthCode(params) {
  return request('/Geetest/VerifyLoginServlett',{
    method : 'POST',
    body: params
  })
}
//等级榜
export async function getRange(params) {
    return request('/Tongji/levelrank',{
        method : 'GET',
        ... params
    })
}
//推荐榜
export async function getFrank(params) {
    return request('/Tongji/refrank',{
        method : 'GET',
        ... params
    })
}
export async function getissue(params) {
    return request('/Tongji/issue',{
        method : 'GET',
        ... params
    })
}
export async function getNews(params) {
    return request('/index/news',{
        method : 'GET',
        ... params
    })
}
