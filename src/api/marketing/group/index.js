import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/group/booking/listPage',
    params
  });
};

export const itemListApi = (params) => {
  return request.get({
    url: '/manage/item/activityList',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/group/booking/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/group/booking/update',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/group/booking/detail',
    params
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/group/booking/delete',
    data
  });
};

export const unShelvesApi = (data) => {
  return request.post({
    url: '/manage/group/booking/unShelves',
    data
  });
};