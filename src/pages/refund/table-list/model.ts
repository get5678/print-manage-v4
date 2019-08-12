import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryRule, updateRule } from './service';
import { refund, refuse, allow } from '@/services/api';

import { TableListData } from './data';

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
    refuseOrder: Effect;
    fetch: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    list: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'refund',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *getOrder({ payload }, { call, put }) {
      const response = yield call(refund, payload);
      console.log(response)
      if (response.code === 1) {
        yield put({
          type: 'list',
          payload: response.data
        }) 
      }
    },
    *confirmOrder({ payload }, { call }) {
      const { refundOrderId, message, dispatch, orderId } = payload;
      const response = yield call(allow, refundOrderId);
      if (response && response.code === 1) {
        message.success(`订单号${orderId}退款成功`);
      } else {
        if (response && response.msg) {
          message.error(response.msg);
        } else {
          message.error('确认退款失败');
        }
      }
      dispatch({
        type: 'refund/getOrder',
        payload: {
          page: 1,
          count: 10
        }
      })
    },
    *refuseOrder({ payload }, { call }) {
      const { refundOrderId, message, dispatch, orderId } = payload;
      const response = yield call(refuse, refundOrderId);
      if (response && response.code === 1) {
        message.success(`订单号${orderId}取消退款申请成功`);
      } else {
        if (response && response.msg) {
          message.error(response.msg);
        } else {
          message.error('取消退款申请失败');
        }
      }
      dispatch({
        type: 'refund/getOrder',
        payload: {
          page: 1,
          count: 10
        }
      })
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
      const { orderInfos, current, pageSize } = action.payload;
      const total = Number(action.payload.total);

      return {
        ...state,
        data: {
          list: orderInfos || [],
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
