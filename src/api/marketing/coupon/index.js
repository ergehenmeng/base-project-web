import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/coupon/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/coupon/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/coupon/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/coupon/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/coupon/select',
    params
  });
};

export const openApi = (data) => {
  return request.post({
    url: '/manage/coupon/open',
    data
  });
};

export const closeApi = (data) => {
  return request.post({
    url: '/manage/coupon/close',
    data
  });
};

export const grantApi = (data) => {
  return request.post({
    url: '/manage/coupon/grant',
    data
  });
};


export const receivePageApi = (params) => {
  return request.get({
    url: '/manage/coupon/receivePage',
    params
  });
};