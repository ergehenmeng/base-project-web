import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/poi/area/listPage',
    params
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/poi/area/select',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/poi/area/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/poi/area/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/poi/area/delete',
    data
  });
};

export const stateApi = (data) => {
  return request.post({
    url: '/manage/poi/area/updateState',
    data
  });
};

export const listApi = () => {
  return request.get({
    url: '/manage/poi/area/list'
  });
};


