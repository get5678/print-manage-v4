import { AnyAction, Reducer } from 'redux';
import { message } from 'antd';
import { EffectsCommandMap } from 'dva';
import {
  shopInfo,
  addInfo,
  getCombleInfo,
  updateCombleInfo,
  deleteCombleInfo,
} from '../../../services/api';

export interface StateType {
  shopInfo?: any;
  shopComble?: any;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getShopInfo: Effect;
    addShopInfo: Effect;
    getShopComble: Effect;
    updateShopComble: Effect;
    deleteShopComble: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}
interface shopItem {
  printRelId: string;
  printPrice: number;
  printType: string;
}
interface shopArray {
  hot: string;
  price: shopItem;
  printTypeUrl: string;
}

const Model: ModelType = {
  namespace: 'listTableList',
  state: {
    shopInfo: [],
    shopComble: [],
  },

  effects: {
    *getShopInfo({ payload }, { call, put }) {
      const response = yield call(shopInfo, payload);
      if (response.code !== 1) {
        message.error(response.msg);
      }
      const data: any[] = [];
      response.data.shopPrice.map((item: shopArray) => {
        data.push({
          printRelId: item.price.printRelId,
          printPrice: item.price.printPrice,
          printType: item.price.printType,
          hot: item.hot,
        });
      });
      yield put({
        type: 'save',
        attr: 'shopInfo',
        data,
      });
    },
    *addShopInfo({ payload: { successCallback, ...payload } }, { call }) {
      const response = yield call(addInfo, payload);
      if (response.code !== 1) {
        message.error(`添加失败：${response.msg}`);
      } else {
        successCallback();
      }
    },
    *getShopComble({}, { call, put }) {
      const response = yield call(getCombleInfo);
      if (response.code !== 1) {
        message.error(`获取失败：${response.msg}`);
      }
      yield put({
        type: 'save',
        attr: 'shopComble',
        data: response.data,
      });
    },
    *updateShopComble({ payload: { successCallback, updatePara } }, { call }) {
      const response = yield call(updateCombleInfo, updatePara);
      console.log('update response', response);
      if (response.code !== 1) {
        message.error(`修改失败：${response.msg}`);
      } else {
        successCallback();
      }
    },
    *deleteShopComble({ payload: { combinations } }, { call }) {
      console.log('payload', combinations);
      const response = yield call(deleteCombleInfo, combinations);
      console.log('deletet', response);
    },
  },

  reducers: {
    save(state, action) {
      const { attr, data } = action;
      return {
        ...state,
        [attr]: data,
      };
    },
  },
};

export default Model;
