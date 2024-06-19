import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/auth/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/auth/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/auth/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/auth/delete',
    data
  });
};
