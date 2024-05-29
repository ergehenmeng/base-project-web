import request from "@/utils/request";

export const listPageApi = (params) => {
    return request.get({
        url: "/manage/notice/listPage",
        params,
    });
};

export const createApi = (data) => {
    return request.post({
        url: "/manage/notice/create",
        data
    });
}

export const updateApi = (data) => {
    return request.post({
        url: "/manage/notice/update",
        data
    });
}

export const deleteApi = (data) => {
    return request.post({
        url: "/manage/notice/delete",
        data
    });
}

export const selectApi = (params) => {
    return request.get({
        url: "/manage/notice/select",
        params
    });
}

export const publishApi = (data) => {
    return request.post({
        url: "/manage/notice/publish",
        data
    });
}

export const cancelApi = (data) => {
    return request.post({
        url: "/manage/notice/cancel",
        data
    });
}