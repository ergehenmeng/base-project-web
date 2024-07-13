import dayjs from 'dayjs';

export const phoneValidator = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('电话号码不能为空'));
  }
  if (!checkMobile(value) && !checkTel(value)) {
    callback(new Error('电话号码格式错误'));
  } else {
    callback();
  }
};

export const checkMobile = (value) => {
  return /^(?:0|86|\+86)?1[3-9]\d{9}$/.test(value);
};

export const checkTel = (value) => {
  return /^(010|02\d|0[3-9]\d{2})-?(\d{6,8})$/.test(value);
};

export const orderStateFormat = (state) => {
  switch (state) {
    case 0:
      return '待支付';
    case 1:
      return '支付中';
    case 2:
      return '待使用';
    case 3:
      return '待自提';
    case 4:
      return '待发货';
    case 5:
      return '部分发货';
    case 6:
      return '待收货';
    case 7:
      return '退款中';
    case 8:
      return '订单完成';
    case 9:
      return '已关闭';
    case 10:
      return '支付异常';
    case 11:
      return '退款异常';
    default:
      return '';
  }
};

export const closeTypeFormat = (cellValue) => {
  if (cellValue === 1) {
    return '订单自动过期';
  }
  return cellValue === 2 ? '用户取消' : '退款成功';
};

export const payTypeFormat = (cellValue) => {
  switch (cellValue) {
    case 'WECHAT_APP':
      return '微信APP';
    case 'WECHAT_JSAPI':
      return '微信小程序';
    case 'WECHAT_MINI':
      return '微信小程序';
    case 'WECHAT_NATIVE':
      return '微信扫码';
    case 'WECHAT_H5':
      return '微信H5';
    case 'ALI_PAY':
      return '支付宝';
    case 'ZERO':
      return '零元付';
    default:
      return '';
  }
};

/**
 * 只能输入整数或包含两位的小数
 *
 * @param value
 * @param point 小数点位数(1或2)
 */
export const numberValidator = (value, point = 2) => {
  if (value) {
    value = value.replace(/[^0-9.]/g, '') // 移除非数字和小数点
        .replace(/(\..*)\./g, '$1')
        .replace(/(\..{2}).*/g, '$1');
    value = value === '.' ? '' : value;
    // 移除前导零，但保留小数点前至少一个数字
    value = value.replace(/^0+(?=\d)/, '');
    // 特殊处理：确保小数点前至少有一个数字
    if (value.startsWith('.')) {
      value = '0' + value;
    }
  }
  return value;
};

export const parseMerchantType = (cellValue) => {
  const typeList = [];
  if ((cellValue & 1) === 1) {
    typeList.push("景区");
  }
  if ((cellValue & 2) === 2) {
    typeList.push("民宿");
  }
  if ((cellValue & 4) === 4) {
    typeList.push("餐饮");
  }
  if ((cellValue & 8) === 8) {
    typeList.push("零售");
  }
  if ((cellValue & 16) === 16) {
    typeList.push("线路");
  }
  if ((cellValue & 32) === 32) {
    typeList.push("场馆");
  }
  return typeList.join(',');
};

export const parseProductType = (value) => {
  switch (value) {
    case 'ticket':
      return '门票';
    case 'item':
      return '零售';
    case 'voucher':
      return '餐饮券';
    case "venue":
      return '场地';
    case "line":
      return '线路';
    case "homestay":
      return '房型';
  }
};

/**
 * 返回上一页,如果上一页是登录页则跳转到首页
 */
export const goBack = (router) => {
  if (router.options.history.state.back && !router.options.history.state.back.startsWith("/login")) {
    router.go(-1)
  } else {
    router.push('/home');
  }
}

/**
 * 禁用小于当前时间的日期
 * @param time date
 * @returns {boolean}
 */
export const disableBeforeDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7;
};

/**
 * 下载excel
 * @param response response 响应信息
 * @param fileName 文件名
 */
export const downloadExcel = (response, fileName) => {
  const url = window.URL.createObjectURL(new Blob([response.data], { type: '.xlsx' }));
  const link = document.createElement('a');
  link.href = url;
  const time = dayjs().format('YYYY-MM-DD HH_mm_ss');
  link.style.display = 'none';
  if (fileName) {
    link.download = fileName + time + '.xlsx';
  } else {
    link.download = time + '.xlsx';
  }
  link.click();
  URL.revokeObjectURL(link.href);
};
