import request from "@/utils/request";

export const listPageApi = (params) => {
    return request.get({
        url: "/manage/news/config/listPage",
        params,
    });
};

export const createApi = (data) => {
    return request.post({
        url: "/manage/news/config/create",
        data
    });
}

export const updateApi = (data) => {
    return request.post({
        url: "/manage/news/config/update",
        data
    });
}

export const deleteApi = (data) => {
    return request.post({
        url: "/manage/news/config/delete",
        data
    });
}

