import React, { PureComponent, createElement } from 'react'
import { connect } from 'dva'
import { Link, routerRedux } from 'dva/router'
import {emailVerify, getPwdVerify, saveUserInfo, tokenVerify} from '../../utils'
import styles from './login.less'

@connect(state => ({
  user:state.user
}))
export default class Login extends PureComponent {

  state = {
    step:1,
    emailEmpty:false,
    emailVerify:true,
    pwd:'',
    pwdVerify : true,
    firstLogin : true,
    verifycode : '',
    emailResponseVerify : false
  }

  handle(e) {
    if (this.props.user.email.length == 0) {
      this.setState({
        emailEmpty : true
      }) 
      return
    } else {
      this.state.emailEmpty = false
      this.setState({emailVerify : emailVerify(this.props.user.email)})
    }
  }
  pwdHandle(e){
    this.setState({pwdVerify : getPwdVerify(this.state.pwd)})
  }
  cancleForgetPwdAction(){
    this.setState({
      step:1
    })
  }
  changeEmailValue(e){
    this.props.dispatch({
      type:'user/fetch',
      payload:{
        email : e.target.value
      }
    })
  }
  login(){
    if (this.props.user.email.length == 0) {
      this.state.emailEmpty = true
      return 
    }else if(!emailVerify(this.props.user.email)){
      this.state.emailVerify = false
      return
    }
    
    this.props.dispatch({
      type: 'user/fetchLogin',
      payload:{
        email : this.props.user.email,
        password : this.state.pwd
      },
      callback:(data) =>{
        this.setState({ firstLogin : false})
        if (data.success) {
          if (data.data.code === 1) {
              saveUserInfo('_token_', data.data.token);
              saveUserInfo('_userid_', data.data.userid);
            this.props.dispatch({
              type: 'user/fetchUserInfo',
              payload:{ }
            })
            this.props.dispatch(routerRedux.push('/manager/safeConfig/safeCertify'))
            
          }else if (data.data.code === -1){
            this.setState({
              step : 2
            })
          }
          
        }
        
      }
    })
    
  }

  loginVerify(){
    if (!this.state.verifycode.trim()) {
      return
    } 
    this.props.dispatch({
      type: 'user/fetchLoginVerify',
      payload:{
        secondcode : this.state.verifycode,
        token : this.props.user.token,
        userid : this.props.user.userid
      },
      callback:(data) =>{
        if (data.success) {
          this.props.dispatch({
            type: 'user/fetchUserInfo',
            payload:{ }
          })
          this.props.dispatch(routerRedux.push('/manager/safeConfig/safeCertify'))
          
        }
      }
    })
  }
  render() {
    return (
      <div className={styles.userBg}>
        <div className={this.state.step== 1 ? styles.userPanel+" "+styles.display : styles.userPanel} >
          <p className={styles.panelTitle} >
            登录
          </p>
          <div className={styles.panelBody} >
            <div className={styles.email} >
              <p className={styles.title}>邮箱*</p>
              <input type="email" 
                onChange={(e)=>this.changeEmailValue(e)} 
                onBlur={e => this.handle(e)} 
                value={this.props.user.email}
                autoComplete="off"
              />
              <p className={ (!this.state.emailVerify && this.props.user.email.length >0) ? styles.error : ''}>邮箱格式不正确</p>
              <p className={!this.state.emailEmpty || this.props.user.email.trim() ? '' : styles.error }>必填</p>
              {/* <p className={this.state.emailResponseVerify? styles.error : ''}>必填</p> */}
            </div>
            <div className={styles.password} >
              <p className={styles.title}>密码*</p>
              <input type="password" 
                onChange={(e)=>{this.setState({pwd : e.target.value})}}  
                onBlur={e => this.pwdHandle(e)} 
                value={this.state.pwd}
                autoComplete="off"
              />
              <Link to='/user/forgetpwd' className={styles.forgetPwd}>忘记密码</Link>
              <p 
                className={this.props.user.success || this.state.firstLogin ? '' : styles.error} 
              >邮箱或密码错误</p>
            </div>
          </div>
          <div className={styles.userAction} >
            <button 
              className={styles.green}
              onClick={()=>this.login()}
            >登录</button>
          </div>
        </div>
        <div 
          className={this.state.step== 2 ? styles.verifyPanel+" "+styles.display : styles.verifyPanel} 
        >
          <div className={styles.mask} ></div>
          <div className={styles.userPanel} >
            <p className={styles.panelTitle}>
              验证码
            </p>
            <div className={styles.panelBody} >
              <div className={styles.email} >
                <p className={styles.tips}>请输入您的谷歌验证码</p>
                <p className={styles.title}>验证码*</p>
                <input 
                  type="text" 
                  onBlur={e => this.handle(e)}
                  onChange={(e)=>this.setState({ verifycode : e.target.value })}
                  value={this.state.verifycode}
                  autoComplete="off"
                />
                <p 
                  className={this.state.verifycode.trim() ? '' : styles.error}
                >必填</p>
              </div>
              <div className={styles.action} >
                <button 
                  className={styles.defaultGreen} 
                  onClick={this.cancleForgetPwdAction.bind(this)}
                >取消</button>
                <button 
                  className={styles.green} 
                  onClick={(e)=>this.loginVerify()}
                >提交</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
}

//export default connect()(Login)
