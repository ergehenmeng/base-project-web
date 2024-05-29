import request from "@/utils/request";

export const listPageApi = (params) => {
    return request.get({
        url: "/manage/version/listPage",
        params,
    });
};

export const createApi = (data) => {
    return request.post({
        url: "/manage/version/create",
        data
    });
}

export const updateApi = (data) => {
    return request.post({
        url: "/manage/version/update",
        data
    });
}

export const deleteApi = (data) => {
    return request.post({
        url: "/manage/version/delete",
        data
    });
}

export const stateApi = (data) => {
    return request.post({
        url: "/manage/version/updateState",
        data
    });
}