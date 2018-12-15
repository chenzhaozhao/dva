import { connect } from 'dva'
import React, { PureComponent } from 'react'
import styles from './index.less'
import Datafeed from './api/'
import intl from 'react-intl-universal'
let isChartReady = false;

function getLanguage() {
	const map = {
		'en-US': 'en',
		'zh-CN': 'zh'
	}
	const lang = sessionStorage.getItem('qq-to-locale-lang')
	return map[lang] || 'en'
}

@connect(state => ({}))
export class TVChartContainer extends PureComponent {

	static defaultProps = {
		symbol: 'Coin:BTC/USDT/3/2',
		interval: '4000',
		containerId: 'tv_chart_container',
		libraryPath: '/charting_library/',
		// chartsStorageUrl: 'https://saveload.tradingview.com', // 演示图存储服务
		// chartsStorageApiVersion: '1.1',
		// clientId: 'tradingview.com', // 您的网站网址或其他任何内容
		// userId: 'public_user_id', // 唯一用户ID
		fullscreen: false,
		autosize: true,
		studiesOverrides: {
			'volume.show ma': true,
			'volume.volume ma.plottype': 'line',
		},
	}

	tvWidget = null

	componentDidMount() {
		const tradepair = this.props.tradepair.split('_')
		const symbol = `Coin:${tradepair[0]}/${tradepair[1]}/${tradepair[2]}/${tradepair[3]}`
		const widgetOptions = {
			debug: true,
			symbol,
			datafeed: Datafeed,
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			locale: getLanguage(),
			timezone: 'Asia/Shanghai',//时区添加
			disabled_features: [
				'go_to_date',
				'timeframes_toolbar',
				'header_screenshot',
				'header_resolutions',
				'header_settings',
				'header_chart_type',
				'header_symbol_search',
				'header_indicators',
				'header_undo_redo',
				'header_compare',
				'header_saveload',
				//'pane_context_menu',
				'compare_symbol',
				'symbol_search_hot_key',
				//'legend_context_menu',
				'timezone_context_menu',
				'countdown',
				'context_menus',
				'volume_force_overlay',
				'left_toolbar',
				//'study_market_minimized' //如果添加后，技术指标面板会变化
			],
			enabled_features: [
				'study_templates',
				'show_hide_button_in_legend',
				'edit_buttons_in_legend'
			],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
			custom_css_url: 'bundles/custom_theme.css',
			toolbar_bg: '#15122a',
			theme: 'Dark',
			customFormatters: {
				timeFormatter: {
					format: function (date) {
					    var  hours = date.getUTCHours();
					    if(hours<10) hours = '0' + hours;
					    var  minutes = date.getUTCMinutes();
					    if(minutes<10) minutes = '0' + minutes;
					    var  seconds = date.getUTCSeconds();
					    if(seconds<10) seconds = '0' + seconds;

						return hours + ':' + minutes + ':' + seconds;
					}
				},
				dateFormatter: {
					format: function (date) {
					    var  month = date.getUTCMonth() + 1;
					    if(month<10) month = '0' + month;
					    var day = date.getUTCDate();
					    if(day<10) day = '0' + day;
						return date.getUTCFullYear() + '-' + month + '-' + day;
					}
				}
			},
			overrides: {
				'volumePaneSize': 'small',
				'paneProperties.background': '#15122a',
				'paneProperties.vertGridProperties.color': '#15122a',
				'paneProperties.horzGridProperties.color': '#15122a',
				'symbolWatermarkProperties.transparency': 90,
				'scalesProperties.textColor': '#817d9c',
				'scalesProperties.lineColor': '#45415e',
				'mainSeriesProperties.showCountdown': true,
				'mainSeriesProperties.candleStyle.upColor': '#07b097',
				'mainSeriesProperties.candleStyle.wickUpColor': '#07b097',
				'mainSeriesProperties.candleStyle.borderUpColor': '#07b097',
				'mainSeriesProperties.candleStyle.downColor': '#c33135',
				'mainSeriesProperties.candleStyle.borderDownColor': '#c33135',
				'mainSeriesProperties.candleStyle.wickDownColor': '#c33135',
				'paneProperties.legendProperties.showStudyTitles': true,
				'paneProperties.legendProperties.showStudyArguments': true,
				'paneProperties.legendProperties.showStudyValues': true,
				//实时线的渐变色
				'mainSeriesProperties.areaStyle.color1': '#201c3a',
				'mainSeriesProperties.areaStyle.color2': '#201c3a',
				'mainSeriesProperties.areaStyle.linecolor': '#655f88'
			}
		}
		const widget =
			this.tvWidget =
			new window.TradingView.widget(widgetOptions)

		widget.onChartReady(() => {
			isChartReady = true
			document.getElementById('tv_chart_container').childNodes[0].setAttribute('style', 'display:block;width:100%;height:100%;');
			//widget.chart().createStudy('Moving Average', false, true, [5, 'close', 0], null, { 'Plot.color': "#7D53A8" })
			widget.chart().createStudy(
				'Moving Average',
				false,
				false,
				[10, 'close', 0],
				null,
				{ 'Plot.color': '#84ccc9', 'Plot.linewidth': 2.2 }
			)
			// 10是以10根k线为单位计算
			widget.chart().createStudy(
				'Moving Average',
				false,
				false,
				[30, 'close', 0],
				null,
				{ 'Plot.color': '#cfa972', 'Plot.linewidth': 2.2 }
			)

			//保存用户设置
			let chartState = window.localStorage.getItem('_chartStyles_');
			if (chartState) {
				chartState = JSON.parse(chartState)
				chartState.charts[0].panes[0].sources[0].state.interval = '4000';
				chartState.charts[0].panes[0].sources[0].state.symbol = symbol;
				// widget.load(chartState)
			}
			widget.subscribe('onAutoSaveNeeded', function () {
				widget.save(function (chartState) {
					chartState = JSON.stringify(chartState)
					window.localStorage.setItem('_chartStyles_', chartState)
				})
			})


			const toolbarTimeZoneButtons = [
				{
					text: 'REALTIME',
					className: 'toolbar-time-zone-button',
					time: 1,
					type: 3,
				},
				{
					text: 'M1',
					className: 'toolbar-time-zone-button',
					time: 1,
					type: 1,
				},
				{
					text: 'M3',
					className: 'toolbar-time-zone-button',
					time: 3,
					type: 1,
				},
				{
					text: 'M5',
					className: 'toolbar-time-zone-button',
					time: 5,
					type: 1,
				},
				{
					text: 'M15',
					className: 'toolbar-time-zone-button',
					time: 15,
					type: 1,
				},
				{
					text: 'M30',
					className: 'toolbar-time-zone-button',
					time: 30,
					type: 1,
				},
				{
					text: 'H1',
					className: 'toolbar-time-zone-button',
					time: 60,
					type: 1,
				},
				{
					text: 'H4',
					className: 'toolbar-time-zone-button',
					time: 240,
					type: 1,
				},
				{
					text: 'H6',
					className: 'toolbar-time-zone-button',
					time: 360,
					type: 1,
				},
				{
					text: 'D1',
					className: 'toolbar-time-zone-button',
					time: 'D',
					type: 1,
				}
			]


			let _this = this

			widget.headerReady().then(function () {
				toolbarTimeZoneButtons.forEach(item => {
					const button = _this.tvWidget.createButton();
					button.setAttribute('class', item.className);
					button.setAttribute('title', item.text);
					button.innerHTML = item.text;
					// .addClass(item.className)
					// .text(item.text)
					button.addEventListener('click', e => {
						const div = Array.prototype.slice.call(
							e.target.parentNode.parentNode.parentNode.children
						)
						if (div) {
							div.forEach(item => {
								const node = item.children[0] && item.children[0].children[0]
								if (node) {
									let cls = node.className.split(' ')
									const id = cls.findIndex(it => 'active' === it)
									if (id > -1) {
										cls.splice(id, 1)
										node.className = cls.join(' ')
									}
								}
							})
						}
						const cls = e.target.className.split(' ')
						cls.push('active')
						e.target.className = cls.join(' ')
						_this.tvWidget.chart().setChartType(item.type)
						_this.tvWidget.chart().setResolution(
							item.time.toString(),
							() => { }
						)
					})
					if ('REALTIME' === item.text) {
						button.click()
					}
				})
				var button = widget.createButton();
				button.setAttribute('title', intl.get("INDEX_TITLE"));
				button.setAttribute('class', 'toolbar-time-zone-button');
				button.addEventListener('click', function () {
					widget.chart().executeActionById("insertIndicator"); //添加技术指标
				});
				button.textContent = intl.get("INDEX");
			});
		})

	}

	componentWillUnmount() {
		if (isChartReady) {

			this.tvWidget.remove()
			this.tvWidget = null
			isChartReady = false
		}
	}

	render() {
		return (
			<div
				id={this.props.containerId}
				className={styles.TVChartContainer}
			/>
		)
	}
}
