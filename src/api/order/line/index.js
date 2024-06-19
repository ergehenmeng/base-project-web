import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/line/order/listPage',
    params
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/line/order/detail',
    params
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/line/order/export',
    params
  });
};
