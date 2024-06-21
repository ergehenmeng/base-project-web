import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/merchant/account/log/listPage',
    params
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/merchant/account/log/export',
    params
  });
};
