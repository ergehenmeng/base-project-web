import request from '@/utils/request';

export const syncPageApi = (params) => {
  return request.get({
    url: '/manage/pay/log/sync/listPage',
    params
  });
};

export const asyncPageApi = (params) => {
  return request.get({
    url: '/manage/pay/log/async/listPage',
    params
  });
};

export const playbackApi = (data) => {
  return request.post({
    url: '/manage/pay/log/async/playback',
    data
  });
};
