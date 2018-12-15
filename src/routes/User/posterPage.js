import React, { PureComponent} from 'react'
import { connect } from 'dva'
import styles from './posterPage.less'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode.react'
import successIcon from '../../assets/images/success_icon.png'

@connect(state => ({
    user: state.user
}))
export default class PosterPage extends PureComponent {

    state = {
        imgUrl: '',
        invitationnumber: '',
        url: ''
    }

    imageProduce() {
        html2canvas(document.getElementById('postImg')).then((canvas) => {
            const imgUrl = canvas.toDataURL()
            this.setState({
                imgUrl: imgUrl
            })
            document.getElementById('postImg').style.display = 'none'
        })
    }

    componentWillMount() {
        if (this.props.match.params.fid && this.props.match.params.fid.trim()) {
            this.setState({
                invitationnumber: this.props.match.params.fid || '',
                url: ''+window.location.protocol+'//'+window.location.host+'/#/newlogin/2/' + this.props.match.params.fid || ''
            })
        }
    }

    componentDidMount() {
        this.imageProduce()
    }

    render() {
        return (
            <div className={styles.poster}>

                <div id='postImg' className={styles.postImg}>
                    <div>
                        <QRCode size={200} value={this.state.url} />
                    </div>
                </div>


                <img src={this.state.imgUrl} className={styles.fullPage} />
                <div className={styles.bottomFooter}>
                    <img src={successIcon} className={styles.icon} />
                    <p className={styles.tips}>
                        已为您生成专属海报，长按保存到手机相册
                    </p>
                </div>
            </div>
        )
    }
}

PosterPage.propTypes = {
}

//export default connect()(Login)
