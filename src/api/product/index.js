import request from '@/utils/request';

export const storeApi = () => {
  return request.get({
    url: '/manage/store/storeList'
  });
};
