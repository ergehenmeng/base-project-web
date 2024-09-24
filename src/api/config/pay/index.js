import request from '@/utils/request.js';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/pay/config/listPage',
    params
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/pay/config/update',
    data
  });
};
