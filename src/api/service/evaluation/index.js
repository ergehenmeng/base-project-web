import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/order/evaluation/listPage',
    params
  });
};

export const shieldApi = (data) => {
  return request.post({
    url: '/manage/order/evaluation/shield',
    data
  });
};