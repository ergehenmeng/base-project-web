import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/config/listPage',
    params
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/config/update',
    data
  });
};
