import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/poi/point/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/poi/point/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/poi/point/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/poi/point/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/poi/point/select',
    params
  });
};
