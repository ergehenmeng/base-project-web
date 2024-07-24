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

export const adjustApi = (data) => {
  return request.post({
    url: '/manage/order/adjust/item',
    data
  });
};

export const expressApi = (data) => {
  return request.post({
    url: '/manage/item/order/updateExpress',
    data
  });
};

export const sippingApi = (data) => {
  return request.post({
    url: '/manage/item/order/sipping',
    data
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/item/order/export',
    params
  });
};
