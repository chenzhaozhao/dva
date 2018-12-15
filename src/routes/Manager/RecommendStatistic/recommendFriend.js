// 邀请朋友
import React, {PureComponent} from 'react'
import {connect} from 'dva'
import styles from './recommendFriend.less'
import {Layout, Input, Button} from 'element-react'
import {Notification} from 'element-react'
import copy from 'copy-to-clipboard'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode.react'
import post from "../../../assets/images/post.png"
import post_en from "../../../assets/images/post_en.png"
import intl from 'react-intl-universal'

@connect(state => ({
    recommendFriend: state.recommendFriend
}))
export default class RecommendFriend extends PureComponent {
    constructor(){
        super()
        this.state = {
            url: '',
            imgUrl: '',
            NickName:""
        };
        this.saveIMg=this.saveIMg.bind(this);
    }

  copyUrl = () => {
    copy(this.state.url);
    Notification({
      title:intl.get('Reminder'),
      type: 'success',
      message: intl.get('Copy_success'),
      duration: 10000
    });
  };
    copyUrl = () => {
        copy(this.state.url);
        Notification({
            title:intl.get('Reminder'),
            type: 'success',
            message: intl.get("THE_COPY_IS_SUCCESSFUL_IF"),
            duration: 10000
        });
    };

    componentDidMount() {

        this.setState({NickName:window.sessionStorage.getItem("NickName")},()=>  this.fetchData({}))
    }

    componentWillUnmount() {
        this.resetList({})
    }

    resetList() {
        this.props.dispatch({
            type: 'recommendFriend/reset',
            payload: {}
        })
    }

    componentWillReceiveProps() {
        try {
            this.props.recommendFriend.data.url && this.setState({
                url: this.props.recommendFriend.data.url
            })

        } catch (e) {
        }
    }

    fetchData(params) {
        this.props.dispatch({
            type: 'recommendFriend/fetch',
            payload: params,
            callback:(data)=>{
                  if (data.success){
                      this.setState({url:data.data.url},()=> this.imageProduce())
                  }
            }
        })
    }

    imageProduce() {
        html2canvas(document.getElementById('postPage'),{
            dpi: window.devicePixelRatio*2,
            scale:2.3,
        }).then((canvas) => {
            const imgUrl = canvas.toDataURL()
            this.setState({
                imgUrl: imgUrl,
                canvas
            });
            // document.getElementById('postPage').style.display = 'none'
        })
    }

    saveIMg() {
     const {canvas,imgUrl}=this.state;
      const  downloadFile=(filename, content)=> {
            let base64Img = content;
            let oA = document.createElement('a');
            oA.href = base64Img;
            oA.download = filename;
            let event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            oA.dispatchEvent(event);
        }
        downloadFile("专属海报", imgUrl);
    }

    render() {
        const {recommendFriend} = this.props;
        const  {NickName}=this.state;
        return (
            <div className="recommendFriend">
                <div className="title">
                    {intl.get("SPT_Invite_Friends")}
                </div>
                <Layout.Row className={styles.row}>
                    <Layout.Col span="4">{intl.get("RECOMMENDATION_CODE")}</Layout.Col>
                    <Layout.Col span="20"><span className={styles.text}>{recommendFriend.data.code}</span></Layout.Col>
                </Layout.Row>
                <Layout.Row className={styles.row}>
                    <Layout.Col span="4">{intl.get("YOUR_RECOMMENDATION_CODE")}</Layout.Col>
                    <Layout.Col span="20">
                        <div style={{position: "relative", top: "-6px"}}>
                            <Input value={recommendFriend.data.url} className='recommendFriendAddr'/>
                            <Button type="default" onClick={this.copyUrl.bind(this)}>{intl.get("COPYT")}</Button>
                        </div>
                    </Layout.Col>
                </Layout.Row>
                <Layout.Row className={styles.row} style={{borderBottom: 0}}>
                    <Layout.Col span="4">
                        <p className={styles.qrLine}>
                            {intl.get("INVITATION")}
                        </p>
                    </Layout.Col>
                    <Layout.Col span="20">
                        <div className={styles.postPage} id='postPage' style={{marginTop: "10px"}}>
                            <img src={window.currentLocale==="zh-CN"?post:post_en} alt=""/>
                            <span className={styles.nickName}>{NickName}</span>
                            <div className={styles.qrCode}><QRCode size={50} value={this.state.url}/></div>
                        </div>
                        <div className={styles.postPages} style={{display:'none'}}>
                            <img src={this.state.imgUrl} alt=""/>
                        </div>
                         <div className={styles.sendFriend}>{intl.get("DOWNLOAD_AND_SEND_TO_FRIENDS")}</div>
                        <Button style={{width: 160, marginLeft: "0px"}} onClick={this.saveIMg}
                                type="default">{intl.get("DOWNLOAD")}</Button>
                    </Layout.Col>
                </Layout.Row>

            </div>
        )
    }
}
