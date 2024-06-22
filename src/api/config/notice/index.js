import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/notice/template/listPage',
    params
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/notice/template/update',
    data
  });
};
