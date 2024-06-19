import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/travel/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/travel/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/travel/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/travel/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/travel/select',
    params
  });
};

export const shelvesApi = (data) => {
  return request.post({
    url: '/manage/travel/shelves',
    data
  });
};

export const unShelvesApi = (data) => {
  return request.post({
    url: '/manage/travel/unShelves',
    data
  });
};

export const platformUnShelvesApi = (data) => {
  return request.post({
    url: '/manage/travel/platformUnShelves',
    data
  });
};

export const listApi = () => {
  return request.get({
    url: '/manage/travel/list'
  });
};
