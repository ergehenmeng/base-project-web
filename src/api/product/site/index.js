import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/venue/site/listPage',
    params
  });
};

export const sitePageApi = (params) => {
  return request.get({
    url: '/manage/venue/site/productListPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/venue/site/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/venue/site/update',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/venue/site/delete',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/venue/site/select',
    params
  });
};

export const shelvesApi = (data) => {
  return request.post({
    url: '/manage/venue/site/shelves',
    data
  });
};

export const unShelvesApi = (data) => {
  return request.post({
    url: '/manage/venue/site/unShelves',
    data
  });
};

export const platformUnShelvesApi = (data) => {
  return request.post({
    url: '/manage/venue/site/platformUnShelves',
    data
  });
};

export const sortApi = (data) => {
  return request.post({
    url: '/manage/venue/site/sort',
    data
  });
};

export const priceListApi = (params) => {
  return request.get({
    url: '/manage/venue/site/priceList',
    params
  });
};

export const setupApi = (data) => {
  return request.post({
    url: '/manage/venue/site/price/setup',
    data
  });
};

export const updatePriceApi = (data) => {
  return request.post({
    url: '/manage/venue/site/price/update',
    data
  });
};

export const deletePriceApi = (data) => {
  return request.post({
    url: '/manage/venue/site/price/delete',
    data
  });
};
