import request from '@/utils/request';

// 登录接口
export const loginApi = (data) => {
  return request.post({
    url: '/manage/login',
    data
  });
};

export const bindTotpApi = (data, code, callback) => {
  return request.post({
    url: '/manage/bindTotp',
    data,
    code,
    callback
  });
};

export const checkTotpApi = (data, code, callback) => {
  return request.post({
    url: '/manage/checkTotp',
    data,
    code,
    callback
  });
};

export const logoutApi = () => {
  return request.post({
    url: '/manage/logout'
  });
};

export const sendSmsApi = (data) => {
  return request.post({
    url: '/manage/sendSms',
    data
  });
};

export const smsLoginApi = (data) => {
  return request.post({
    url: '/manage/smsLogin',
    data
  });
};

export const permApi = (data) => {
  return request.get({
    url: '/manage/permission',
    data
  });
};