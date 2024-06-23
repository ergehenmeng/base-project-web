import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/task/listPage',
    params
  });
};

export const refreshApi = () => {
  return request.get({
    url: '/manage/task/refresh'
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/task/update',
    data
  });
};

export const executeApi = (data) => {
  return request.post({
    url: '/manage/task/execute',
    data
  });
};
