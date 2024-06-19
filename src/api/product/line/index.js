import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/line/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/line/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/line/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/line/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/line/select',
    params
  });
};

export const shelvesApi = (data) => {
  return request.post({
    url: '/manage/line/shelves',
    data
  });
};

export const unShelvesApi = (data) => {
  return request.post({
    url: '/manage/line/unShelves',
    data
  });
};

export const platformUnShelvesApi = (data) => {
  return request.post({
    url: '/manage/line/platformUnShelves',
    data
  });
};

export const monthApi = (params) => {
  return request.get({
    url: '/manage/line/config/month',
    params
  });
};

export const setupApi = (data) => {
  return request.post({
    url: '/manage/line/config/setup',
    data
  });
};

export const setDayApi = (data) => {
  return request.post({
    url: '/manage/line/config/setDay',
    data
  });
};
