import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/redeem/code/listPage',
    params
  });
};

export const scopeApi = (params) => {
  return request.get({
    url: '/manage/redeem/code/scope',
    params
  });
};

export const generateApi = (data) => {
  return request.post({
    url: '/manage/redeem/code/generate',
    data
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/redeem/code/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/redeem/code/update',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/redeem/code/detail',
    params
  });
};

export const deleteApi = (params) => {
  return request.get({
    url: '/manage/redeem/code/delete',
    params
  });
};

export const grantPageApi = (params) => {
  return request.get({
    url: '/manage/redeem/code/grant/listPage',
    params
  });
};

export const grantExportApi = (params) => {
  return request.get({
    url: '/manage/redeem/code/grant/export',
    params
  });
};