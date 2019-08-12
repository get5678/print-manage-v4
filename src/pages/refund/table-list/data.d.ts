export interface TableListItem {
  refundOrderId: number | string;
  refund_fee: number | string;
  orderId: string;
  combine: string;
  reviceCode: number | string;
  documentName: string;
  createDate: string;
  phoneNum: string;
  payType: string;
  orderStatus: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  status: string[];
  size: number;
  page: number;
}
