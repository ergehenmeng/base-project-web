import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/member/tag/listPage',
    params
  });
};

export const createApi = (data) => {
    return request.post({
        url: '/manage/member/tag/create',
        data
    });
};

export const updateApi = (data) => {
    return request.post({
        url: '/manage/member/tag/update',
        data
    });
};

export const deleteApi = (data) => {
    return request.post({
        url: '/manage/member/tag/delete',
        data
    });
};

export const refreshApi = (data) => {
    return request.post({
        url: '/manage/member/tag/refresh',
        data
    });
};

export const memberListApi = (params) => {
    return request.get({
        url: '/manage/member/tag/memberPage',
        params
    });
};

