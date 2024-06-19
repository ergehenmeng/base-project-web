import request from '@/utils/request';

export const listMenuApi = (params) => {
  return request.get({
    url: '/manage/menu/list',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/menu/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/menu/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/menu/delete',
    data
  });
};

export const sortApi = (data) => {
  return request.post({
    url: '/manage/menu/sort',
    data
  });
};

export const stateApi = (data) => {
  return request.post({
    url: '/manage/menu/updateState',
    data
  });
};
