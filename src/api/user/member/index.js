import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/member/listPage',
    params
  });
};

export const freezeApi = (data) => {
  return request.post({
    url: '/manage/member/freeze',
    data
  });
};

export const unfreezeApi = (data) => {
  return request.post({
    url: '/manage/member/unfreeze',
    data
  });
};

export const offlineApi = (data) => {
  return request.post({
    url: '/manage/member/offline',
    data
  });
};

export const exportApi = (params) => {
  return request.download({
    url: '/manage/member/export',
    params
  });
};

export const loginPageApi = (params) => {
  return request.get({
    url: '/manage/member/loginPage',
    params
  });
};

export const sendMessageApi = (data) => {
  return request.post({
    url: '/manage/member/sendMessage',
    data
  });
};

export const sendSmsApi = (data) => {
  return request.post({
    url: '/manage/member/sendSms',
    data
  });
};

export const updateScoreApi = (data) => {
  return request.post({
    url: '/manage/member/updateScore',
    data
  });
};

export const scoreLogPageApi = (params) => {
  return request.get({
    url: '/manage/member/score/listPage',
    params
  });
};