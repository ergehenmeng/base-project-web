import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/banner/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/banner/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/banner/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/banner/delete',
    data
  });
};

export const stateApi = (data) => {
  return request.post({
    url: '/manage/banner/updateState',
    data
  });
};

export const sortApi = (data) => {
  return request.post({
    url: '/manage/banner/sort',
    data
  });
};
