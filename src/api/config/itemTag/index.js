import request from '@/utils/request';

export const listApi = (params) => {
  return request.get({
    url: '/manage/item/tag/list',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/item/tag/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/item/tag/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/item/tag/delete',
    data
  });
};

export const sortApi = (data) => {
  return request.post({
    url: '/manage/item/tag/sort',
    data
  });
};
