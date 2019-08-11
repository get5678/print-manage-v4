import request from '@/utils/request';

const defaultContentType = 'json';

export async function http(url: string, method?: string, data?: any, requestType?: any) {
  const token = localStorage.getItem('token') || '';
  return request(url, {
    method: method || 'GET',
    data,
    headers: {
      token,
    },
    requestType: requestType || defaultContentType,
  });
}
