export interface TableListItem {
  printTypeUrl: string;
  hot: string;
  shopName?: string;
  shopAddress?: string;
  disabled?: boolean;
  printType: string;
  printPrice: number;
  printRelId: number;
}
export interface shopCombleInfo {
  id: string;
  typeName: string;
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
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}
