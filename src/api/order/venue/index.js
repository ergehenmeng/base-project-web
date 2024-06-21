import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/venue/order/listPage',
    params
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/venue/order/detail',
    params
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/venue/order/export',
    params
  });
};
