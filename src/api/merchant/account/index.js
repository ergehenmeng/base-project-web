import request from '@/utils/request';

export const accountApi = () => {
    return request.get({
        url: '/manage/merchant/account'
    });
};