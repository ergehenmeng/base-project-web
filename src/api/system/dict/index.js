import request from '@/utils/request';

export const listApi = (params) => {
  return request.get({
    url: '/manage/dict/list',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/dict/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/dict/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/dict/delete',
    data
  });
};

export const createItemApi = (data) => {
  return request.post({
    url: '/manage/dict/item/create',
    data
  });
};

export const updateItemApi = (data) => {
  return request.post({
    url: '/manage/dict/item/update',
    data
  });
};

export const deleteItemApi = (data) => {
  return request.post({
    url: '/manage/dict/item/delete',
    data
  });
};

export const dictListApi = (params) => {
  return request.get({
    url: '/manage/dict/itemList',
    params
  });
};
