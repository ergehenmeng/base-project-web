import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/item/order/listPage',
    params
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/item/order/detail',
    params
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/item/order/export',
    params
  });
};
