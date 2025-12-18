import dayjs from 'dayjs';
import JSEncrypt from 'jsencrypt'

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

/**
 * rsa加密
 * @param value 待加密的字符串
 * @returns string | false
 */
export const rsaEncode = (value) => {
  const encrypt = new JSEncrypt()
  const publicKey = import.meta.env.VITE_PUBLIC_KEY;
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(value);
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
      return h('span', { style: { color: '#ffa502' } }, '待使用');
    case 3:
      return h('span', { style: { color: '#ffa502' } }, '待自提');
    case 4:
      return h('span', { style: { color: '#ffa502' } }, '待发货');
    case 5:
      return h('span', { style: { color: '#00b894' } }, '待收货');
    case 6:
      return h('span', { style: { color: '#6ab04c' } }, '待成团');
    case 7:
      return h('span', { style: { color: '#00a8ff' } }, '订单完成');
    case 8:
      return '已关闭';
    default:
      return '';
  }
};

export const orderStateFormatNotStyle = (state) => {
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
      return '待收货';
    case 6:
      return '待成团';
    case 7:
      return '订单完成';
    case 8:
      return '已关闭';
    default:
      return '';
  }
};

export const refundStateFormat = (state) => {
  switch (state) {
    case 0:
      return '无退款';
    case 1:
      return '退款申请中';
    case 2:
      return '退款中';
    case 3:
      return '退款拒绝';
    case 4:
      return '退款成功';
    case 5:
      return '退款失败';
    case 6:
      return '线下退款成功';
    default:
      return '';
  }
};

export const durationFormat = (value) => {
  switch (value) {
    case 1:
      return '一日游';
    case 2:
      return '二日游';
    case 3:
      return '三日游';
    case 4:
      return '四日游';
    case 5:
      return '五日游';
    case 6:
      return '六日游';
    case 7:
      return '七日游';
    case 8:
      return '八日游';
    case 9:
      return '九日游';
    case 10:
      return '十日游';
    case 11:
      return '十一日游';
    case 12:
      return '十二日游';
    case 13:
      return '十三日游';
    case 14:
      return '十四日游';
    case 15:
      return '十五日游';
  }
};

export const venueTypeFormat = (value) => {
  switch (value) {
    case 1:
      return '篮球馆';
    case 2:
      return '网球馆';
    case 3:
      return '羽毛球馆';
    case 4:
      return '乒乓球馆';
    case 5:
      return '游泳馆';
    case 6:
      return '健身馆';
    case 7:
      return '瑜伽馆';
    case 8:
      return '保龄馆';
    case 9:
      return '足球馆';
    case 10:
      return '排球馆';
    case 11:
      return '田径馆';
    case 12:
      return '综合馆';
    case 13:
      return '跆拳道馆';
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

export const formatExpressType = (value) => {
  switch (value) {
    case 'yuantong':
      return '圆通速递';
    case 'shentong':
      return '申通快递';
    case 'jtexpress':
      return '极兔速递';
    case 'zhongtong':
      return '中通快递';
    case 'yunda':
      return '韵达快递';
    case 'youzhengguonei':
      return '邮政快递';
    case 'shunfeng':
      return '顺丰速运';
    case 'jd':
      return '京东物流';
    case 'ems':
      return 'EMS';
    case 'debangkuaidi':
      return '德邦快递';
    case 'huitongkuaidi':
      return '百世快递';
    case 'other':
      return '其他';
  }
};

/**
 * 只能输入整数或包含两位的小数
 *
 * @param value
 * @param decimalPlaces 小数点位数(1或2)
 */
export const numberValidator = (value, decimalPlaces = 2) => {
  if (value) {
    // 多余的字符，只保留数字和小数点
    value = value.replace(/[^\d.]/g, '');
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.replace(/^0+/, '0');
      // 禁止001这类输入
      value = value.replace(/^0([1-9])/, '$1');
    }
    const [integerPart, decimalPart] = value.split('.');
    if (decimalPart) {
      // 动态截断超长小数位（但保留未完成的输入）
      value = `${integerPart}.${decimalPart.slice(0, decimalPlaces)}`;
    } else if (!integerPart) {
      value = '';
    }
    // 第四步：应用最终校验
    const regPattern = decimalPlaces === 0 ? /^\d*$/ : new RegExp(`^\\d*\\.?\\d{0,${decimalPlaces}}$`);
    if (!regPattern.test(value)) {
      value = value.slice(0, -1);
    }
  }
  return value;
};

export const parseMerchantType = (cellValue) => {
  const typeList = [];
  if ((cellValue & 1) === 1) {
    typeList.push('景区');
  }
  if ((cellValue & 2) === 2) {
    typeList.push('民宿');
  }
  if ((cellValue & 4) === 4) {
    typeList.push('餐饮');
  }
  if ((cellValue & 8) === 8) {
    typeList.push('零售');
  }
  if ((cellValue & 16) === 16) {
    typeList.push('线路');
  }
  if ((cellValue & 32) === 32) {
    typeList.push('场馆');
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
      return '餐饮';
    case 'venue':
      return '场地';
    case 'line':
      return '线路';
    case 'homestay':
      return '房型';
  }
};

export const renderMsg = (msgList) => {
  const hMsg = [];
  msgList.forEach((item) => {
    if (typeof item === 'function') {
      hMsg.push(h('span', { style: 'color: #e6a23c; font-weight: bold' }, ' ' + item() + ' '));
    } else {
      hMsg.push(item);
    }
  });
  return h('span', null, hMsg);
};

/**
 * 返回上一页,如果上一页是登录页则跳转到首页
 */
export const goBack = (router) => {
  if (router.options.history.state.back && !router.options.history.state.back.startsWith('/login')) {
    router.go(-1);
  } else {
    router.push('/home');
  }
};

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
  const time = dayjs().format('YYYYMMDDHHmm');
  link.style.display = 'none';
  if (fileName) {
    link.download = fileName + time + '.xlsx';
  } else {
    link.download = time + '.xlsx';
  }
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * 下载图片
 * @param base64 base64图片 不含data:image/png;base64,
 * @param fileName 文件名 如果为空则使用当前时间作为文件名
 */
export const downloadImage = (base64, fileName) => {
  const bytes = atob(base64);
  const byteArray = new Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    byteArray[i] = bytes.charCodeAt(i);
  }
  const byteBuffer = new Uint8Array(byteArray);
  const url = window.URL.createObjectURL(new Blob([byteBuffer], { type: 'image/png' }));
  const link = document.createElement('a');
  link.href = url;
  const time = dayjs().format('YYYYMMDDHHmm');
  link.style.display = 'none';
  if (fileName) {
    link.download = fileName + '_' + time + '.png';
  } else {
    link.download = time + '.png';
  }
  link.click();
  URL.revokeObjectURL(url);
};

export const startCountDown = (time, callback) => {
  let count = time;
  callback(--count);
  const timer = setInterval(() => {
    if (count > 0) {
      callback(--count);
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

export function format(template, ...args) {
  // 处理命名参数
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return args[0][key] !== undefined ? args[0][key] : match;
    });
  }
  // 处理位置参数
  return template.replace(/{(\d+)}/g, (match, index) => {
    return args[index] !== undefined ? args[index] : match;
  });
}

export const upsert = (array, obj, key = 'id') => {
  const index = array.findIndex(item => item[key] === obj[key]);
  if (index !== -1) {
    array[index] = { ...array[index], ...obj };
  } else {
    array.push(obj);
  }
  return array;
}