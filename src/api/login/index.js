import request from "@/utils/request";

// 登录接口
export const loginApi = (data) => {
  return request.post({
    url: "/manage/login",
    data: data,
  });
};

export const logoutApi = () => {
  return request.post({
    url: "/manage/logout",
  });
}
