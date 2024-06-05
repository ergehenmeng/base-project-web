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