import request from '@/utils/request.js';

export const lockScreenApi = (data) => {
  return request.post({
    url: '/manage/user/lockScreen',
    data
  });
};

export const unlockScreenApi = (data) => {
  return request.post({
    url: '/manage/user/unlockScreen',
    data
  });
};