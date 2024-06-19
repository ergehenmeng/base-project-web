import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/merchant/address/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/merchant/address/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/merchant/address/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/merchant/address/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/merchant/address/select',
    params
  });
};
