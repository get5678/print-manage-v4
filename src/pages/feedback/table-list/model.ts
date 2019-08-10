/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-02 19:17:01
 * @LastEditTime: 2019-08-09 16:24:48
 * @LastEditors: Please set LastEditors
 */
import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getFeedback } from '@/services/api';

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
    list: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'feedbackList',

  state: {
    data: {
      list: [],
      pagination: {},
    }
  },

  effects: {
    *list({ payload }, { call, put}) {
      const response = yield call(getFeedback, payload);
      if (response.code === 1) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    }
  },

  reducers: {
    save(state, action) {
      const { feedbackDTOList, current, pageSize } = action.payload;
      const total = Number(action.payload.total);

      return {
        ...state,
        data: {
          list: feedbackDTOList || [],
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
