import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/restaurant/listPage',
    params
  });
};

export const listApi = () => {
  return request.get({
    url: '/manage/restaurant/list'
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/restaurant/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/restaurant/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/restaurant/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/restaurant/select',
    params
  });
};

export const shelvesApi = (data) => {
  return request.post({
    url: '/manage/restaurant/shelves',
    data
  });
};

export const unShelvesApi = (data) => {
  return request.post({
    url: '/manage/restaurant/unShelves',
    data
  });
};

export const platformUnShelvesApi = (data) => {
  return request.post({
    url: '/manage/restaurant/platformUnShelves',
    data
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/restaurant/export',
    params
  });
};