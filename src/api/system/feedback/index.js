import request from "@/utils/request";

export const listPageApi = (params) => {
    return request.get({
        url: "/manage/feedback/listPage",
        params,
    });
};

export const disposeApi = (data) => {
    return request.post({
        url: "/manage/feedback/dispose",
        data
    });
}
