import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/score/account/log/listPage',
    params
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/score/account/log/export',
    params
  });
};
