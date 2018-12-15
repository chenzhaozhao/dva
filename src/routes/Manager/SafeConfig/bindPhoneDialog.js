import React, { PureComponent } from 'react'
import { Button, Form, Input } from 'element-react'
import { Dialog } from 'element-react'
import styles from './safeCertify.less'
import intl from 'react-intl-universal'
export default class BindPhoneDialog extends PureComponent {

    constructor(props) {
        super(props)
        this.handleCancel = this.handleCancel.bind(this)
        this.handlePhoneBlur = this.handlePhoneBlur.bind(this)
        this.handlePhoneFocus = this.handlePhoneFocus.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    static defaultProps = {
        visible: false
    }

    state = {
        visible: false,
        form: {},
        phoneFocus: false,
    }

    handleCancel(e) {
        this.setState({ visible: false })
    }

    handlePhoneBlur(e) {
        this.setState({phoneFocus: false})
    }

    handlePhoneFocus(e) {
        this.setState({phoneFocus: true})
    }

    handleSubmit(e) {
        this.setState({ visible: false })
    }

    render() {
        return (
            <Dialog
                title={intl.get("BINDING_PHONE")}
                visible={ this.props.visible }
                onCancel={ this.handleCancel }
            >
            <p className="safeWarning">*{intl.get("FOR_THE_SECURITY_OF_YOUR_ASSETS")}</p>
            <Dialog.Body>
                <Form model={this.state.form}>
                    <Form.Item className={['m-form-item', styles.formItem,].join(' ')}>
                        <label 
                            className={[styles.label, this.state.phoneFocus ? styles.focus : ''].join(' ')}
                        >
                            {intl.get("PHONE_NUMBER")}
                        </label>
                        <div className={styles.iptItem}>
                            <Input 
                                placeholder="mobile" 
                                onBlur={this.handlePhoneBlur} 
                                onFocus={this.handlePhoneFocus} 
                            />
                        </div>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder={intl.get("SMS_VERIFICATION_CODE")} />
                        <span className="sendCertifyCode">{intl.get("SEND_SEND_VERIFCARTION_CODE")}</span>
                    </Form.Item>
                </Form>
          </Dialog.Body>
          <Dialog.Footer className="dialog-footer">
            <Button 
              type="primary" 
              onClick={this.handleSubmit}
            >
                {intl.get("SUBMIT_SPACE")}
            </Button>
          </Dialog.Footer>
        </Dialog>
        )
    }
}