import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/restaurant/voucher/listPage',
    params
  });
};

export const voucherPageApi = (params) => {
  return request.get({
    url: '/manage/restaurant/voucher/productListPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/restaurant/voucher/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/restaurant/voucher/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/restaurant/voucher/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/restaurant/voucher/select',
    params
  });
};

export const shelvesApi = (data) => {
  return request.post({
    url: '/manage/restaurant/voucher/shelves',
    data
  });
};

export const unShelvesApi = (data) => {
  return request.post({
    url: '/manage/restaurant/voucher/unShelves',
    data
  });
};

export const platformUnShelvesApi = (data) => {
  return request.post({
    url: '/manage/restaurant/voucher/platformUnShelves',
    data
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/restaurant/voucher/export',
    params
  });
};
