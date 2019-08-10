import request from '@/utils/request';

const url = 'https://pin.varbee.com/cloudprint/manager';
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
}
interface ConbinInfo {
  price: number;
  conbineId: number;
}
interface DeteleInfo {
  combinations: any;
}

interface Code {
  code: number;
  data: any[];
  msg: string;
}

const token = localStorage.getItem('token') || '';

/**
 * @desperation 商家获取信息接口
 * @export
 * @returns {Promise<any>}
 */
export async function shopInfo(): Promise<any> {
  const token = localStorage.getItem('token') || '';
  console.log('token', token);
  return request(`${url}/shop/shopInfo`, {
    headers: {
      token,
    },
  });
}

/**
 * @description 商家修改基本信息
 * @export
 * @returns {Promise<any>}
 */
export async function editInfo(data: FormData): Promise<Code> {
  console.log(data);
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
  return request(`${url}/shop/combinations`, {
    headers: {
      token,
    },
  });
}
/**
 * @description 商家删除商品组合
 * @param data
 */
export async function deleteCombleInfo(data: DeteleInfo): Promise<Code> {
  return request(`${url}/shop/delete`, {
    headers: {
      token,
    },
    data,
  });
}

/**
 * @description 发送验证码
 * @export
 * @param {string} phoneNum
 * @returns {Promise<any>}
 */
export async function sendAuthCode(phoneNum: string): Promise<Code> {
  return request(`${url}/sendAuthCode?phoneNum=${phoneNum}&flag=${1}`, {
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
  return request(`${url}/order/updateStatue`, {
    method: 'POST',
    data,
    headers: {
      token,
    },
  });
}
