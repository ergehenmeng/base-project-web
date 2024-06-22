import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/email/template/listPage',
    params
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/email/template/update',
    data
  });
};
