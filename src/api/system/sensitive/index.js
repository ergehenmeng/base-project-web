import request from "@/utils/request";

export const listPageApi = (params) => {
  return request.get({
    url: "/manage/sensitive/word/listPage",
    params,
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: "/manage/sensitive/word/delete",
    data
  });
}

export const createApi = (data) => {
  return request.post({
    url: "/manage/sensitive/word/create",
    data
  });
}
