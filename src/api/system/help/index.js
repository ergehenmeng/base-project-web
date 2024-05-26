import request from "@/utils/request";

export const listPageApi = (params) => {
    return request.get({
        url: "/manage/help/listPage",
        params,
    });
};

export const createApi = (data) => {
    return request.post({
        url: "/manage/help/create",
        data

    });
}
export const updateApi = (data) => {
    return request.post({
        url: "/manage/help/update",
        data
    });
}

export const deleteApi = (data) => {
    return request.post({
        url: "/manage/help/delete",
        data
    });
}

export const sortApi = (data) => {
    return request.post({
        url: "/manage/help/sort",
        data
    });
}
