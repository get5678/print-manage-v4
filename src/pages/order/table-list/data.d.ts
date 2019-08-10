export interface TableListItem {
  // key: number;
  // disabled?: boolean;
  // href: string;
  // avatar: string;
  // name: string;
  // title: string;
  // owner: string;
  // desc: string;
  // callNo: number;
  // status: number;
  // updatedAt: Date;
  // createdAt: Date;
  // progress: number;
  id: number;
  receivingCode: string | number;
  printSize: string | number;
  payment: string | number;
  printNum: number;
  printDirection: string;
  documentName: string;
  printType: string;
  gmtCreate: string;
  shopName: string;
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
  orderStatus: string[];
  count: number;
  page: number;
}
