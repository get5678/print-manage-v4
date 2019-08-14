import { AnyAction, Reducer } from 'redux';
import { message } from 'antd'
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
// import { fakeAccountLogin, getFakeCaptcha } from './service';
import { login, logout } from '@/services/api';
import { getPageQuery, setAuthority } from './utils/utils';
import { reloadAuthorized } from '@/utils/Authorized'
import { stringify } from 'qs';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'guest' | 'admin';
  code?: number;
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
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userLogin',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response && response.code === 1) {
        message.success('登陆成功!');
        localStorage.setItem('token', response.data);
        response.currentAuthority = 'admin';
      } else if (response && response.msg) {
        message.error(response.msg);
        response.status = 'error';
        response.currentAuthority = 'guest';
      } else {
        message.error('连接服务器失败');
      }
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      reloadAuthorized();
      // Login successfully
      if (response && response.code === 1) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    *logout({ payload }, { call, put }) {
      yield call(logout, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 'error',
          currentAuthority: 'guest',
        },
      });
      localStorage.removeItem('token');
      reloadAuthorized();
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload && payload.currentAuthority) {
        setAuthority(payload.currentAuthority);
      } else {
        setAuthority('guest');
      }
      return {
        ...state,
        status: payload.status || 'error',
        code: payload.code || -1,
        type: payload.type,
        msg: payload.msg,
      };
    },
  },
};

export default Model;
