import { Button, Col, Form, Input, Popover, Progress, Row, Select, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import JsEncrypt from 'jsencrypt'

import { StateType } from './model';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="user-register.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="user-register.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="user-register.strength.short" />
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

interface RegisterProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  userChangePsw: StateType;
  submitting: boolean;
}
interface RegisterState {
  count: number;
  confirmDirty: boolean;
  visible: boolean;
  help: string;
  prefix: string;
  invite: string;
}

export interface UserRegisterParams {
  mail: string;
  password: string;
  confirm: string;
  mobile: string;
  captcha: string;
  prefix: string;
  invite: string;
}

@connect(
  ({
    userChangePsw,
    loading,
  }: {
    userChangePsw: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userChangePsw,
    submitting: loading.effects['userChangePsw/register'],
  }),
)
class Register extends Component<
  RegisterProps,
  RegisterState
> {
  state: RegisterState = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
    invite: ''
  };

  interval: number | undefined = undefined;

  componentDidUpdate() {
    const { userChangePsw, form, dispatch } = this.props;
    const account = form.getFieldValue('mobile');
    if (userChangePsw.status === -2) {
      dispatch({
        type: 'userChangePsw/clearStatus'
      })
      message.success('???????????????');
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    const { form, dispatch } = this.props;
    form.validateFields(['password', 'confirm', 'mobile'], { force: true }, (err, values) => {
      if (!err) {
        const { mobile } = values;
        dispatch({
          type: 'userChangePsw/sendAuthCode',
          payload: {
            phoneNum: mobile,
            flag: 0
          }
        })
        let count = 59;
        this.setState({ count });
        this.interval = window.setInterval(() => {
          count -= 1;
          this.setState({ count });
          if (count === 0) {
            clearInterval(this.interval);
          }
        }, 1000);
      }
    });
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  /**
   * @description RSA??????
   * @memberof Register
   */
  RSAencrypt = (psw: string) => {
    const jse = new JsEncrypt();
    jse.setPublicKey(`
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwxZwvV2JrICiSqokCqQnzy3hyczFbQ0rzVLwnmpk9/ydUpZU6PlDrLf83IVEA4htGytxFeHIYIxgZ5HRlEESacoJBHspRVajY/rIxenF8xJsOy7+NFZLGvMCTnYVchts+YUFTnm/BB16DDex7mJ3ZtiBJBYbdFQpC+6IkDAnueQIDAQAB
    `);
    return jse.encrypt(psw);
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      const { captcha, mobile, password } = values
      if (!err) {
        dispatch({
          type: 'userChangePsw/changePsw',
          payload: {
            phoneNum: mobile,
            psw: this.RSAencrypt(password),
            authCode: captcha
          },
        });
      }
    });
  };

  checkConfirm = (rule: any, value: string, callback: (messgae?: string) => void) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'user-register.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule: any, value: string, callback: (messgae?: string) => void) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'user-register.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = (value: string) => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, help, visible } = this.state;
    return (
      <div className={styles.main}>
        <h3>
          ????????????
        </h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            <InputGroup compact>
              <Select
                size="large"
                value={prefix}
                onChange={this.changePrefix}
                style={{ width: '25%' }}
              >
                <Option value="86">+86</Option>
              </Select>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'user-register.phone-number.required' }),
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: formatMessage({ id: 'user-register.phone-number.wrong-format' }),
                  },
                ],
              })(
                <Input
                  size="large"
                  style={{ width: '75%' }}
                  placeholder={formatMessage({ id: 'user-register.phone-number.placeholder' })}
                />,
              )}
            </InputGroup>
          </FormItem>
          <FormItem help={help}>
            <Popover
              getPopupContainer={node => {
                if (node && node.parentNode) {
                  return node.parentNode as HTMLElement;
                }
                return node;
              }}
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FormattedMessage id="user-register.strength.msg" />
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  maxLength={16}
                  placeholder={formatMessage({ id: 'user-register.password.placeholder' })}
                />,
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'user-register.confirm-password.required' }),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                maxLength={16}
                placeholder={formatMessage({ id: 'user-register.confirm-password.placeholder' })}
              />,
            )}
          </FormItem>
          {/* <FormItem>
            {getFieldDecorator('invite', {
              rules: [
                {
                  required: true,
                  message: '??????????????????',
                }
              ],
            })(
              <Input
                size="large"
                placeholder='????????????????????????????????????'
              />,
            )}
          </FormItem> */}
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('captcha', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'user-register.verification-code.required' }),
                    },
                  ],
                })(
                  <Input
                    size="large"
                    maxLength={6}
                    placeholder={formatMessage({ id: 'user-register.verification-code.placeholder' })}
                  />,
                )}
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={!!count}
                  className={styles.getCaptcha}
                  onClick={this.onGetCaptcha}
                >
                  {count
                    ? `${count} s`
                    : formatMessage({ id: 'user-register.register.get-verification-code' })}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              ????????????
            </Button>
            <Link className={styles.login} to="/user/login">
              <FormattedMessage id="user-register.register.sign-in" />
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create<RegisterProps>()(Register);
