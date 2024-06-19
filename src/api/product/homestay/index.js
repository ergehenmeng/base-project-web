import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/homestay/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/homestay/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/homestay/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/homestay/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/homestay/select',
    params
  });
};

export const shelvesApi = (data) => {
  return request.post({
    url: '/manage/homestay/shelves',
    data
  });
};

export const unShelvesApi = (data) => {
  return request.post({
    url: '/manage/homestay/unShelves',
    data
  });
};

export const platformUnShelvesApi = (data) => {
  return request.post({
    url: '/manage/homestay/platformUnShelves',
    data
  });
};

export const listApi = () => {
  return request.get({
    url: '/manage/homestay/list'
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/homestay/recommend',
    params
  });
};
