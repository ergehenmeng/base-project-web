import request from '@/utils/request';

export const accountApi = () => {
    return request.get({
        url: '/manage/merchant/score/account'
    });
};

export const balanceDetailApi = () => {
    return request.get({
        url: '/manage/merchant/score/recharge/detail'
    });
};

export const balanceRechargeApi = (data) => {
    return request.post({
        url: '/manage/merchant/score/recharge/balance',
        data
    });
};

export const scanRechargeApi = (data) => {
    return request.post({
        url: '/manage/merchant/score/recharge/scan',
        data
    });
};

export const withdrawApplyApi = (data) => {
    return request.post({
        url: '/manage/merchant/score/withdraw/apply',
        data
    });
};