// api/stream.js
import historyProvider from './historyProvider'
import { WS_URL as socketUrl } from '../../../common/global'
// import io from 'socket.io-client'
var socket = null
var _subs = []

function connect(url, params = {}) {
  socket = new WebSocket(url)
  socket.onopen = () => {
    socket.send(JSON.stringify(params))
  }
  socket.onclose = (e) => {
    setTimeout(() => {
      connect()
    }, 1000)
  }
  socket.onerror = (err) => {
    setTimeout(() => {
      connect()
    }, 1000)
  }
  socket.onmessage = (event) => {
    // here we get all events the CryptoCompare connection has subscribed to
    // we need to send this new data to our subscribed charts
    // debugger
    const _data = event.data.split('~')
    if (_data[0] == '3') {
      // console.log('Websocket Snapshot load event complete')
      return
    }
    // 0~BTC~USDT~51445603~1537859980~0.013~6335
    const data = {
      sub_type: parseInt(_data[0], 10),
      // exchange: _data[1],
      to_sym: _data[1],
      from_sym: _data[2],
      trade_id: _data[3],
      ts: parseInt(_data[4], 10),
      open: parseFloat(_data[5]),
      close: parseFloat(_data[6]),
      price: parseFloat(_data[6]),
      high: parseFloat(_data[7]),
      low:  parseFloat(_data[8]),
      volume: parseFloat(_data[9]),
    }

    const channelString = `${data.sub_type}~${data.to_sym}~${data.from_sym}`;

    const sub = _subs.find(e => e.channelString === channelString);
    if (sub&&window.kline==data.sub_type) {
      // disregard the initial catchup snapshot of trades for already closed candles
      if (data.ts < sub.lastBar.time / 1000) {
        return
      }
        const initDayTime=(()=>{
            if (data.sub_type == '2'){
                return (60*60*24)*1000
            } else{
                return 0;
            }
        })();
      console.log(sub,10)
      const _lastBar = updateBar(data, sub);
      // send the most recent bar back to TV's realtimeUpdate callback
      //   console.log((_lastBar.close),getDecimal([`${data.to_sym}/${data.from_sym}`]))
      // console.log(`更新最后一条k线数据`, _lastBar);
        // const  fixed=getDecimal([`${data.to_sym}/${data.from_sym}`]);
      sub.listener({
        time: parseFloat((_lastBar.time+(initDayTime))),
        high: parseFloat(_lastBar.high),
        low: parseFloat(_lastBar.low),
        open: parseFloat(_lastBar.open),
        close: parseFloat(_lastBar.close),
        volume: parseFloat(_lastBar.volume)
      })
      // update our own record of lastBar
      sub.lastBar = {..._lastBar}
    }
  };
  return socket
}

// Take a single trade, and subscription record, return updated bar
function updateBar(data, sub) {
  const lastBar = sub.lastBar
  let resolution = sub.resolution
  if (resolution.includes('D')) {
    // 1 day in minutes === 1440
    resolution = 1440
  } else if (resolution.includes('W')) {
    // 1 week in minutes === 10080
    resolution = 10080
  }
  const coeff = resolution * 60
  // console.log({coeff})
  const rounded = data.ts
  const lastBarSec = lastBar.time / 1000
  let _lastBar

  // if (rounded >= lastBarSec) {
    // create a new candle, use last close as open **PERSONAL CHOICE**

    _lastBar = {
      time: rounded * 1000,
      open: data.open,
      high: data.high,
      //price: data.price,
      low: data.low,
      close: data.close,
      volume: data.volume
    };
  // } else {
  //   // update lastBar candle!
  //   if (data.price < lastBar.low) {
  //     lastBar.low = data.price
  //   } else if (data.price > lastBar.high) {
  //     lastBar.high = data.price
  //   }
  //
  //   lastBar.volume += data.volume
  //   lastBar.close = data.price
  //   _lastBar = lastBar
  // }
  return _lastBar
}
const DigitRule={
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
    'ETH/USDT':[2,3,4],
    'XRP/USDT':[5,2,2],
    'BCH/USDT':[2,5,4],
    'ADA/USDT':[5,3,4],
    'LTC/USDT':[5,3,4],
    'BTC/USDT':[2,6,4],
    'ETC/USDT':[5,3,4],
};

// takes symbolInfo object as input and creates the subscription string to send to CryptoCompare
function createChannelString(symbolInfo) {
  var channel = symbolInfo.name.split(/[:/]/)
  // const exchange = channel[0] === 'GDAX' ? 'Coinbase' : channel[0]
  const from = channel[3]
  const to = channel[4]
  const fromType = channel[1]
  const toType = channel[2]
  // subscribe to the CryptoCompare trade channel for the pair and exchange
  return {
    from: from,
    to: to,
    fromType: fromType,
    toType: toType
  }
}

export default {
  subscribeBars: (symbolInfo, resolution, updateCb, uid, resetCache) => {
    // // debugger
    const channelString = createChannelString(symbolInfo)
      window.kline=0;
    if (!socket) {
      connect(socketUrl, {
        "ctoin": "add",
        type: 'kline_' + channelString.from + '_' + channelString.to
      });

    } else {
      let  coinType={
          "ctoin": "add",
           type: 'kline_' + channelString.from + '_' + channelString.to
      };
        if (resolution === 'D') {
            coinType.type='kline_day_' + channelString.from + '_' + channelString.to
            window.kline=2;
        } else if (resolution >= 60) {
            window.kline=1;
            coinType.type='kline_hours_' + channelString.from + '_' + channelString.to
        }
      // socket.send(JSON.stringify({
      //   "ctoin": "add",
      //   type: 'kline_' + channelString.from + '_' + channelString.to
      // }))
        socket.send(JSON.stringify(coinType))
    }
    let storeChannelString = window.kline+'~' + channelString.fromType + '~' + channelString.toType;
    const newSub = {
      channelString: storeChannelString,
      uid,
      resolution,
      symbolInfo,
      lastBar: historyProvider.history[symbolInfo.name].lastBar,
      listener: updateCb,
    }
    _subs.push(newSub)
  },
  unsubscribeBars: uid => {
    console.log(`取消本次订阅`)
    const subIndex = _subs.findIndex(e => e.uid === uid)
    if (subIndex === -1) {
      // console.log("No subscription found for ",uid)
      return
    }
    const sub = _subs[subIndex]
    if (!socket) {
      connect(socketUrl, {
        type: 'SubRemove',
        subs: [sub.channelString]
      })
    } else {
      socket.send(JSON.stringify({
        type: 'SubRemove',
        subs: [sub.channelString]
      }))
    }
    _subs.splice(subIndex, 1)
  },
    getDecimal(type){
        let num="1";
        for (let i=0;i<DigitRule[type][0];i++) {
            num+=0
        }
        return Number(num)
    }
}
