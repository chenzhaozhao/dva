import React, { PureComponent } from 'react'
import { Table, Icon } from 'element-react'
import intl from 'react-intl-universal'
let isFetch=true;
export default class ScrollTable extends PureComponent {
    constructor(props) {
        super(props)
        this.queryWhenScrollBottom = this.queryWhenScrollBottom.bind(this)
    }

    state = {
        page: 1,
        pageCount: 20,
        more: true
    }

    queryTimer = null

    isSendWarning = false

    set scrollTop(value) {
        document.documentElement.scrollTop = value
        window.pageYOffset = value
        document.body.scrollTop = value
    }

    get scrollTop() {
        return document.documentElement.scrollTop || 
                window.pageYOffset || 
                document.body.scrollTop
    }

    componentDidMount() {
        window.addEventListener('scroll', this.queryWhenScrollBottom, false) // 绑定滚动时间
    }

    componentWillUnmount() {
        clearTimeout(this.queryTimer)
        window.removeEventListener('scroll', this.queryWhenScrollBottom, false)
    }
    
    queryWhenScrollBottom = event => {
        if (this.props.data.length === 0) { return } 
        this.queryTimer = setTimeout(() => {
            const scrollHeight = document.documentElement.scrollHeight
            const clientHeight = document.documentElement.clientHeight
            const scrollTop = this.scrollTop
            const gap = document.getElementById('footer').clientHeight + 50;
            if(scrollTop >= (scrollHeight - clientHeight - gap)) {
                //   debugger
                console.log(this.props);
                if (this.state.page>=this.props.queryAmount) {
                    // debugger
                    if(!this.isSendWarning) {
                        this.isSendWarning = true
                    }
                    this.setState({
                        more: false
                    });
                    console.log('没有更多了')
                    return
                }
                if (typeof this.props.onScrollDisptchQuery !== 'function') { 
                    return
                }

                if (isFetch){
                    this.setState({
                        page: ++this.state.page
                    });
                }
                //通过回调传参来判断
                this.props.onScrollDisptchQuery(this.state.page.toString(),(isGetFetch)=>{
                    //作为是否应该请求的条件
                    isFetch=isGetFetch
                },()=>isFetch)
            }
        }, 1000)
    }

    render() {
        return (
            <div>
                <Table {...this.props} emptyText={intl.get("ASSER_NO_DATA")} rowKey={(row)=>row.time?row.time:JSON.stringify(row)} />
                {
                    this.props.loading &&
                        <div style={{textAlign: "center", padding:"20px 0", color: "#999"}}>
                            <Icon name="loading" /> {intl.get("LOADING")}
                        </div>
                }
                {
                    (this.props.data.length > 0 && this.state.more === false) 
                            && <div style={{textAlign:"center", padding:"20px 0", color:"#999"}}>{intl.get("NO_MORE")}</div>
                }
            </div>
        )
    }
}
