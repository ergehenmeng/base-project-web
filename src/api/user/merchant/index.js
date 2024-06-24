import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/merchant/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/merchant/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/merchant/update',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/merchant/detail',
    params
  });
};

export const lockApi = (data) => {
  return request.post({
    url: '/manage/merchant/lock',
    data
  });
};

export const unlockApi = (data) => {
  return request.post({
    url: '/manage/merchant/unlock',
    data
  });
};

export const unbindApi = (data) => {
  return request.post({
    url: '/manage/merchant/unbind',
    data
  });
};

export const resetPwdApi = (data) => {
  return request.post({
    url: '/manage/merchant/resetPwd',
    data
  });
};

export const adjustRateApi = (data) => {
  return request.post({
    url: '/manage/merchant/adjustRate',
    data
  });
};

export const logoutApi = (data) => {
  return request.post({
    url: '/manage/merchant/logout',
    data
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/merchant/export',
    params
  });
};

