import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/poi/line/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/poi/line/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/poi/line/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/poi/line/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/poi/line/select',
    params
  });
};

export const shelvesApi = (data) => {
  return request.post({
    url: '/manage/poi/line/shelves',
    data
  });
};

export const unShelvesApi = (data) => {
  return request.post({
    url: '/manage/poi/line/unShelves',
    data
  });
};

export const bindDetailApi = (params) => {
  return request.get({
    url: '/manage/poi/line/bindDetail',
    params
  });
};

export const bindApi = (data) => {
  return request.post({
    url: '/manage/poi/line/bind',
    data
  });
};
