import {
  Badge,
  Card,
  Form,
  message,
  Divider
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListPagination, TableListParams } from './data';

import styles from './style.less';

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const statusMap = ['default', 'success', 'processing', 'error', 'processing', 'processing', 'default', 'error', 'default', 'default'];
const status = ['已完成', '打印完成待收货', '正在打印', '打印失败', '待支付', '申请退款中', '退款成功', '商家拒绝退款', '用户取消退款', '已过期'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  refund: StateType;
}

interface TableListState {
  selectedRows: TableListItem[];
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    refund,
    loading,
  }: {
    refund: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    refund,
    loading: loading.models.refund,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    selectedRows: [],
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '订单号',
      dataIndex: 'orderId'
    },
    {
      title: '文件名',
      dataIndex: 'documentName',
    },
    {
      title: '类型',
      dataIndex: 'combine'
    },
    {
      title: '价格(RMB)',
      align: 'right',
      dataIndex: 'refund_fee'
    },
    {
      title: '取货码',
      dataIndex: 'reviceCode'
    },
    {
      title: '状态',
      dataIndex: 'orderStatus',
      filters: [
        {
          text: status[0],
          value: '0',
        },
        {
          text: status[1],
          value: '1',
        },
        {
          text: status[2],
          value: '2',
        },
        {
          text: status[3],
          value: '3',
        },
        {
          text: status[4],
          value: '4',
        },
        {
          text: status[5],
          value: '5',
        },
        {
          text: status[6],
          value: '6',
        },
        {
          text: status[7],
          value: '7',
        },
        {
          text: status[8],
          value: '8',
        },
        {
          text: status[9],
          value: '9',
        },
      ],
      render(val: IStatusMapType) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createDate'
    },
    {
      title: '电话',
      dataIndex: 'phoneNum'
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={this.handleConfirm.bind(this, record.orderStatus, record.refundOrderId, record.orderId)}>确认退款</a>
          <Divider type="vertical" />
          <a onClick={this.handleRefuse.bind(this, record.orderStatus, record.refundOrderId, record.orderId)}>取消退款</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'refund/fetch',
    //   payload: {
    //     page: 1,
    //     size: 10
    //   }
    // })
    dispatch({
      type: 'refund/getOrder',
      payload: {
        page: 1,
        size: 10
      }
    })
  }

  /**
   * @description 确认退款
   * @memberof TableList
   */
  handleConfirm = (orderStatus: number, refundOrderId: number | string, orderId: number | string) => {
    const { dispatch } = this.props;
    
    if (orderStatus !== 5) {
      message.error('确认退款失败，不是可以确认的状态');
      message.error('目前状态为' + status[orderStatus]);
    } else {
      dispatch({
        type: 'refund/confirmOrder',
        payload: {
          refundOrderId,
          orderId,
          message,
          dispatch
        }
      })
    }
  }

  /**
   * @description 取消退款
   * @memberof TableList
   */
  handleRefuse = (orderStatus: number, refundOrderId: number | string, orderId: number | string) => {
    const { dispatch } = this.props;

    if (orderStatus !== 5) {
      message.error('确认退款失败，不是可以确认的状态');
      message.error('目前状态为' + status[orderStatus]);
    } else {
      dispatch({
        type: 'refund/confirmOrder',
        payload: {
          refundOrderId,
          orderId,
          message,
          dispatch
        }
      })
    }
  }

  /**
   * @description 处理订单Table
   * @memberof TableList
   */
  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
  ) => {
    const { dispatch } = this.props;

    const orderStatus = filtersArg.orderStatus;

    const params: Partial<TableListParams> = {
      page: pagination.current,
      size: pagination.pageSize,
      status: (orderStatus && orderStatus.length > 0) ? orderStatus : undefined
    };

    dispatch({
      type: 'refund/getOrder',
      payload: params,
    });
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  render() {
    const {
      refund: { data },
      loading,
    } = this.props;

    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey='refundOrderId'
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
