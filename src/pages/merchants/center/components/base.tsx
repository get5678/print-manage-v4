import { Button, Form, Input, Upload, message } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { CurrentUser } from '../model';
import styles from './BaseView.less';

const FormItem = Form.Item;

function getBase64(img: Blob, callback: { (imageUrl: string): void; (arg0: string | ArrayBuffer | null): void; }) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file: { type: string; size: number; }) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  if (!isJpgOrPng) {
    message.error('只能上传PNG和JPG类型的图片');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片不能大于2M');
  }
  return isJpgOrPng && isLt2M;
}

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar, getFieldDecorator, handleChange }: { avatar: string, getFieldDecorator: any, handleChange: any }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="account-settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.reminder}>建议上传正方形图片</div>
    <div className={styles.reminder}>以防图像变形</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <FormItem>
      {getFieldDecorator('picture')(
        <Upload
          beforeUpload={beforeUpload}
          showUploadList={false}
          onChange={handleChange}
        >
          <div className={styles.button_view}>
            <Button icon="upload">
              <FormattedMessage id="account-settings.basic.change-avatar" defaultMessage="Change avatar" />
            </Button>
          </div>
        </Upload>
      )}
    </FormItem>
  </Fragment>
);

interface BaseViewProps extends FormComponentProps {
  currentUser?: CurrentUser;
  onHandleUpload: (formData: FormData) => void;
}

@connect(({ accountCenter }: { accountCenter: { currentUser: CurrentUser } }) => ({
  currentUser: accountCenter.currentUser,
}))
class BaseView extends Component<BaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  state = {
    avatar: '',
  };

  componentDidMount() {
    this.setBaseInfo();
    this.getAvatarURL();
  }

  // 初始传值
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

  /**
   * @description 初始图片
   * @returns
   * @memberof BaseView
   */
  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser) {
      if (currentUser.shopAvatar) {
        this.setState({
          avatar: currentUser.shopAvatar
        })
        return;
      }
      // 默认图片
      this.setState({
        avatar: ''
      })
    }
    this.setState({
      avatar: ''
    })
  }

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form, onHandleUpload } = this.props;
    const formData = new FormData();
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        const { shopName, shopAddress, picture } = values
        formData.append('shopName', shopName)
        formData.append('shopAddress', shopAddress)
        if (picture) {
          formData.append('shopAvatar', picture.file.originFileObj)
        }
        // 更新
        onHandleUpload(formData)
      }
    });
  };

  handleChange(info: any) {
    if (info.file.status === 'uploading') {
      message.loading(`${info.file.name} 文件正在加载中`);
      return;
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
      getBase64(info.file.originFileObj, (imageUrl: any) =>
        this.setState({
          avatar: imageUrl,
        }),
      );
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      avatar
    } = this.state;

    return (
      <Form layout="vertical" hideRequiredMark>
        <div className={styles.baseView} ref={this.getViewDom}>
          <div className={styles.left}>
            <FormItem label='商店名'>
              {getFieldDecorator('shopName', {
                rules: [
                  {
                    required: true,
                    message: '请输入你的商店名',
                  },
                ],
              })(<Input
                maxLength={30} />)}
            </FormItem>
            <FormItem label='地址'>
              {getFieldDecorator('shopAddress', {
                rules: [
                  {
                    required: true,
                    message: '请输入你的地址',
                  },
                ],
              })(<Input
                maxLength={60} />)}
            </FormItem>
            <Button type="primary" onClick={this.handlerSubmit}>
              <FormattedMessage id="account-settings.basic.update" defaultMessage="Update Information" />
            </Button>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={avatar} getFieldDecorator={getFieldDecorator} handleChange={this.handleChange.bind(this)} />
          </div>
        </div>
      </Form>
    );
  }
}

export default Form.create<BaseViewProps>()(BaseView);
