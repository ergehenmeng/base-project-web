import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/homestay/order/listPage',
    params
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/homestay/order/detail',
    params
  });
};
