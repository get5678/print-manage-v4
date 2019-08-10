import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryRule, updateRule } from './service';
import { getOrder, updateStatue } from '@/services/api';

import { TableListData } from './data.d';

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getOrder: Effect;
    confirmOrder: Effect;
    fetch: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    list: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'order',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *getOrder({ payload }, { call, put }) {
      const response = yield call(getOrder, payload);
      if (response.code === 1) {
        yield put({
          type: 'list',
          payload: response.data
        }) 
      }
    },
    *confirmOrder( { payload }, { call }) {
      yield call(updateStatue, payload);
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *update({ payload, callback}, { call }) {
      yield call(updateRule, payload);
      if (callback) {
        callback()
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    list(state, action) {
      const { orderDetailDTOList, current, pageSize } = action.payload;
      const total = Number(action.payload.total);

      return {
        ...state,
        data: {
          list: orderDetailDTOList || [],
          pagination: {
            current,
            total,
            pageSize
          }
        },
      };
    }
  },
};

export default Model;
