export interface TableListItem {
  content: string;
  score: number;
  gmtCreate: string;
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
  count: number;
  page: number;
}
