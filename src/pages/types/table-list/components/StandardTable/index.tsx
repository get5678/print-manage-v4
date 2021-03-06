import { Alert, Table } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import React, { Component, Fragment } from 'react';

import { TableListItem } from '../../data.d';
import styles from './index.less';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface ShopType {
  shopInfo: any;
  shopComble: any;
}

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  data: TableListItem[];
  selectedRows: TableListItem[];
  onSelectRow: (rows: any) => void;
}

export interface StandardTableColumnProps extends ColumnProps<TableListItem> {
  needTotal?: boolean;
  total?: number;
}

function initTotalList(columns: StandardTableColumnProps[]) {
  if (!columns) {
    return [];
  }
  const totalList: StandardTableColumnProps[] = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

interface StandardTableState {
  selectedRowKeys: string[];
  needTotalList: StandardTableColumnProps[];
}

class StandardTable extends Component<StandardTableProps<TableListItem>, StandardTableState> {
  static getDerivedStateFromProps(nextProps: StandardTableProps<TableListItem>) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  constructor(props: StandardTableProps<TableListItem>) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  handleRowSelectChange: TableRowSelection<TableListItem>['onChange'] = (
    selectedRowKeys,
    selectedRows: TableListItem[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys: currySelectedRowKeys, needTotalList });
  };

  handleTableChange: TableProps<TableListItem>['onChange'] = (
    pagination,
    filters,
    sorter,
    ...rest
  ) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { data, columns, ...rest } = this.props;
    const pagination = false;

    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
        }
      : false;

    const rowSelection: TableRowSelection<TableListItem> = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: (record: TableListItem) => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                ????????? <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> ???&nbsp;
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  ??????
                </a>
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          rowKey="printRelId"
          rowSelection={rowSelection}
          dataSource={data}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          columns={columns}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
