import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/log/listPage',
    params
  });
};
