import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/verify/listPage',
    params
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/verify/export',
    params
  });
};