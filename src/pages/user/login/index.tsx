import { Alert } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

// import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import JsEncrypt from 'jsencrypt'
import Link from 'umi/link';
import { connect } from 'dva';
import { StateType } from './model';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Submit } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<any>;
  userLogin: StateType;
  submitting: boolean;
}
interface LoginState {
  type: string;
  // autoLogin: boolean;
}
export interface FormDataType {
  userName: string;
  password: string;
}

@connect(
  ({
    userLogin,
    loading,
  }: {
    userLogin: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userLogin,
    submitting: loading.effects['userLogin/login'],
  }),
)
class Login extends Component<
  LoginProps,
  LoginState
> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
    // autoLogin: true,
  };

  // changeAutoLogin = (e: CheckboxChangeEvent) => {
  //   this.setState({
  //     autoLogin: e.target.checked,
  //   });
  // };

  /**
   * @description RSA加密
   * @memberof Login
   */
  RSAencrypt = (psw: string) => {
    const jse = new JsEncrypt();
    jse.setPublicKey(`
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwxZwvV2JrICiSqokCqQnzy3hyczFbQ0rzVLwnmpk9/ydUpZU6PlDrLf83IVEA4htGytxFeHIYIxgZ5HRlEESacoJBHspRVajY/rIxenF8xJsOy7+NFZLGvMCTnYVchts+YUFTnm/BB16DDex7mJ3ZtiBJBYbdFQpC+6IkDAnueQIDAQAB
    `);
    return jse.encrypt(psw);
  }

  handleSubmit = (err: any, values: FormDataType) => {
    if (!err) {
      const { dispatch } = this.props;
      const { userName, password } = values;
      dispatch({
        type: 'userLogin/login',
        payload: {
          phoneNum: userName,
          psw: this.RSAencrypt(password)
        },
      });
    }
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { userLogin, submitting } = this.props;
    const { status, type: loginType } = userLogin;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          ref={(form: any) => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'user-login.login.tab-login-credentials' })}>
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'user-login.login.message-invalid-credentials' }),
              )}
            <UserName
              name="userName"
              placeholder='手机号'
              rules={[
                {
                  required: true,
                  message: '请输入手机号',
                },
                {
                  pattern: /^\d{11}$/,
                  message: '手机号格式错误',
                },
              ]}
            />
            <Password
              name="password"
              placeholder='密码'
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
                {
                  pattern: /^.{6,16}$/,
                  message: '密码应为6至16位',
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          <div style={{ textAlign: 'right' }}>
            <Link to="/user/register">
              <FormattedMessage id="user-login.login.forgot-password" />
            </Link>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="user-login.login.login" />
          </Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="user-login.login.signup" />
            </Link>
          </div>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
