import request from "@/utils/request";

export const listPageApi = (params) => {
    return request.get({
        url: "/manage/item/store/listPage",
        params,
    });
};

export const createApi = (data) => {
    return request.post({
        url: "/manage/item/store/create",
        data
    });
}

export const updateApi = (data) => {
    return request.post({
        url: "/manage/item/store/update",
        data
    });
}

export const deleteApi = (data) => {
    return request.post({
        url: "/manage/item/store/delete",
        data
    });
}

export const selectApi = (params) => {
    return request.get({
        url: "/manage/item/store/select",
        params
    });
}

export const shelvesApi = (data) => {
    return request.post({
        url: "/manage/item/store/shelves",
        data
    });
}

export const unShelvesApi = (data) => {
    return request.post({
        url: "/manage/item/store/unShelves",
        data
    });
}

export const platformUnShelvesApi = (data) => {
    return request.post({
        url: "/manage/item/store/platformUnShelves",
        data
    });
}