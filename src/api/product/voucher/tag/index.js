import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/voucher/tag/listPage',
    params
  });
};


export const createApi = (data) => {
  return request.post({
    url: '/manage/voucher/tag/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/voucher/tag/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/voucher/tag/delete',
    data
  });
};

export const sortApi = (data) => {
  return request.post({
    url: '/manage/voucher/tag/sort',
    data
  });
};