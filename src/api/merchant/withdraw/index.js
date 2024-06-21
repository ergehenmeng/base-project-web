import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/merchant/withdraw/listPage',
    params
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/merchant/withdraw/export',
    params
  });
};

export const applyApi = (params) => {
  return request.post({
    url: '/manage/merchant/withdraw/apply',
    params
  });
};
