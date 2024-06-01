import request from "@/utils/request";

export const listPageApi = (params) => {
    return request.get({
        url: "/manage/news/listPage",
        params,
    });
};

export const createApi = (data) => {
    return request.post({
        url: "/manage/news/create",
        data
    });
}

export const updateApi = (data) => {
    return request.post({
        url: "/manage/news/update",
        data
    });
}

export const deleteApi = (data) => {
    return request.post({
        url: "/manage/news/delete",
        data
    });
}

export const listApi = (params) => {
    return request.get({
        url: "/manage/news/list",
        params
    });
}

export const sortApi = (data) => {
    return request.post({
        url: "/manage/news/sort",
        data
    });
}

export const cancelApi = (data) => {
    return request.post({
        url: "/manage/notice/cancel",
        data
    });
}