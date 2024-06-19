import request from '@/utils/request';

export const listApi = () => {
  return request.get({
    url: '/manage/express/template/list'
  });
};

export const selectListApi = () => {
  return request.get({
    url: '/manage/express/template/selectList'
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/express/template/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/express/template/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/express/template/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/express/template/select',
    params
  });
};
