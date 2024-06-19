import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/scenic/ticket/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/scenic/ticket/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/scenic/ticket/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/scenic/ticket/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/scenic/ticket/select',
    params
  });
};

export const shelvesApi = (data) => {
  return request.post({
    url: '/manage/scenic/ticket/shelves',
    data
  });
};

export const unShelvesApi = (data) => {
  return request.post({
    url: '/manage/scenic/ticket/unShelves',
    data
  });
};

export const platformUnShelvesApi = (data) => {
  return request.post({
    url: '/manage/scenic/ticket/platformUnShelves',
    data
  });
};
