import {
  Card,
  Form
} from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListPagination, TableListParams } from './data.d';

import styles from './style.less';

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  feedbackList: StateType;
}

interface TableListState {
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    feedbackList,
    loading,
  }: {
    feedbackList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    feedbackList,
    loading: loading.models.feedbackList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '反馈内容',
      dataIndex: 'content',
    },
    {
      title: '评分',
      dataIndex: 'score',
      align: 'right',
      render: (val: string) => `${val} `,
      // mark to display a total number
      // needTotal: true,
    },
    {
      title: '反馈时间',
      dataIndex: 'gmtCreate',
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    // {
    //   title: '操作',
    //   render: (text, record) => (
    //     <Fragment>
    //       <a href="">删除</a>
    //       {/* <Divider type="vertical" />
    //       <a href="">其他操作</a> */}
    //     </Fragment>
    //   ),
    // },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'feedbackList/list',
      payload: {
        page: 1,
        count: 10
      }
    });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      page: pagination.current,
      count: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    dispatch({
      type: 'feedbackList/list',
      payload: params,
    });
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'feedbackList/list',
        payload: values,
      });
    });
  };

  render() {
    const {
      feedbackList: { data },
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
              rowKey="id"
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
