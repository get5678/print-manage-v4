import { Button, Form, Input, Upload, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { CurrentUser } from '../data.d';
// import GeographicView from './GeographicView';
// import PhoneView from './PhoneView';
import styles from './BaseView.less';

const FormItem = Form.Item;
// const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="account-settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="account-settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);

interface BaseViewProps extends FormComponentProps {
  currentUser?: CurrentUser;
}

@connect(({ accountCenter }: { accountCenter: { currentUser: CurrentUser } }) => ({
  currentUser: accountCenter.currentUser,
}))
class BaseView extends Component<BaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      const url = 'http://square2.oss-cn-shanghai.aliyuncs.com/2019-08-06-%E5%9B%BE%E5%B1%82%201.png';
      return url;
    }
    return '';
  }

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields(err => {
      if (!err) {
        message.success(formatMessage({ id: 'account-settings.basic.update.success' }));
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            {/* <FormItem label='手机'>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号',
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: '手机号格式错误',
                  },
                ],
              })(
                <Input 
                maxLength={11}/>,
              )}
            </FormItem> */}
            <FormItem label='商店名'>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入你的商店名',
                  },
                ],
              })(<Input 
              maxLength={30}/>)}
            </FormItem>
            <FormItem label='地址'>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入你的地址',
                  },
                ],
              })(<Input 
              maxLength={60}/>)}
            </FormItem>
            <Button type="primary" onClick={this.handlerSubmit}>
              <FormattedMessage id="account-settings.basic.update" defaultMessage="Update Information" />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default Form.create<BaseViewProps>()(BaseView);
