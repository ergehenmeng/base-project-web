import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/item/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/item/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/item/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/item/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/item/select',
    params
  });
};

export const shelvesApi = (data) => {
  return request.post({
    url: '/manage/item/shelves',
    data
  });
};

export const unShelvesApi = (data) => {
  return request.post({
    url: '/manage/item/unShelves',
    data
  });
};

export const platformUnShelvesApi = (data) => {
  return request.post({
    url: '/manage/item/platformUnShelves',
    data
  });
};

export const recommendApi = (data) => {
  return request.post({
    url: '/manage/item/recommend',
    data
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/item/export',
    params
  });
};