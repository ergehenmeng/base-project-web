import request from '@/utils/request';

export const shortUrlApi = (data) => {
  return request.post({
    url: '/manage/wechat/shortUrl',
    data
  });
};

export const linkUrlApi = (data) => {
  return request.post({
    url: '/manage/wechat/linkUrl',
    data
  });
};

export const qrcodeApi = (data) => {
  return request.post({
    url: '/manage/wechat/qrcode',
    data
  });
};