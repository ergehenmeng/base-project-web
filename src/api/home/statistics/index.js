import request from '@/utils/request';

export const registerApi = (params) => {
  return request.get({
    url: '/manage/statistics/register',
    params
  });
};

export const dayRegisterApi = (params) => {
  return request.get({
    url: '/manage/statistics/dayRegister',
    params
  });
};

export const orderApi = (params) => {
  return request.get({
    url: '/manage/statistics/order',
    params
  });
};

export const dayOrderApi = (params) => {
  return request.get({
    url: '/manage/statistics/dayOrder',
    params
  });
};

export const dayAppendApi = (params) => {
  return request.get({
    url: '/manage/statistics/append',
    params
  });
};

export const dayCartApi = (params) => {
  return request.get({
    url: '/manage/statistics/cart',
    params
  });
};