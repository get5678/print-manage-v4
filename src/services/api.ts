import request from '@/utils/request';
// import { http } from '@/utils/globalRquest';
// const url = 'https://pin.varbee.com/cloudprint/manager';
// const url = 'http://min.our16.top/cloudprint/manager'
const url = '/cloudprint';

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
interface ConbinInfo {
  price: number;
  conbineId: number;
}
interface DeteleInfo {
  combinations: any;
}

interface UpdateInfo {
  price: number;
  conbineId: number;
  printRelId: number;
}

interface Code {
  code: number;
  data: any[];
  msg: string;
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
      token,
    },
  });
}
// export function shopInfo() {
//   http(`${url}/shop/shopInfo`)
// }

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
      token,
    },
  });
}
/**
 * @description 商家添加商品组合信息
 * @param data
 */
export async function addInfo(data: ConbinInfo): Promise<Code> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/shop/additionPrintType`, {
    method: 'POST',
    headers: {
      token,
    },
    data,
  });
}
/**
 * @description 商家获取组合类型
 */
export async function getCombleInfo(): Promise<Code> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/shop/combinations`, {
    headers: {
      token,
    },
  });
}
/**
 * @description 商家修改组合类型
 * @param data
 */
export async function updateCombleInfo(data: UpdateInfo): Promise<Code> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/shop/editPrintType`, {
    headers: {
      token,
    },
    method: 'POST',
    data,
  });
}
/**
 * @description 商家删除商品组合
 * @param data
 */
export async function deleteCombleInfo(data: DeteleInfo): Promise<Code> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/shop/delete`, {
    method: 'POST',
    data,
    headers: {
      token,
    },
    requestType: 'json',
  });
}

/**
 * @description 发送验证码
 * @export
 * @param {{phoneNum: string, flag: number}} data
 * @returns {Promise<Code>}
 */
export async function sendAuthCode(data: {phoneNum: string, flag: number}): Promise<Code> {
  const token = localStorage.getItem('token') || '';
  const { phoneNum, flag } = data;
  return request(`${url}/sendAuthCode?phoneNum=${phoneNum}&flag=${flag}`, {
    headers: {
      token,
    },
  });
}

/**
 * @description 注册
 * @export
 * @param {*} data
 * @returns {Promise<any>}
 */
export async function register(data: RegisterInfo): Promise<Code> {
  return request(`${url}/register`, {
    method: 'POST',
    data,
  });
}

/**
 * @description 登录
 * @export
 * @param {LoginInfo} data
 * @returns {Promise<any>}
 */
export async function login(data: LoginInfo): Promise<Code> {
  return request(`${url}/login`, {
    method: 'POST',
    data,
  });
}

/**
 * @description 登出
 * @export
 * @returns {Promise<any>}
 */
export async function logout(): Promise<Code> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/logout`, {
    headers: {
      token,
    },
  });
}

/**
 * @description 修改密码
 * @export
 * @param {RegisterInfo} data
 * @returns {Promise<any>}
 */
export async function changePsw(data: RegisterInfo): Promise<Code> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/changePsw`, {
    method: 'POST',
    data,
    headers: {
      token,
    },
  });
}

/**
 * @description 反馈列表
 * @export
 * @param {PageInfo} data
 * @returns {Promise<any>}
 */
export async function getFeedback(data: PageInfo): Promise<Code> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/feedback/getFeedback`, {
    method: 'POST',
    data,
    headers: {
      token,
    },
  });
}

/**
 * @description 获取订单列表
 * @export
 * @param {PageInfo} data
 * @returns {Promise<any>}
 */
export async function getOrder(data: PageInfo): Promise<Code> {
  const token = localStorage.getItem('token') || '';
  return request(`${url}/order/getOrder`, {
    method: 'POST',
    data,
    headers: {
      token,
    },
  });
}

/**
 * @description 更新订单状态
 * @export
 * @param {{orderId: string}} data
 * @returns {Promise<any>}
 */
export async function updateStatue(data: { orderId: string }): Promise<Code> {
  const token = localStorage.getItem('token') || '';
  const { orderId } = data;
  return request(`${url}/order/updateStatue?orderId=${orderId}`, {
    method: 'POST',
    data,
    headers: {
      token,
    },
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
