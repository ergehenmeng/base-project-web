import request from "@/utils/request";

export default {
  login(data) {
    return request.post({
      url: "/manage/login",
      data,
    });
  },
};
