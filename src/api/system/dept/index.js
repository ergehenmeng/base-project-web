import request from '@/utils/request';

export const listApi = (params) => {
  return request.get({
    url: '/manage/dept/list',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/dept/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/dept/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/dept/delete',
    data
  });
};

