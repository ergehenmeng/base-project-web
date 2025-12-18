import request from '@/utils/request';

export const listApi = (params) => {
  return request.get({
    url: '/manage/family/list',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/family/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/family/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/family/delete',
    data
  });
};