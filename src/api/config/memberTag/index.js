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

export const selectApi = (params) => {
    return request.get({
        url: '/manage/member/tag/select',
        params
    });
};

export const sendNoticeApi = (data) => {
    return request.post({
        url: '/manage/member/tag/sendNotice',
        data
    });
};

export const sendSmsApi = (data) => {
    return request.post({
        url: '/manage/member/tag/sendSms',
        data
    });
};

export const memberListApi = (params) => {
    return request.get({
        url: '/manage/member/tag/memberPage',
        params
    });
};

