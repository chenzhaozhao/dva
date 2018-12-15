import find from 'lodash.find'
import remove from 'lodash.remove'
import intl from 'react-intl-universal'
export function getPlainNode(nodeList = [], parentPath = '') {
  const arr = []
  nodeList.forEach(node => {
    node.path = `${parentPath}/${node.path || ''}`.replace(/\/+/g, '/')
    node.exact = true
    node.key = node.path
    if (node.children && !node.component) {
      arr.push(...getPlainNode(node.children, node.path))
    } else {
      if (node.children && node.component) {
        node.exact = false
      }
      arr.push(node)
    }
  })
  return arr
}

//手机验证
export function checkMobile(str) {
  let reg = /^1\d{10}$/
  if (reg.test(str)) {
    return true
  } else {
    return false
  }
}

export function getLength(str) {

  if (str.length !== 0) {
    var res = [0, 0, 0, 0]
    if (/\d/g.test(str)) {
      res[0] = str.match(/\d/g).length
    }
    if (/[a-z]/g.test(str)) {
      res[1] = str.match(/[a-z]/g).length
    }
    if (/[A-Z]/g.test(str)) {
      res[2] = str.match(/[A-Z]/g).length
    }
    if (/[~!@#$%^&*()_+]/g.test(str)) {
      res[3] = str.match(/[~!@#$%^&*()_+]/g).length
    }
    return res
  }
  return [0, 0, 0, 0]
}
//密码验证
export function getPwdVerify(str) {
  if (str) {
    // if (!(/[A-Z]/g.test(str))) {
    //   return {result:false,content:intl.get("IT_CONTAINS_AT_LEAST_ONE_CAPITAL")};
    // }
    // if (!(/[a-z]/g.test(str))) {
    //   return {result:false,content:intl.get("IT_CONTAINS_AT_LEAST_ONE_LOWERCASE")};
    // }
    //
    // if (!(/\d/g.test(str))) {
    //   return {result:false,content: intl.get("CONTAIN_AT_LEAST_DIGITS")};
    // }
    //   if (!(/[~!@#$%^&*()_+,.?]/g.test(str))) {
    //       return {result:false,content:intl.get("IT_CONTAINS_AT_LEAST_ONE_SPECIAL_CHARACTER")};
    //   }
   // if (str.length<8){
   //   return {result:false,content:intl.get("PASSWORD_LEAST")};
   // }
      if (str.length<8||str.length>16){
          return {result:false,content:intl.get("PASSWORD_LEAST_SIXTEN")};
      }
   return {result:true,content:''};
  }
  return {result:false,content:intl.get("REQUIRED")};
  // if (str){
  //   switch (str){
  //     case !(/[~!@#$%^&*()_+,.?]/g.test(str)):
  //       return {result:false,content:'至少包含一个特殊字符'};
  //     case !(/[a-z]/g.test(str)):
  //       return {result:false,content:'至少包含一个小写字母'};
  //     case !(/[A-Z]/g.test(str)):
  //       return {result:false,content:'至少包含一个大写字母'};
  //     case !(/\d/g.test(str)):
  //       return {result:false,content:'必须包含数字'};
  //     default:
  //       return {result:true,content:''};
  //   }
  // }

}
//邮箱验证
export function emailVerify(str) {
  var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
  if (!reg.test(str)) {
    return false
  } else {
    return true
  }
}

//判断token是否有效
export function tokenVerify() {
  var str = window.sessionStorage.getItem('_token_');
  var userid = window.sessionStorage.getItem('_userid_');
  if (str && str.trim().length > 0 && userid && userid.trim()) {
    return true
  } else {
    return false
  }
}
export function saveUserInfo(key,value) {
    window.sessionStorage.setItem(String(key),value)
}
export function clearUserInfo(key) {
    window.sessionStorage.removeItem('_token_');
    window.sessionStorage.removeItem('_userid_');
}
export function getUserInfo() {
    const token = window.sessionStorage.getItem('_token_');
    const userid = window.sessionStorage.getItem('_userid_');
    return {token,userid}
}
//时间格式化
export function formatTime(fmt, time) {
  if (typeof time === 'number') {
    time = time * 1000
  } else {
    time = parseInt(time) * 1000
  }
  var o = {
    "M+": new Date(time).getMonth() + 1, //月份
    "d+": new Date(time).getDate(), //日
    "h+": new Date(time).getHours(), //小时
    "m+": new Date(time).getMinutes(), //分
    "s+": new Date(time).getSeconds(), //秒
    "q+": Math.floor((new Date(time).getMonth() + 3) / 3), //季度
    "S": new Date(time).getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (new Date(time).getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
  return fmt
}

//时间格式化
export function formatTimeZh(fmt, time) {
  if (typeof time === 'number') {
    time = time * 1000
  } else {
    time = parseInt(time) * 1000
  }
  var o = {
    "M+": new Date(time).getMonth() + 1, //月份
    "d+": new Date(time).getDate(), //日
    "h+": new Date(time).getHours(), //小时
    "m+": new Date(time).getMinutes(), //分
    "s+": new Date(time).getSeconds(), //秒
    "q+": Math.floor((new Date(time).getMonth() + 3) / 3), //季度
    "S": new Date(time).getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (new Date(time).getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
  return fmt
}

//退出
export function logout() {
  localStorage.setItem('_token_', '')
  localStorage.setItem('_userid_', '')
  window.location.href = '/'
}

export function scrollToAnchor(anchorName) {
  if (anchorName) {
    let anchorElement = document.getElementById(anchorName)
    if (anchorElement) { anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' }) }
  }
}

//会员等级加速
export function vipSpeedup(type) {
  if (type === '2') {
    return 2
  } else if (type === '3') {
    return 3
  } else if (type === '4') {
    return 10
  } else {
    return 1
  }
}

export function replArrayItem(origin, target, keyName = 'id') {

  const newArray = origin.map(item => {
    let listItem
    for (let it of target) {

      if (it[keyName] == item[keyName]) {
        if (item.nowprice && it.nowprice) {

          let price1 = item.nowprice.split('/')[0]
          let price2 = it.nowprice.split('/')[0]
          if (parseFloat(price1) > parseFloat(price2)) {
            it.change = -1
          } else if (parseFloat(price1) < parseFloat(price2)) {
            it.change = 1
          } else if (parseFloat(price1) === parseFloat(price2)) {
            it.change = 0
          }
          listItem = { ...item, ...it }
          break
        }
        listItem = { ...item, ...it }
      } else {
        listItem = item
      }
    }
    return listItem
  })
  return [...newArray]
}

export function saveFavorite(action, origin, target) {
  // debugger
  if (!action) return
  if ('add' === action) {
    if (!find(origin, ['id', target.id])) {
      target.selfChoose = true
      origin.push(target)
    }
  } else if ('del' === action) {
    const it = find(origin, ['id', target.id])
    if (it) {
      remove(origin, item => item.id === it.id)
      target.selfChoose = false
    } else {
      target.selfChoose = false
    }
  }
  localStorage.setItem(
    '_favorite_',
    origin.map(item => item.id).join(',')
  )
  return [...origin]
}

//动态加载zendesk
export function createScript(url, callback) {
  var oScript = document.createElement('script');
  oScript.type = 'text/javascript';
  oScript.async = true;
  oScript.src = url;
  oScript.id = 'ze-snippet'
  /*
  ** script标签的onload和onreadystatechange事件
  ** IE6/7/8支持onreadystatechange事件
  ** IE9/10支持onreadystatechange和onload事件
  ** Firefox/Chrome/Opera支持onload事件
  */

  // 判断IE8及以下浏览器
  var isIE = !-[1,];
  if (isIE) {
    //alert('IE')
    oScript.onreadystatechange = function () {
      if (this.readyState == 'loaded' || this.readyState == 'complete') {
        callback();
      }
    }
  } else {
    // IE9及以上浏览器，Firefox，Chrome，Opera
    oScript.onload = function () {
      callback();
    }
  }
  document.head.appendChild(oScript);
}

export function isCardNumber(card) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(card) === false) {
    return false;
  } else {
    return true
  }
}

//判断浏览器是移动端还是PC
export function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
  var flag = true;
  for (var i = 0; i < Agents.length; i++) {
    if (userAgentInfo.indexOf(Agents[i]) != -1) {
      flag = false;
      break;
    }
  }
  return flag;
}

//根据对象属性进行排序
export function objectAttrSort(a, b) {

  //return parseInt(b.price.split(",").join("")) - parseInt(a.price.split(",").join(""))
  return parseFloat(b.price) - parseFloat(a.price)
}
//根据对象属性进行排序 反向
export function antiObjectAttrSort(a, b) {

  //return parseInt(b.price.split(",").join("")) - parseInt(a.price.split(",").join(""))
  return parseFloat(a.price) - parseFloat(b.price)
}
//正向
export function fluctuationObjectAttrSort(a, b) {

  //return parseInt(b.price.split(",").join("")) - parseInt(a.price.split(",").join(""))
  return parseFloat(b.fluctuation) - parseFloat(a.fluctuation)
}
//反向
export function antiFluctuationObjectAttrSort(a, b) {

  //return parseInt(b.price.split(",").join("")) - parseInt(a.price.split(",").join(""))
  return parseFloat(a.fluctuation) - parseFloat(b.fluctuation)
}
/*
* [价格小数位,数量小数位,金额小数位]
* */
var DigitRule={
  'CT/BTC':[8,1,4],
  'ETH/BTC':[6,3,4],
  'LTC/BTC':[6,2,4],
  'BCH/BTC':[6,3,4],
  'XRP/BTC':[8,1,2],
  'ADA/BTC':[8,1,2],
  'EOS/BTC':[8,1,2],
  'ETC/BTC':[6,2,4],
  'CT/ETH':[8,1,4],
  'EOS/ETH':[6,2,2],
  'ETC/ETH':[6,2,4],
  'XRP/ETH':[8,1,0],
  'BCH/ETH':[5,1,4],
  'ADA/ETH':[8,1,4],
  'LTC/ETH':[6,2,4],
  'BTC/ETH':[5,3,4],
  'CT/USDT':[4,3,4],
  'EOS/USDT':[4,2,4],
  'ETH/USDT':[2,5,4],
  'XRP/USDT':[5,2,2],
  'BCH/USDT':[2,5,4],
  'ADA/USDT':[5,3,4],
  'LTC/USDT':[5,3,4],
  'BTC/USDT':[2,6,4],
  'ETC/USDT':[5,3,4],
};
/*
* @parme:交易对
*
* */
export function getDecimal(type) {
    return DigitRule[type][0]
}
//交易中心
//限制数字长度
/*
* @parme:交易对
* @parme:数据，
* @parme:类型
* */

export  function getDigits(type,number,index) {
  if (number){

    var numArr=number.split(".");
    var integer=numArr[0];
    var decimal=numArr[1]?numArr[1].slice(0,DigitRule[type][index]):"";
    if (decimal){
      return integer+"."+decimal
    } else {
      return number
    }

  }
return number;
}
//限制数字长度
/*
* @parme:交易对
* @parme:数据，
* @parme:类型
* */
export function limitDecimal(type,number,index) {
    number=String(number);
  if (number){
    var limitLen=DigitRule[type][index];
    var numArr=number.split(".");
    if (numArr[1]&&numArr.length<=1) {
      if (numArr[1].length <= limitLen) {
        return number;
      } else {
        return numArr[0]+"."+numArr[1].slice(0, limitLen);
      }
    }
    if (numArr.length>1){
      return numArr[0]+"."+numArr[1].slice(0, limitLen);
    }
  }
  return number;
}
