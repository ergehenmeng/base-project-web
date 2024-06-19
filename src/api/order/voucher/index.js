import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/voucher/order/listPage',
    params
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/voucher/order/detail',
    params
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/voucher/order/export',
    params
  });
};
