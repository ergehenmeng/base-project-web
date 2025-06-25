import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/lottery/listPage',
    params
  });
};

export const logPageApi = (params) => {
  return request.get({
    url: '/manage/lottery/logPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/lottery/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/lottery/update',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/lottery/detail',
    params
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/lottery/delete',
    data
  });
};

export const grantApi = (data) => {
  return request.post({
    url: '/manage/lottery/grant',
    data
  });
};