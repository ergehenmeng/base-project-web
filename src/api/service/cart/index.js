import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/shopping/cart/listPage',
    params
  });
};

