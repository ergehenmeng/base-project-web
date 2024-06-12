import request from "@/utils/request";

export const listPageApi = (params) => {
    return request.get({
        url: "/manage/scenic/listPage",
        params,
    });
};

export const listApi = () => {
    return request.get({
        url: "/manage/scenic/list"
    });
};


export const createApi = (data) => {
    return request.post({
        url: "/manage/scenic/create",
        data
    });
}

export const updateApi = (data) => {
    return request.post({
        url: "/manage/scenic/update",
        data
    });
}

export const deleteApi = (data) => {
    return request.post({
        url: "/manage/scenic/delete",
        data
    });
}

export const selectApi = (params) => {
    return request.get({
        url: "/manage/scenic/select",
        params
    });
}

export const shelvesApi = (data) => {
    return request.post({
        url: "/manage/scenic/shelves",
        data
    });
}

export const unShelvesApi = (data) => {
    return request.post({
        url: "/manage/scenic/unShelves",
        data
    });
}

export const platformUnShelvesApi = (data) => {
    return request.post({
        url: "/manage/scenic/platformUnShelves",
        data
    });
}