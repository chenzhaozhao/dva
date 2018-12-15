// 登录日志
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styles from './Authentication.less'
import countrys from './countryList'
import countryListEnglish from './countryListEnglish.js'
import { Input, Button, Upload } from 'element-react'
import { Dialog,Notification} from 'element-react'
import Selectrix from 'react-selectrix'
import { formatTime, isCardNumber,getUserInfo } from '../../../utils'
import successIcon from '../../../assets/images/success.png'
import errorIcon from '../../../assets/images/error.png'
import Icon from '../../../components/Icon'
import idcard0 from '../../../assets/images/idcard0.png'
import idcard1 from '../../../assets/images/idcard1.png'
import idcard2 from '../../../assets/images/idcard2.png'
import passportcard0 from '../../../assets/images/passportcard0.png'
import drivecard0 from '../../../assets/images/drivecard0.png'
import intl from 'react-intl-universal'
@connect(state => ({
  loginLog: state.loginLog,
}))
export default class Authentication extends PureComponent {
  state = {
    value: '',
    step: 1,
    firstName: '',
    lastName: '',
    country: '',
    userid: '',
    idCardVerify: true,
    selectIDTypeVisible: false,
    uploadIDTypeVisible: false,
    uploadDriveVisible: false,
    uploadPassportVisible: false,
    IDNumber: '',
    DriveNumber: '',
    PassportNumber: '',
    idCardPhoto0: '',
    idCardPhoto1: '',
    idCardPhoto2: '',
    drivePhoto1: '',
    drivePhoto2: '',
    drivePhoto3: '',
    passportPhoto1: '',
    passportPhoto2: '',
    passportPhoto3: '',
    countrys: [],
    verifyErrorReason : ''
  }

  componentDidMount() {
    // let userid = localStorage.getItem('_userid_')
     const  {userid}=getUserInfo();
    if (userid) {
      const listCountry=window.currentLocale==="zh-CN"?countrys:countryListEnglish;
      this.setState({
        countrys: [...listCountry.country],
        userid: userid
      })
      this.fetchVerifyStatus()
    }
  }
  fetchVerifyStatus(){
    this.props.dispatch({
      type: 'authentication/fetchVerifyStatus',
      payload: {
        userid : this.state.userid,
      },
      callback:(data)=>{
        if (data.success) {
          this.setState({
            step : parseInt(data.data.code),
            verifyErrorReason : data.data.remarks
          })
        }
      }
    })
  }
  selectCountry(value) {
    this.setState({
      value: value.key
    })
  }
  firstNameChange(value) {
    console.log(1111)
    this.setState({
      firstName: value
    })
  }
  lastNameChange(value) {
    this.setState({
      lastName: value
    })
  }

  selectVerifyType() {
    this.setState({
      selectIDTypeVisible: true
    })
  }

  handleAvatarScucess(type, res, file) {
    switch (type) {
      case 'id1':
        this.setState({ idCardPhoto0: URL.createObjectURL(file.raw) });
        break;
      case 'id2':
        this.setState({ idCardPhoto1: URL.createObjectURL(file.raw) });
        break;
      case 'id3':
        this.setState({ idCardPhoto2: URL.createObjectURL(file.raw) });
        break;
      case 'drive1':
        this.setState({ drivePhoto1: URL.createObjectURL(file.raw) });
        break;
      case 'drive2':
        this.setState({ drivePhoto2: URL.createObjectURL(file.raw) });
        break;
      case 'drive3':
        this.setState({ drivePhoto3: URL.createObjectURL(file.raw) });
        break;
      case 'passport1':
        this.setState({ passportPhoto1: URL.createObjectURL(file.raw) });
        break;
      case 'passport2':
        this.setState({ passportPhoto2: URL.createObjectURL(file.raw) });
        break;
      case 'passport3':
        this.setState({ passportPhoto3: URL.createObjectURL(file.raw) });
        break;
      default:
        break;
    }
  }

  beforeAvatarUpload(file) {
    let isJPG = false
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      isJPG = true
    }
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
      Notification({
        title:intl.get('Reminder'),
        type: 'error',
        message: intl.get('Update_images_format'),
        duration: 2000
      });
    }
    if (!isLt2M) {
      Notification({
        title:intl.get('Reminder'),
        type: 'error',
        message: intl.get('Update_images_max_size'),
        duration: 2000
      });
    }
    return isJPG && isLt2M;
  }

  uploadVerify(type) {
    if (type === 'passport') {
      this.setState({
        selectIDTypeVisible: false,
        uploadPassportVisible: true
      })
    } else if (type === 'user') {
      this.setState({
        selectIDTypeVisible: false,
        uploadIDCardVisible: true
      })
    } else if (type === 'drive') {
      this.setState({
        selectIDTypeVisible: false,
        uploadDriveVisible: true
      })
    }
  }

  numberChange(type, val) {
    if (type === 'passport') {
      this.setState({
        PassportNumber: val
      })
    } else if (type === 'id') {
      this.setState({
        IDNumber: val
      })
    } else if (type === 'drive') {
      this.setState({
        DriveNumber: val
      })
    }
  }

  uploadButton(url) {
    if (url) {
      return (
        <div className={styles.photo}>
          <img src={url} />
        </div>
      )
    } else {
      return (<div className={styles.photo}>
        <Icon type='upload' color='#4ac8b1' size='24' />
        <span className={styles.info}>{intl.get("LOCAL_UPLOAD")}</span>
      </div>)
    }
  }

  idNumberVerify(e) {
    let value = e.target.value
    if (value) {
      this.setState({
        idCardVerify: isCardNumber(value)
      })
    }
  }

  verifyInfoSubmit(information,type) {
    if (type && type === 'idcard') {
      if (information && isCardNumber(information) &&
            this.state.idCardPhoto0 && this.state.idCardPhoto1 && this.state.idCardPhoto2) {
        this.props.dispatch({
          type: 'authentication/fetchVerifyInfomation',
          payload: {
            userid : this.state.userid,
            country: this.state.value,
            firstname : this.state.firstName,
            lastname : this.state.lastName,
            information : information
          },
          callback:(data)=>{
            if (data.success) {
              Notification({
                title:intl.get('Reminder'),
                type: 'success',
                message: intl.get('Upload_file_success'),
                duration: 2000
              });
              this.setState({
                uploadIDCardVisible: false,
                step : 2
              })
            }else{
              Notification({
                title:intl.get('Reminder'),
                type: 'error',
                message: intl.get('Upload_file_failed'),
                duration: 2000
              });
            }
          }
        })
      }
    } else if (type && type === 'passport'){
      if (information && this.state.passportPhoto1 && this.state.passportPhoto2 && this.state.passportPhoto3) {
        this.props.dispatch({
          type: 'authentication/fetchVerifyInfomation',
          payload: {
            userid : this.state.userid,
            country: this.state.value,
            firstname : this.state.firstname,
            lastname : this.state.lastname,
            information : information
          },
          callback:(data)=>{
            if (data.success) {
              Notification({
                title:intl.get('Reminder'),
                type: 'success',
                message: intl.get('Upload_file_success'),
                duration: 2000
              });
              this.setState({
                uploadPassportVisible : false,
                step : 2
              })
            }else{
              Notification({
                title:intl.get('Reminder'),
                type: 'error',
                message: intl.get('Upload_file_failed'),
                duration: 2000
              });
            }
          }
        })
      }
    }else if (type && type === 'drive'){
      if (information && this.state.drivePhoto1 && this.state.drivePhoto2 && this.state.drivePhoto3 ) {
        this.props.dispatch({
          type: 'authentication/fetchVerifyInfomation',
          payload: {
            userid : this.state.userid,
            country: this.state.value,
            firstname : this.state.firstname,
            lastname : this.state.lastname,
            information : information
          },
          callback:(data)=>{
            if (data.success) {
              Notification({
                title:intl.get('Reminder'),
                type: 'success',
                message: intl.get('Upload_file_success'),
                duration: 2000
              });
              this.setState({
                uploadDriveVisible : false,
                step : 2
              })
            }else{
              Notification({
                title:intl.get('Reminder'),
                type: 'error',
                message: intl.get('Upload_file_failed'),
                duration: 2000
              });
            }
          }
        })
      }
    }

  }

  render() {
    // debugger
    const {
      idCardPhoto0,
      idCardPhoto1,
      idCardPhoto2,
      drivePhoto1,
      drivePhoto2,
      drivePhoto3,
      passportPhoto1,
      passportPhoto2,
      passportPhoto3 } = this.state;
    const _this = this;
    return (
      <div className={styles.authentication}>
        <Dialog
          title={intl.get("PLEASE_SELECT_AN_ID_TYPE")}
          visible={this.state.selectIDTypeVisible}
          onCancel={() => this.setState({ selectIDTypeVisible: false })}
        >
          <Dialog.Body >
            <p className={styles.tips}>{intl.get("PLEASE_CHOOSE_ONE_OF_THE_FOLLOWING")}</p>
            <div className={styles.iconList}>
              <div
                className={styles.item}
                onClick={(e) => this.uploadVerify('passport')}
              >
                <Icon type='passport' color='#695e97' size='42' />
              </div>
              <div
                className={styles.item}
                onClick={(e) => this.uploadVerify('user')}
              >
                <Icon type='user' color='#695e97' size='42' />
              </div>
              <div
                className={styles.item}
                onClick={(e) => this.uploadVerify('drive')}
              >
                <Icon type='drive' color='#695e97' size='42' />
              </div>

            </div>
            <p className={styles.idName}>
              <span>{intl.get("PASSPORT")}</span>
              <span>{intl.get("ID_CARD")}</span>
              <span>{intl.get("DRIVER_LICENSE")}</span>
            </p>
          </Dialog.Body>
        </Dialog>
        <Dialog
          title={intl.get("UPLOAD_ID_PHOTO")}
          visible={this.state.uploadPassportVisible}
          onCancel={() => this.setState({ uploadPassportVisible: false })}
          style={{ width: '760px' }}
        >
          <Dialog.Body style={{ paddingTop: '0px' }}>
            <div className={styles.mainContent}>
              <div className={styles.number}>
                <p className={styles.title}>{intl.get("PASSPORT")}</p>
                <div className={styles.content}>
                  <div className={styles.inputContainer}>
                    <Input
                      onChange={(val) => this.numberChange('passport', val)}
                      value={this.state.PassportNumber} />
                  </div>
                  <span className={styles.tips}>{intl.get("ENTER_YOURPASSPORT_NUMBER")}</span>
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.title}>{intl.get("PASSPORT_COVER")}</p>
                <div className={styles.pictures}>
                  <div className={styles.upload}>
                    <Upload
                      className="avatar-uploader"
                      action={`${window.location.protocol}//${window.location.host}/IdCard/upload`}
                      name="a"
                      data={{
                        userid: this.state.userid,
                        type: 'a'
                      }}
                      showFileList={false}
                      onSuccess={(res, file) => this.handleAvatarScucess('passport1', res, file)}
                      beforeUpload={file => this.beforeAvatarUpload(file)}
                    >
                      {/* {passportPhoto1 ?
                        <img src={passportPhoto1} className={styles.photo} /> :
                        <Icon type='upload' color='#4ac8b1' size='24' />
                      } */}
                      {
                        this.uploadButton(passportPhoto1)
                      }
                    </Upload>
                  </div>
                  <div className={styles.model}>
                    <img src={passportcard0} />
                  </div>
                  <div className={styles.description}>
                    <p>{intl.get("FOR_EASY_REVIEW_PLEASE_UPLOAD")}</p>
                  </div>
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.title}>{intl.get("PASSPORT_INFORMATION_PAGE")}</p>
                <div className={styles.pictures}>
                  <div className={styles.upload}>
                    <Upload
                      className="avatar-uploader"
                      action={`${window.location.protocol}//${window.location.host}/IdCard/upload`}
                      name="b"
                      data={{
                        userid: this.state.userid,
                        type: 'b'
                      }}
                      showFileList={false}
                      onSuccess={(res, file) => this.handleAvatarScucess('passport2', res, file)}
                      beforeUpload={file => this.beforeAvatarUpload(file)}
                    >
                      {/* {passportPhoto2 ?
                        <img src={passportPhoto2} className={styles.photo} /> :
                        <Icon type='upload' color='#4ac8b1' size='24' />
                      } */}
                      {
                        this.uploadButton(passportPhoto2)
                      }
                    </Upload>
                  </div>
                  <div className={styles.model}>
                    <img src={idcard0} />
                  </div>
                  <div className={styles.description}>
                    <p>{intl.get("PASSPORT_INFORMATION_PAGE")}</p>
                  </div>
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.title}>{intl.get("HANDHELD_PASSPORT")}</p>
                <div className={styles.pictures}>
                  <div className={styles.upload}>
                    <Upload
                      className="avatar-uploader"
                      action={`${window.location.protocol}//${window.location.host}/IdCard/upload`}
                      name="c"
                      data={{
                        userid: this.state.userid,
                        type: 'c'
                      }}
                      showFileList={false}
                      onSuccess={(res, file) => this.handleAvatarScucess('passport3', res, file)}
                      beforeUpload={file => this.beforeAvatarUpload(file)}
                    >
                      {/* {passportPhoto3 ?
                        <img src={passportPhoto3} className={styles.photo} /> :
                        <Icon type='upload' color='#4ac8b1' size='24' />
                      } */}
                      {
                        this.uploadButton(passportPhoto3)
                      }
                    </Upload>
                  </div>
                  <div className={styles.model}>
                    <img src={idcard2} />
                  </div>
                  <div className={styles.description}>
                    <p>{intl.get("HANDHELD_PASSPORT_PASS_STANDARD")}</p>
                    <p>1、{intl.get("CLEAR_PORTRAIT")}</p>
                    <p>2、{intl.get("CLEAR_PASSPORT_INFORMATION")}</p>
                    <p>3、{intl.get("CONTAINS_THE_WORD_CREBE")}</p>
                  </div>
                </div>
              </div>
              <div className={styles.submit}>
                <Button
                  type='primary'
                  className={styles.submitAction}
                  onClick={(e)=>this.verifyInfoSubmit(this.state.PassportNumber,'passport')}
                >{intl.get("SUBMIT")}</Button>
              </div>
            </div>
          </Dialog.Body>
        </Dialog>
        <Dialog
          title={intl.get("UPLOAD_ID_PHOTO")}
          visible={this.state.uploadIDCardVisible}
          onCancel={() => this.setState({ uploadIDCardVisible: false })}
          style={{ width: '760px' }}
        >
          <Dialog.Body style={{ paddingTop: '0px' }}>
            <div className={styles.mainContent}>

              <div className={styles.number}>
                <p className={styles.title}>{intl.get("ID_CARD")}</p>
                <div className={styles.content}>
                  <div className={styles.inputContainer}>
                    <Input
                      onChange={(val) => this.numberChange('id', val)}
                      value={this.state.IDNumber}
                      onBlur={(e) => this.idNumberVerify(e)}
                    />
                  </div>
                  {
                    this.state.idCardVerify ?
                      <span className={styles.tips}>{intl.get("EMTER_ID_NUMBER")}</span> :
                      <span className={styles.error}>{intl.get("I_HAVE_ENTERED_MY_ID_CARD_INCORRECTLY")}</span>
                  }
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.title}>{intl.get("ID_CARD_FRONT")}</p>
                <div className={styles.pictures}>
                  <div className={styles.upload}>
                    <Upload
                      className="avatar-uploader"
                      action={`${window.location.protocol}//${window.location.host}/IdCard/upload`}
                      name="a"
                      data={{
                        userid: this.state.userid,
                        type: 'a'
                      }}
                      showFileList={false}
                      onSuccess={(res, file) => this.handleAvatarScucess('id1', res, file)}
                      beforeUpload={file => this.beforeAvatarUpload(file)}
                    >
                      {/* {idCardPhoto0 ?
                        <img src={idCardPhoto0} className={styles.photo} /> :
                        <Icon type='upload' color='#4ac8b1' size='24' />
                      } */}
                      {
                        this.uploadButton(idCardPhoto0)
                      }
                    </Upload>
                  </div>
                  <div className={styles.model}>
                    <img src={idcard0} />
                  </div>
                  <div className={styles.description}>
                    <p>{intl.get("FOR_EASY_REVIEW_PLEASE_UPLOAD")}</p>
                  </div>
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.title}>{intl.get("REVERSE_SIDE_OF_ID_CARD")}</p>
                <div className={styles.pictures}>
                  <div className={styles.upload}>
                    <Upload
                      className="avatar-uploader"
                      action={`${window.location.protocol}//${window.location.host}/IdCard/upload`}
                      name="b"
                      data={{
                        userid: this.state.userid,
                        type: 'b'
                      }}
                      showFileList={false}
                      onSuccess={(res, file) => this.handleAvatarScucess('id2', res, file)}
                      beforeUpload={file => this.beforeAvatarUpload(file)}
                    >
                      {/* {idCardPhoto1 ?
                        <img src={idCardPhoto1} className={styles.photo} /> :
                        <Icon type='upload' color='#4ac8b1' size='24' />
                      } */}
                      {
                        this.uploadButton(idCardPhoto1)
                      }
                    </Upload>
                  </div>
                  <div className={styles.model}>
                    <img src={idcard1} />
                  </div>
                  <div className={styles.description}>
                    <p>{intl.get("FOR_EASY_REVIEW_PLEASE_UPLOAD")}</p>
                  </div>
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.title}>{intl.get("HAND_HELD_IDENTITY_CARD")}</p>
                <div className={styles.pictures}>
                  <div className={styles.upload}>
                    <Upload
                      className="avatar-uploader"
                      action={`${window.location.protocol}//${window.location.host}/IdCard/upload`}
                      name="c"
                      data={{
                        userid: this.state.userid,
                        type: 'c'
                      }}
                      showFileList={false}
                      onSuccess={(res, file) => this.handleAvatarScucess('id3', res, file)}
                      beforeUpload={file => this.beforeAvatarUpload(file)}
                    >
                      {/* {idCardPhoto2 ?
                        <img src={idCardPhoto2} className={styles.photo} /> :
                        <Icon type='upload' color='#4ac8b1' size='24' />
                      } */}
                      {
                        this.uploadButton(idCardPhoto2)
                      }
                    </Upload>
                  </div>
                  <div className={styles.model}>
                    <img src={idcard2} />
                  </div>
                  <div className={styles.description}>
                    <p>{intl.get("HAND_HELD_ID_CARD_PASSED")}</p>
                    <p>1、{intl.get("CLEAR_PORTRAIT")}；</p>
                    <p>2、{intl.get("MAKE_sURE_YOUR_DOCUMENT_INFORMATION_IS_CLEAR")}</p>
                    <p>3、{intl.get("COMTAINS_CREBE_CURRENT_DATE_TYPEFACE")}</p>
                  </div>
                </div>
              </div>
              <div className={styles.submit}>
                <Button
                  type='primary'
                  className={styles.submitAction}
                  onClick={(e)=>this.verifyInfoSubmit(this.state.IDNumber,'idcard')}
                >{intl.get("SUBMIT")}</Button>
              </div>
            </div>
          </Dialog.Body>
        </Dialog>
        <Dialog
          title={intl.get("UPLOAD_ID_PHOTO")}
          visible={this.state.uploadDriveVisible}
          onCancel={() => this.setState({ uploadDriveVisible: false })}
          style={{ width: '760px' }}
        >
          <Dialog.Body style={{ paddingTop: '0px' }}>
            <div className={styles.mainContent}>

              <div className={styles.number}>
                <p className={styles.title}>{intl.get("DRIVER_LICENSE")}</p>
                <div className={styles.content}>
                  <div className={styles.inputContainer}>
                    <Input
                      onChange={(val) => this.numberChange('drive', val)}
                      value={this.state.DriveNumber}
                      // onBlur={(e) => this.idNumberVerify(e)}
                    />
                  </div>
                  <span className={styles.tips}>{intl.get("PLEASE_ENTER_THE_NUMBER")}</span>
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.title}>{intl.get("PLEASE_IPLOAD_FRONT_PHOTO")}</p>
                <div className={styles.pictures}>
                  <div className={styles.upload}>
                    <Upload
                      className="avatar-uploader"
                      action={`${window.location.protocol}//${window.location.host}/IdCard/upload`}
                      name="a"
                      data={{
                        userid: this.state.userid,
                        type: 'a'
                      }}
                      showFileList={false}
                      onSuccess={(res, file) => this.handleAvatarScucess('drive1', res, file)}
                      beforeUpload={file => this.beforeAvatarUpload(file)}
                    >
                      {
                        this.uploadButton(drivePhoto1)
                      }
                    </Upload>
                  </div>
                  <div className={styles.model}>
                    <img src={idcard0} />
                  </div>
                  <div className={styles.description}>
                    <p>{intl.get("FOR_EASY_REVIEW_PLEASE_UPLOAD")}</p>
                  </div>
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.title}>{intl.get("THE_REVERSE_PHOTO")}</p>
                <div className={styles.pictures}>
                  <div className={styles.upload}>
                    <Upload
                      className="avatar-uploader"
                      action={`${window.location.protocol}//${window.location.host}/IdCard/upload`}
                      name="b"
                      data={{
                        userid: this.state.userid,
                        type: 'b'
                      }}
                      showFileList={false}
                      onSuccess={(res, file) => this.handleAvatarScucess('drive2', res, file)}
                      beforeUpload={file => this.beforeAvatarUpload(file)}
                    >
                      {
                        this.uploadButton(drivePhoto2)
                      }
                    </Upload>
                  </div>
                  <div className={styles.model}>
                    <img src={drivecard0} />
                  </div>
                  <div className={styles.description}>
                    <p>{intl.get("FOR_EASY_REVIEW_PLEASE_UPLOAD")}</p>
                  </div>
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.title}>{intl.get("A_PHOTO_THAT_YOU_HOLD")}</p>
                <div className={styles.pictures}>
                  <div className={styles.upload}>
                    <Upload
                      className="avatar-uploader"
                      action={`${window.location.protocol}//${window.location.host}/IdCard/upload`}
                      name="c"
                      data={{
                        userid: this.state.userid,
                        type: 'c'
                      }}
                      showFileList={false}
                      onSuccess={(res, file) => this.handleAvatarScucess('drive3', res, file)}
                      beforeUpload={file => this.beforeAvatarUpload(file)}
                    >
                      {
                        this.uploadButton(drivePhoto3)
                      }
                    </Upload>
                  </div>
                  <div className={styles.model}>
                    <img src={idcard2} />
                  </div>
                  <div className={styles.description}>
                    <p>{intl.get("HANDHELD_DRIVER_PASS_STANDARD")}</p>
                    <p>1、{intl.get("CLEAR_PORTRAIT")}；</p>
                    <p>2、{intl.get("MAKE_SURE_YOUR_DOCUMENT_INFORMATION_IS_CLEAR")}</p>
                    <p>3、{intl.get("CONTAINS_THE_WORD_CREBE")}</p>
                  </div>
                </div>
              </div>
              <div className={styles.submit}>
                <Button
                  type='primary'
                  className={styles.submitAction}
                  onClick={(e)=>this.verifyInfoSubmit(this.state.DriveNumber,'drive')}
                >{intl.get("SUBMIT")}</Button>
              </div>
            </div>
          </Dialog.Body>
        </Dialog>
        <div className="title">
            {intl.get("IDENTITY_VERIFICATION")}
        </div>
        <div className={this.state.step === 1 ? styles.content : styles.contentHidden}>
          <div className={styles.typeItem}>
            <span className={styles.label}>{intl.get("COUNTRY/REGION")}</span>
            <div className={styles.typeContent}>
              <Selectrix
                multiple={false}
                materialize={true}
                tags={true}
                placeholder={intl.get("PLEASE_SELECT_COUNTRY_REGION")}
                options={this.state.countrys}
                onChange={(val) => _this.selectCountry(val)}
              />
            </div>

          </div>
          <div className={styles.typeItem}>
            <span className={styles.label}>{intl.get("FIRST_NAME")}</span>
            <div className={styles.typeContent}>
              <Input
                onChange={(e) => this.firstNameChange(e)}
                value={this.state.firstName}
              />
            </div>
          </div>
          <div className={styles.typeItem}>
            <span className={styles.label}>{intl.get("LAST_NAME")}</span>
            <div className={styles.typeContent}>
              <Input
                onChange={(e) => this.lastNameChange(e)}
                value={this.state.lastName} />
            </div>
          </div>
          <div className={styles.beginVerify}>
            {
              this.state.firstName.trim() && this.state.lastName.trim() && (this.state.value || '').trim() ?
                (
                  <Button
                    type='primary'
                    onClick={e => this.selectVerifyType()}
                  >{intl.get("START_VERIFICATION")}</Button>
                ) : (
                  <button className={styles.infoFillOut}
                  >{intl.get("START_VERIFICATION")}</button>
                )
            }

          </div>
        </div>
        <div className={this.state.step === 2 ? styles.content : styles.contentHidden}>
          <div className={styles.norecord}></div>
          <p className={styles.tips}>{intl.get("THE_DATA_WAS_SUBMITTED")}</p>
        </div>
        <div className={this.state.step === 3 ? styles.content : styles.contentHidden}>
          <div className={styles.verifyTitle}>
            <img src={successIcon} className={styles.successIcon} />
            <span className={styles.verifyResult}>
                {intl.get("YOUR_IDENTITY_INFORMATION_HAS_BEEN_CERTIFIED")}
            </span>
          </div>
          {/* <div className={styles.verifySuccess}>
            <div className={styles.item}>
              <span className={styles.label}>姓名</span>
              <span className={styles.value}>{this.state.firstName} {this.state.lastName}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>国家 / 地区</span>
              <span className={styles.value}>新加坡</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>护照</span>
              <span className={styles.value}>2341******************2345</span>
            </div>
          </div> */}
        </div>
        <div className={this.state.step === 4 ? styles.content : styles.contentHidden}>
          <div className={styles.verifyTitle}>
            <img src={errorIcon} className={styles.successIcon} />
            <span className={styles.verifyResult}>
                {intl.get("YOUR_IDENTITY_INFORMATION_FAILED_TO_PASS")}
            </span>
          </div>
          <div className={styles.verifyError}>
            <p className={styles.title}>{intl.get("THE_IDENTITY_HAS_NOT_BEEN_CERTIFYIED_BECAUSE")}：</p>
            <p className={styles.errorMsg}>{this.state.verifyErrorReason}</p>
            <div className={styles.beginVerify}>
              <Button
                type='primary'
                onClick={e => this.setState({ step: 1 })}
              >{intl.get("RECERTIFICATION")}</Button>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
