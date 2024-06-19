import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/black/roster/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/black/roster/create',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/black/roster/delete',
    data
  });
};

export const reloadApi = () => {
  return request.get({
    url: '/manage/black/roster/reload'
  });
};
