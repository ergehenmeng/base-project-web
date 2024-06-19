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
