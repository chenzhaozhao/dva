// import rp from 'request-promise'
import { post } from '../../../utils/request'
const history = {}

export default {
	history: history,
    getBars: function(symbolInfo, resolution, from, to, first) {
		// debugger
		const split_symbol = symbolInfo.name.split(/[:/]/)
		let url
		if (resolution === 'D') {
			url = 'kline/day'
		} else if (resolution >= 60) {
			url = 'kline/hour'
		} else {
			url = 'kline/minute'
		}
		//const url = resolution === 'D' ? 'kline/day' : resolution >= 60 ? '/kline/hour' : 'kline/minute'
		const qs = {
			from,
			to,
			coinid: split_symbol[3],
			paycoinid: split_symbol[4]
		}
		const initDayTime=(()=>{
			if (resolution === 'D'){
				return 60*60*24
			} else{
				return 0;
			}
		})();
        return post(url, {
			method: 'post',
			body: qs
		})
		.then(data => {
			// debugger
			if (!data.success) {
				return []
			}
			if (data.data.length) {
				// console.log(`Actually returned: ${new Date(data.TimeFrom * 1000).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`)
				const bars = data.data.map(el => ({
					time: (el.time+(initDayTime)) * 1000, //TradingView requires bar time in ms
					low: el.low,
					high: el.high,
					open: el.open,
					close: el.close,
					volume: el.volumefrom
				}))
				if (first) {
					
					const lastBar = bars[bars.length - 1]
					history[symbolInfo.name] = {lastBar: lastBar}
				}
				return bars
			} else {
				return []
			}
		})
	}
}
