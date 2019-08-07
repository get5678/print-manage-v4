import { Card, Col, Divider, Input, Row, Icon, Button } from 'antd';
import React, { PureComponent } from 'react';

import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { RouteChildrenProps } from 'react-router';
import { connect } from 'dva';
import BaseView from './components/base';
import { ModalState } from './model';
import router from 'umi/router';
import { CurrentUser } from './data.d';
import styles from './Center.less';

interface CenterProps extends RouteChildrenProps {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
  currentUserLoading: boolean;
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
    currentUserLoading: loading.effects['accountCenter/fetchCurrent'],
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

  public input: Input | null | undefined = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountCenter/fetchCurrent',
    });
    dispatch({
      type: 'accountCenter/fetch',
    });
  }

  render() {
    const { currentUser, currentUserLoading } = this.props;
    const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length);
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
              {!dataLoading ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.avatar} />
                    <div className={styles.name}>{currentUser.name}</div>
                    <div>18048916710</div>
                  </div>
                  <div className={styles.detail}>
                    <p>
                      <Icon type="home" theme="filled" />
                      教师公寓
                    </p>
                  </div>
                  <Divider dashed />
                  <div className={styles.goods}>
                    <p>
                      <span>黑白单面A4</span>
                      <span>0.2 元/张</span>
                    </p>
                    <p>
                      <span>黑白双面A4</span>
                      <span>0.2 元/张</span>
                    </p>
                  </div>
                  <Button type="primary" onClick={this.handlerSubmit}>跳转修改商品</Button>
                  <Divider dashed />
                </div>
              ) : null}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
            >
              <BaseView /> 
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
