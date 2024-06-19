import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/merchant/role/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/merchant/role/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/merchant/role/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/merchant/role/delete',
    data
  });
};

export const authApi = (data) => {
  return request.post({
    url: '/manage/merchant/role/auth',
    data
  });
};

/**
 * 获取角色拥有的菜单列表
 * @returns 角色拥有的菜单列表
 */
export const roleMenuApi = (params) => {
  return request.get({
    url: '/manage/merchant/role/menu',
    params
  });
};

/**
 * 获取商户菜单列表
 * @returns 全部的商家菜单
 */
export const merchantMenuApi = () => {
  return request.get({
    url: '/manage/menu/merchantList'
  });
};
