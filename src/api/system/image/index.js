import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/image/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/image/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/image/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/image/delete',
    data
  });
};
