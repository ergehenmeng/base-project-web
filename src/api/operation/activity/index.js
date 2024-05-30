import request from "@/utils/request";

export const listApi = (params) => {
    return request.get({
        url: "/manage/activity/month",
        params,
    });
};

export const configApi = (data) => {
    return request.post({
        url: "/manage/activity/config",
        data
    });
}

export const createApi = (data) => {
    return request.post({
        url: "/manage/activity/create",
        data
    });
}

export const updateApi = (data) => {
    return request.post({
        url: "/manage/activity/update",
        data
    });
}

export const deleteApi = (data) => {
    return request.post({
        url: "/manage/activity/delete",
        data
    });
}

export const selectApi = (params) => {
    return request.get({
        url: "/manage/activity/select",
        params
    });
}
