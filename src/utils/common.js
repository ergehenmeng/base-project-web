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