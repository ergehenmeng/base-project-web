import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/poi/type/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/poi/type/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/poi/type/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/poi/type/delete',
    data
  });
};

