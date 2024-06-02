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

export const configListApi = (params) => {
    return request.get({
        url: "/manage/news/config/list",
        params
    });
}

export const configApi = (params) => {
    return request.get({
        url: "/manage/news/config/select",
        params
    });
}

export const selectApi = (params) => {
    return request.get({
        url: "/manage/news/select",
        params
    });
}

export const sortApi = (data) => {
    return request.post({
        url: "/manage/news/sort",
        data
    });
}
