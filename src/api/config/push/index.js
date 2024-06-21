import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/push/listPage',
    params
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/push/update',
    data
  });
};
