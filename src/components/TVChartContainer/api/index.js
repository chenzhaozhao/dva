import historyProvider from './historyProvider'
import stream from './stream'
// 数据流定制
const supportedResolutions = ['1', '3', '5', '15', '30', '60', '120', '240', "1D"]

const config = {
    supported_resolutions: supportedResolutions
};

export default {
	onReady: cb => {
		console.log('=====onReady running')	
		setTimeout(() => cb(config), 0)
	},
	searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
		console.log('====Search Symbols running')
	},
	// 解析商品信息
	resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
		// expects a symbolInfo object in response
		console.log('======resolveSymbol running', symbolName)
		// console.log('resolveSymbol:',{symbolName})
		const split_data = symbolName.split(/[:/]/)
		// console.log({split_data})
		console.log(stream.getDecimal(window.Pair));
		const symbol_stub = {
			name: symbolName,
			description: '',
			type: 'crypto',
			session: '24x7',
			timezone: 'Asia/Shanghai', // 商品时区(指的是tv图表整体的时区) // https://b.aitrade.ga/books/tradingview/book/Symbology.html#timezone
			ticker: symbolName,
			//exchange: split_data[0],
			minmov: 1,
			pricescale: stream.getDecimal(window.Pair),
			// studis_overrides: {    "moving average.precision" : 8 },
			has_intraday: true,
			intraday_multipliers: ['1', '60',"1D"],
			supported_resolution:  supportedResolutions,
			volume_precision: 6,
			data_status: 'streaming',
		}

		setTimeout(() => {
			onSymbolResolvedCallback(symbol_stub)
			console.log('Resolving that symbol....', symbol_stub)
		}, 0)
		// onResolveErrorCallback('Not feeling it today')
	},
	getBars: (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
		//console.log('=====getBars running')
		// console.log('function args',arguments)
		// debugger
		console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
		historyProvider.getBars(symbolInfo, resolution, from, to, firstDataRequest)
		.then(bars => {
			//debugger
			if (bars.length) {
				onHistoryCallback(bars, {noData: false})
			} else {
				onHistoryCallback(bars, {noData: true})
			}
		}).catch(err => {
			console.log({err})
			onErrorCallback(err)
		})
	},
	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
		console.log('=====subscribeBars runnning')
		stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
	},
	unsubscribeBars: subscriberUID => {
		console.log('=====unsubscribeBars running')
		stream.unsubscribeBars(subscriberUID)
	},
	calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
		//optional
		console.log('=====calculateHistoryDepth running', resolution)
		// while optional, this makes sure we request 24 hours of minute data at a time
		// CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no 
		//return resolution < 60 ? {resolution: resolution,resolutionBack: 'D', intervalBack: '1'} : undefined
		return
	},
	getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		console.log('=====getMarks running')
	},
	getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		console.log('=====getTimeScaleMarks running')
	},
	getServerTime: cb => {
		console.log('=====getServerTime running')
	}
}
