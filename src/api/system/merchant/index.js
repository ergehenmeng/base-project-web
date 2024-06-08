import request from "@/utils/request";

export const listApi = () => {
    return request.get({
        url: "/manage/merchant/list"
    });
};