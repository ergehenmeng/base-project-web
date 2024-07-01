import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/limit/purchase/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/limit/purchase/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/limit/purchase/update',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/limit/purchase/detail',
    params
  });
};

export const deleteApi = (params) => {
  return request.get({
    url: '/manage/limit/purchase/delete',
    params
  });
};