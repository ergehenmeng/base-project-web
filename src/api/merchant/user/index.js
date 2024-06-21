import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/merchant/user/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/merchant/user/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/merchant/user/update',
    data
  });
};

export const selectApi = (data) => {
  return request.post({
    url: '/manage/merchant/user/select',
    data
  });
};

export const lockApi = (data) => {
  return request.post({
    url: '/manage/merchant/user/lock',
    data
  });
};

export const unlockApi = (data) => {
  return request.post({
    url: '/manage/merchant/user/unlock',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/merchant/user/delete',
    data
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/merchant/user/export',
    params
  });
};
