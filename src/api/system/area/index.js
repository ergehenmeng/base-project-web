import request from '@/utils/request';

export const listApi = () => {
  return request.get({
    url: '/manage/area/list'
  });
};

export const provinceApi = () => {
  return request.get({
    url: '/manage/area/provinceList'
  });
};
