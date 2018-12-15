import { post,get } from '../utils/request'

// 资产余额
export async function AssetBalance(params) {
  return post('/member_balance/select', {
    body: params
  })
}
export async function AssetBalanceDetail(params) {
  return post('/member_balance/detail', {
    body: params
  })
}
// 币种
export async function CoinTypes(params) {
  return fetch('/coin/select', {
    method: 'post',
    body: params
  })
  .then(res => res.json())
  .then(res => res)
}
// 充币
export async function Recharge(params) {
  return post('/member_add_coin/select_address', {
    body: params
  })
}

// 充币记录
export async function RechargeReco(params) {
  return post('/member_add_coin/select_log', {
    body: params
  })
}
// 提币
export async function Extract(params) {
  return post('/coin/addresslist', {
    body: params
  })
}

// 提币地址管理
export async function ExtractAddrManage(params) {
  return post('/member_sub_coin/select_address', {
    body: params
  })
}
// 提币记录
export async function ExtractReco(params) {
  return post('/member_sub_coin/select_log', {
    body: params
  })
}
//提币动作
export async function ExtractAction(params) {
  return post('/Member_sub_coin/roll_out', {
    body: params
  })
}
// 增删提币地址
export async function ExtractAddress(params) {
  return post('/member_sub_coin_address/add', {
    body: params
  })
}
export async function ExtractAddressDel(params) {
  return post('/member_sub_coin_address/del', {
    body: params
  })
}


// 历史委托记录
export async function HistoryEntrustReco(params) {
  return post('/coin_entrust/select', {
    body: params
  })
}
// 成交记录
export async function TransactionReco(params) {
  return post('/coin_trade/select', {
    body: params
  })
}
// 分红记录
export async function ProfitReco(params) {
  return post('member_share_out_bonus/select', {
    body: params
  })
}
// 邀请朋友
export async function RecommendFriend(params) {
  return post('/member_ref/get', {
    body: params
  })
}
// 邀请记录
export async function RecommendReco(params) {
  return post('/member_ref/select', {
    body: params
  })
}
// 安全认证
export async function SafeCertifyPwd(params) {
  return post('/member/edit_password', {
    body: params
  })
}
export async function SafeCertifyTradePwd(params) {
  return post('/member/edit_safe_password', {
    body: params
  })
}
export async function SafeCertifyTradePwdResend(params) {
  return post('/member/edit_safe_password_send_mail', {
    body: params
  })
}
export async function SafeCertifyBindPhone(params) {
  return post('/member/bindphone', {
    body: params
  })
}

export async function VerifyPersonalInfomation(params) {
  return post('/IdCard/save', {
    body: params
  })
}
export async function VerifyPersonalStatus(params) {
  return post('/IdCard/checkinfo', {
    body: params
  })
}
//二次验证
//判断状态
export async function GoogleVerifyStatus(params) {
  return post('/Authenticator/checkAuthenticator', {
    body: params
  })
}
//修改状态
export async function GoogleVerifyStatusChange(params) {
  return post('/Authenticator/setAuthenticator', {
    body: params
  })
}
//获取密钥
export async function GoogleVerifyKey(params) {
  return post('/Authenticator/getSecret', {
    body: params
  })
}
// 登录日志
export async function LoginLog(params) {
  return post('/member_login_log/select', {
      body: params
  })
}

//统计
export async function siteDividend(params) {
  return post('/tongji/dividend', {
      body: params
  })
}
//等级榜
export async function getRange(params) {
    return get('/Tongji/refrank',{
        body: params
    })
}
