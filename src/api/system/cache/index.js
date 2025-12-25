import request from '@/utils/request';

export const listPageApi = () => {
  return request.get({
    url: '/manage/cache/list'
  });
};

export const clearApi = (params) => {
  return request.get({
    url: '/manage/cache/clear',
    params
  });
};

export const scanApi = (params) => {
  return request.get({
    url: '/manage/cache/scan',
    params
  });
};

export const queryApi = (params) => {
  return request.get({
    url: '/manage/cache/query',
    params
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/cache/delete',
    data
  });
};