import { AnyAction, Reducer } from 'redux';
import { message } from 'antd'

import { EffectsCommandMap } from 'dva';
// import { fakeRegister } from './service';
import { sendAuthCode, changePsw } from '@/services/api';

export interface StateType {
  status?: number;
  currentAuthority?: 'user' | 'guest' | 'admin';
  msg?: string;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    // submit: Effect;
    sendAuthCode: Effect;
    changePsw: Effect;
  };
  reducers: {
    registerHandle: Reducer<StateType>;
    clearStatus: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'userChangePsw',

  state: {
    status: undefined,
  },

  effects: {
    // *submit({ payload }, { call, put }) {
    //   const response = yield call(fakeRegister, payload);
    //   yield put({
    //     type: 'registerHandle',
    //     payload: response,
    //   });
    // },
    *sendAuthCode({ payload }, { call }) {
      const response = yield call(sendAuthCode, payload);
      if (response.code === 1) {
        message.success(response.msg);
      } else {
        message.error(response.msg);
      }
    },
    *changePsw({ payload }, { call, put }) {
      const response = yield call(changePsw, payload);
      if (response && response.code !== 1) {
        message.error(response.msg);
      }
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    }
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.code,
        msg: payload.msg
      };
    },
    clearStatus(state) {
      return {
        ...state,
        status: 999
      }
    }
  },
};

export default Model;
