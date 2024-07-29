import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/refund/log/listPage',
    params
  });
};

export const detailApi = (params) => {
  return request.get({
    url: '/manage/refund/log/item/detail',
    params
  });
};

export const auditApi = (data) => {
  return request.post({
    url: '/manage/refund/log/audit',
    data
  });
};
