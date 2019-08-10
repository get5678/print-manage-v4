import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { shopInfo, editInfo } from '@/services/api'

export interface CurrentUser {
  id: string | number;
  shopName?: string;
  shopAvatar?: string;
  shopAddress?: string;
  shopPhone: string;
}
export interface Good {
  printTypeUrl: string;
  hot: number | string;
  price: {
    printType: string;
    printPrice: number;
    combinationId: number
  }
}

export interface ModalState {
  currentUser: Partial<CurrentUser>;
  list: Good[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ModalState) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    shopInfo: Effect;
    editInfo: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'accountCenter',

  state: {
    currentUser: {},
    list: [],
  },

  effects: {
    *shopInfo(_, { call, put }) {
      const response = yield call(shopInfo);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data
      })
    },
    *editInfo({ payload }, { call }) {
      const { formData, message, dispatch } = payload;
      const response = yield call(editInfo, formData);
      if (response.code === 1) {
        message.success('更新基本信息成功');
        dispatch({
          type: 'accountCenter/shopInfo'
        });
      } else {
        message.error(response.msg);
      }
    }
  },

  reducers: {
    saveCurrentUser(state, { payload }) {
      let good = [];
      if (payload.shopPrice) {
        good = payload.shopPrice;
        delete payload.shopPrice;
      }
      return {
        ...(state as ModalState),
        currentUser: payload || {},
        list: good
      };
    }
  },
};

export default Model;
