import request from '@/utils/request';

const url = 'https://pin.varbee.com/cloudprint/manager'
// const url = '/cloudprint'

interface RegisterInfo {
  phoneNum: string;
  psw: string;
  authCode: string;
}

interface LoginInfo {
  phoneNum: string;
  psw: string;
}

interface PageInfo {
  page: number;
  count: number;
  orderStatus: string[] | number[]
}

/**
 * @desperation 商家获取信息接口
 * @export
 * @returns {Promise<any>}
 */
export async function shopInfo(): Promise<any> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/shop/shopInfo`, {
    headers: {
      token
    }
  });
}

/**
 * @description 商家修改基本信息
 * @export
 * @returns {Promise<any>}
 */
export async function editInfo(data: FormData): Promise<any> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/shop/editInfo`, {
    method: 'POST',
    data,
    headers: {
      token
    }
  });
}

/**
 * @description 发送验证码
 * @export
 * @param {string} phoneNum
 * @returns {Promise<any>}
 */
export async function sendAuthCode(phoneNum: string): Promise<any> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/sendAuthCode?phoneNum=${phoneNum}&flag=${1}`, {
    headers: {
      token
    }
  });
}

/**
 * @description 注册
 * @export
 * @param {*} data
 * @returns {Promise<any>}
 */
export async function register(data: RegisterInfo): Promise<any> {
  // const token = localStorage.getItem('token') || '';
  return request(`${url}/register`, {
    method: 'POST',
    data
  });
}

/**
 * @description 登录
 * @export
 * @param {LoginInfo} data
 * @returns {Promise<any>}
 */
export async function login(data: LoginInfo): Promise<any> {
  // const token = localStorage.getItem('token') || '';
  return request(`${url}/login`, {
    method: 'POST',
    data
  });
}

/**
 * @description 登出
 * @export
 * @returns {Promise<any>}
 */
export async function logout(): Promise<any> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/logout`, {
    headers: {
      token
    }
  });
}

/**
 * @description 修改密码
 * @export
 * @param {RegisterInfo} data
 * @returns {Promise<any>}
 */
export async function changePsw(data: RegisterInfo): Promise<any> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/changePsw`, {
    method: 'POST',
    data,
    headers: {
      token
    }
  });
}

/**
 * @description 反馈列表
 * @export
 * @param {PageInfo} data
 * @returns {Promise<any>}
 */
export async function getFeedback(data: PageInfo): Promise<any> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/feedback/getFeedback`, {
    method: 'POST',
    data,
    headers: {
      token
    }
  });
}

/**
 * @description 获取订单列表
 * @export
 * @param {PageInfo} data
 * @returns {Promise<any>}
 */
export async function getOrder(data: PageInfo): Promise<any> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/order/getOrder`, {
    method: 'POST',
    data,
    headers: {
      token
    }
  });
}

/**
 * @description 更新订单状态
 * @export
 * @param {{orderId: string}} data
 * @returns {Promise<any>}
 */
export async function updateStatue(data: {orderId: string}): Promise<any> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/order/updateStatue`, {
    method: 'POST',
    data,
    headers: {
      token
    }
  });
}

/**
 * @description 获取退款信息接口
 * @export
 * @param {{page: number, size: number, status: number[]}} data
 * @returns {Promise<any>}
 */
export async function refund(data: {page: number, size: number, status: number[] | string[]}): Promise<any> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/order/refund`, {
    method: 'POST',
    data,
    headers: {
      token
    }
  });
}

/**
 * @description 商家拒绝退款
 * @export
 * @param {number} refundId
 * @returns {Promise<any>}
 */
export async function refuse(refundId: number): Promise<any> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/order/refuse?refundId=${refundId}`, {
    headers: {
      token
    }
  });
}

/**
 * @description 商家确认退款
 * @export
 * @param {number} refundId
 * @returns {Promise<any>}
 */
export async function allow(refundId: number): Promise<any> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/order/allow?refundId=${refundId}`, {
    headers: {
      token
    }
  });
}