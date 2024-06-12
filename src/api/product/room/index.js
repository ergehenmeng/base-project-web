import request from "@/utils/request";

export const listPageApi = (params) => {
    return request.get({
        url: "/manage/homestay/room/listPage",
        params,
    });
};

export const createApi = (data) => {
    return request.post({
        url: "/manage/homestay/room/create",
        data
    });
}

export const updateApi = (data) => {
    return request.post({
        url: "/manage/homestay/room/update",
        data
    });
}

export const deleteApi = (data) => {
    return request.post({
        url: "/manage/homestay/room/delete",
        data
    });
}

export const selectApi = (params) => {
    return request.get({
        url: "/manage/homestay/room/select",
        params
    });
}

export const shelvesApi = (data) => {
    return request.post({
        url: "/manage/homestay/room/shelves",
        data
    });
}

export const unShelvesApi = (data) => {
    return request.post({
        url: "/manage/homestay/room/unShelves",
        data
    });
}

export const platformUnShelvesApi = (data) => {
    return request.post({
        url: "/manage/homestay/room/platformUnShelves",
        data
    });
}

export const monthApi = (params) => {
    return request.get({
        url: "/manage/homestay/room/config/month",
        params
    });
}

export const setupApi = (data) => {
    return request.post({
        url: "/manage/homestay/room/config/setup",
        data
    });
}

export const setDayApi = (data) => {
    return request.post({
        url: "/manage/homestay/room/config/update",
        data
    });
}

export const recommendApi = (data) => {
    return request.post({
        url: "/manage/homestay/room/recommend",
        data
    });
}