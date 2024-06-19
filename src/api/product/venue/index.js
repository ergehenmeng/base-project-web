import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/venue/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/venue/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/venue/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/venue/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/venue/select',
    params
  });
};

export const shelvesApi = (data) => {
  return request.post({
    url: '/manage/venue/shelves',
    data
  });
};

export const unShelvesApi = (data) => {
  return request.post({
    url: '/manage/venue/unShelves',
    data
  });
};

export const platformUnShelvesApi = (data) => {
  return request.post({
    url: '/manage/venue/platformUnShelves',
    data
  });
};

export const listApi = () => {
  return request.get({
    url: '/manage/venue/list'
  });
};
