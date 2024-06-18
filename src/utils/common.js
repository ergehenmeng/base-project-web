import request from "@/utils/request";
import {errorMsg} from "@/utils/message.js";
import dayjs from "dayjs";

export const phoneValidator = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("电话号码不能为空"));
    }
    if (!checkMobile(value) && !checkTel(value)) {
        callback(new Error('电话号码格式错误'));
    } else {
        callback()
    }
}

export const checkMobile = (value) => {
    return /^(?:0|86|\+86)?1[3-9]\d{9}$/.test(value)
}

export const checkTel = (value) => {
    return /^(010|02\d|0[3-9]\d{2})-?(\d{6,8})$/.test(value)
}

export const orderStateFormat = (state) => {
    switch (state) {
        case 0:
            return "待支付";
        case 1:
            return "支付中";
        case 2:
            return "待使用";
        case 3:
            return "待自提";
        case 4:
            return "待发货";
        case 5:
            return "部分发货";
        case 6:
            return "待收货";
        case 7:
            return "退款中";
        case 8:
            return "订单完成";
        case 9:
            return "已关闭";
        case 10:
            return "支付异常";
        case 11:
            return "退款异常";
        default:
            return "";
    }
}

export const closeTypeFormat = (cellValue) => {
    if (cellValue === 1) {
        return "订单自动过期";
    }
    return cellValue === 2 ? "用户取消" : "退款成功";
}

export const payTypeFormat = (cellValue) => {
    switch (cellValue) {
        case "WECHAT_APP":
            return "微信APP";
        case "WECHAT_JSAPI":
            return "微信小程序";
        case "WECHAT_MINI":
            return "微信小程序";
        case "WECHAT_NATIVE":
            return "微信扫码";
        case "WECHAT_H5":
            return "微信H5";
        case "ALI_PAY":
            return "支付宝";
        case "ZERO":
            return "零元付";
        default:
            return "";
    }
}

/**
 * 只能输入整数或包含两位的小数
 *
 * @param value
 */
export const numberValidator = (value) => {
    if (value) {
        // 允许数字和小数点
        value = value.replace(/[^\d.]/g, '');
        // 只保留第一个小数点
        value = value.replace(/\.{2,}/g, '.');
        // 防止连续输入小数点
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        // 只允许小数点后两位
        return value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    }
    return value;
}

/**
 * 禁用小于当前时间的日期
 * @param time date
 * @returns {boolean}
 */
export const disableBeforeDate = (time) => {
    return time.getTime() < Date.now() - 8.64e7;
}

/**
 * 下载excel
 * @param response response 响应信息
 * @param fileName 文件名
 */
export const downloadExcel = (response, fileName) => {
    const url = window.URL.createObjectURL(new Blob([response.data], { type: '.xlsx' }));
    const link = document.createElement('a');
    link.href = url;
    const time = dayjs().format("YYYY-MM-DD HH_mm_ss");
    link.style.display = 'none';
    if (fileName) {
        link.download = fileName + time + ".xlsx";
    } else {
        link.download = time + ".xlsx";
    }
    link.click();
    URL.revokeObjectURL(link.href)
}