import request from '@/utils/request';

export const detailApi = () => {
  return request.get({
    url: '/manage/merchant/center/detail'
  });
};

export const generateApi = () => {
  return request.get({
    url: '/manage/merchant/center/generate'
  });
};

export const sendSmsApi = () => {
  return request.post({
    url: '/manage/merchant/center/sendSms'
  });
};

export const unbindApi = (data) => {
  return request.post({
    url: '/manage/merchant/center/unbind',
    data
  });
};