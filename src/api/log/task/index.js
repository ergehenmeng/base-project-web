import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/task/log/listPage',
    params
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/task/log/select',
    params
  });
};
