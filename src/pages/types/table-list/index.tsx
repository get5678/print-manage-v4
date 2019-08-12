import { Button, Card, Col, Divider, Form, Input, Row, Select, message, Popconfirm } from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import UpdateForm, { FormValsType } from './components/UpdateForm';
import {
  TableListItem,
  TableListPagination,
  TableListParams,
  UpdateInfo,
  shopCombleInfo,
} from './data.d';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  listTableList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listTableList,
    loading,
  }: {
    listTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listTableList,
    loading: loading.models.rule,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '商品名称',
      dataIndex: 'printType',
    },
    {
      title: '价格',
      dataIndex: 'printPrice',
    },
    {
      title: '热度',
      dataIndex: 'hot',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除？" onConfirm={() => this.handleDeleteItem(record)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listTableList/getShopInfo',
    });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'listTableList/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'listTableList/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
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
        type: 'listTableList/fetch',
        payload: values,
      });
    });
  };

  handleGetShopCombine = (flag?: boolean) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listTableList/getShopComble',
    });
    this.handleModalVisible(flag);
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValsType) => {
    const {
      dispatch,
      listTableList: { shopComble },
    } = this.props;
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
    if (shopComble.length === 0) {
      dispatch({
        type: 'listTableList/getShopComble',
      });
    }
  };

  handleAdd = (fields: { price: number; conbineId: string }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listTableList/addShopInfo',
      payload: {
        price: fields.price,
        conbineId: Number(fields.conbineId),
        successCallback() {
          message.success('添加成功');
          dispatch({
            type: 'listTableList/getShopInfo',
          });
        },
      },
    });
    this.handleModalVisible();
  };
  /**
   *
   *@description 获取类型id
   * @memberof TableList
   */
  getSameID = (printType: string) => {
    const {
      listTableList: { shopComble },
    } = this.props;
    let combileId: number = 0;
    shopComble.map((item: shopCombleInfo) => {
      if (item.typeName === printType) {
        combileId = Number(item.id);
      }
    });
    return combileId;
  };

  handleUpdate = (fields: FormValsType) => {
    const { dispatch } = this.props;
    const updatePara: UpdateInfo = {
      price: Number(fields.price),
      printRelId: Number(fields.printRelId),
      conbineId: this.getSameID(fields.printType),
    };
    dispatch({
      type: 'listTableList/updateShopComble',
      payload: {
        updatePara,
        successCallback() {
          message.success('修改成功');
          dispatch({
            type: 'listTableList/getShopInfo',
          });
        },
      },
    });
    this.handleUpdateModalVisible(false);
  };

  handleDelete = (selectedRows: TableListItem[]) => {
    const { dispatch } = this.props;
    const combinations: number[] = [];
    selectedRows.map(item => {
      combinations.push(Number(item.printRelId), this.getSameID(item.printType));
    });
    dispatch({
      type: 'listTableList/deleteShopComble',
      payload: {
        combinations,
        successCallback() {
          message.success('删除成功');
          dispatch({
            type: 'listTableList/getShopInfo',
          });
        },
      },
    });
  };

  handleDeleteItem = (record: any) => {
    const { dispatch } = this.props;
    const combinations = [];
    combinations.push(Number(record.printRelId), this.getSameID(record.printType));
    dispatch({
      type: 'listTableList/deleteShopComble',
      payload: {
        combinations,
        successCallback() {
          message.success('删除成功');
          dispatch({
            type: 'listTableList/getShopInfo',
          });
        },
      },
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      listTableList: { shopComble, shopInfo },
      loading,
    } = this.props;
    console.log('render props', shopInfo);
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleGetShopCombine: this.handleGetShopCombine,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleGetShopCombine(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={() => this.handleDelete(selectedRows)}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={shopInfo}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} shopComble={shopComble} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            shopComble={shopComble}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
