import { Effect } from 'dva';
import { Reducer } from 'redux';

// import { queryCurrent, query as queryUsers } from '@/services/user';
import { shopInfo } from '@/services/api'

export interface CurrentUser {
  // avatar?: string;
  // name?: string;
  // title?: string;
  // group?: string;
  // signature?: string;
  // tags?: {
  //   key: string;
  //   label: string;
  // }[];
  // unreadCount?: number;
  id: string | number;
  shopName?: string;
  shopAvatar?: string;
  shopAddress?: string;
  shopPhone: string;
}

export interface UserModelState {
  currentUser?: Partial<CurrentUser>;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    shopInfo: Effect;
    // fetch: Effect;
    // fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    // changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {}
  },

  effects: {
    *shopInfo(_, { call, put }) {
      const response = yield call(shopInfo);
      if (response.code === 1) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data
        })
      }
    },
    // *fetch(_, { call, put }) {
    //   const response = yield call(queryUsers);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },
    // *fetchCurrent(_, { call, put }) {
    //   const response = yield call(queryCurrent);
    //   yield put({
    //     type: 'saveCurrentUser',
    //     payload: response,
    //   });
    // },
  },

  reducers: {
    saveCurrentUser(state, { payload }) {
      let good = [];
      if (payload.shopPrice) {
        good = payload.shopPrice;
        delete payload.shopPrice;
      }
      return {
        ...state,
        currentUser: payload || {},
        list: good
      };
    }
    // changeNotifyCount(
    //   state = {
    //     currentUser: {},
    //   },
    //   action,
    // ) {
    //   return {
    //     ...state,
    //     currentUser: {
    //       ...state.currentUser,
    //       notifyCount: action.payload.totalCount,
    //       unreadCount: action.payload.unreadCount,
    //     },
    //   };
    // },
  },
};

export default UserModel;
