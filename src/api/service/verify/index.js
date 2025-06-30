import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/order/verify/listPage',
    params
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/order/verify/export',
    params
  });
};