import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/sms/template/listPage',
    params
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/sms/template/update',
    data
  });
};
