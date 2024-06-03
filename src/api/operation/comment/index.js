import request from "@/utils/request";

export const listPageApi = (params) => {
    return request.get({
        url: "/manage/comment/listPage",
        params,
    });
};

export const reportPageApi = (params) => {
    return request.get({
        url: "/manage/comment/report/listPage",
        params,
    });
};

export const shieldApi = (data) => {
    return request.post({
        url: "/manage/comment/shield",
        data
    });
}

export const topApi = (data) => {
    return request.post({
        url: "/manage/comment/update",
        data
    });
}

export const unTopApi = (data) => {
    return request.post({
        url: "/manage/comment/unTop",
        data
    });
}

