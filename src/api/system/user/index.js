import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/user/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/user/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/user/update',
    data
  });
};

export const selectApi = (data) => {
  return request.post({
    url: '/manage/user/select',
    data
  });
};

export const lockApi = (data) => {
  return request.post({
    url: '/manage/user/lock',
    data
  });
};

export const unlockApi = (data) => {
  return request.post({
    url: '/manage/user/unlock',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/user/delete',
    data
  });
};

export const resetPwdApi = (data) => {
  return request.post({
    url: '/manage/user/reset',
    data
  });
};

export const roleListApi = () => {
  return request.get({
    url: '/manage/role/list'
  });
};

export const changePwdApi = (data) => {
  return request.post({
    url: '/manage/user/changePwd',
    data
  });
};
