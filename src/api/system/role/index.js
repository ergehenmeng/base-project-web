import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/role/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/role/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/role/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/role/delete',
    data
  });
};

export const authApi = (data) => {
  return request.post({
    url: '/manage/role/auth',
    data
  });
};

/**
 * 获取角色拥有的菜单列表
 * @returns 角色拥有的菜单列表
 */
export const roleMenuApi = (params) => {
  return request.get({
    url: '/manage/role/menu',
    params
  });
};

/**
 * 获取全部系统参数
 * @returns 全部的系统菜单
 */
export const systemMenuApi = (params) => {
  return request.get({
    url: '/manage/menu/systemList',
    params
  });
};

