import { Card, Col, Divider, Input, Row, Icon, Button, message } from 'antd';
import React, { PureComponent } from 'react';

import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { RouteChildrenProps } from 'react-router';
import { connect } from 'dva';
import BaseView from './components/base';
import { CurrentUser, ModalState, Good } from './model';
import router from 'umi/router';
import styles from './Center.less';

interface CenterProps extends RouteChildrenProps {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
  currentUserLoading: boolean;
  list: Good[];
  uploading: boolean;
}
interface CenterState {
  inputVisible: boolean;
  inputValue: string;
}

@connect(
  ({
    loading,
    accountCenter,
  }: {
    loading: { effects: { [key: string]: boolean } };
    accountCenter: ModalState;
  }) => ({
    currentUser: accountCenter.currentUser,
    list: accountCenter.list,
    currentUserLoading: loading.effects['accountCenter/shopInfo'],
    uploading: loading.effects['accountCenter/editInfo'],
  }),
)
class Center extends PureComponent<
  CenterProps,
  CenterState
> {

  state: CenterState = {
    inputVisible: false,
    inputValue: '',
  };

  /**
   * @description 跳转商品页
   * @memberof Center
   */
  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(`/types`);
  };

  /**
   * @description 初始图片
   * @returns
   * @memberof Center
   */
  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser) {
      if (currentUser.shopAvatar) {
        return currentUser.shopAvatar;
      }
      // 默认图片
      const url = '';
      return url;
    }
    return '';
  }

  handleUpload = (formData: FormData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountCenter/editInfo',
      payload: {
        formData,
        message,
        dispatch
      }
    })
  }

  public input: Input | null | undefined = undefined;

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountCenter/shopInfo'
    });
  }

  render() {
    const { currentUser, currentUserLoading, list, uploading } = this.props;
    const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length);

    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
              {!dataLoading ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <div className={styles.avatarContainer}>
                      <img alt="" src={this.getAvatarURL()} />
                    </div>
                    <div className={styles.name}>{currentUser.shopName || '暂无名字，赶紧设置吧'}</div>
                    <div>{currentUser.shopPhone}</div>
                  </div>
                  <div className={styles.detail}>
                    <p>
                      <Icon type="home" theme="filled" />
                      {currentUser.shopAddress || '暂无地址，赶紧设置吧'}
                    </p>
                  </div>
                  <Divider dashed />
                  <div className={styles.goods}>
                    {
                      list && list.length > 0 ? list.map(
                        item => {
                          return (
                          <p key={item.price.combinationId}>
                            <span>{item.price.printType}</span>
                            <span>{item.price.printPrice} 元/张</span>
                          </p>);
                        }
                      ) : (
                        <p>
                          暂无商品，赶快去设置吧
                        </p>
                      )
                    }
                  </div>
                  <Button loading={uploading} type="primary" onClick={this.handlerSubmit}>修改商品信息</Button>
                  <Divider dashed />
                </div>
              ) : null}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              loading={dataLoading}
            >
              {!dataLoading ? <BaseView onHandleUpload={this.handleUpload.bind(this)} /> : null}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
