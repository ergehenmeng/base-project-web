import request from '@/utils/request';

// 登录接口
export const loginApi = (data) => {
  return request.post({
    url: '/manage/login',
    data: data
  });
};

export const bindTotpApi = (data) => {
  return request.post({
    url: '/manage/bindTotp',
    data: data
  });
};

export const checkTotpApi = (data) => {
  return request.post({
    url: '/manage/checkTotp',
    data: data
  });
};

export const logoutApi = () => {
  return request.post({
    url: '/manage/logout'
  });
};
