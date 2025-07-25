import axios from 'axios';
import useUserStore from '@/store/user';
import useHistoryStore from '@/store/history.js';
import qs from 'qs';
import { errorMsg } from '@/utils/message';

const sourceMap = new Map();

/**
 * 特殊错误回调函数注册
 */
const errorCallback = {
  8848: ({ msg }, _response) => {
    cancelRequest();
    errorMsg(msg);
    const userStore = useUserStore();
    const historyStore = useHistoryStore();
    userStore.logout(historyStore.getNowPage());
  },
  1024: () => {
    // 锁屏中
  }
};

/**
 * 取消所有后续请求
 */
const cancelRequest = () => {
  sourceMap.forEach((item) => {
    item.abort();
  });
};

// 创建axios实例
const service = axios.create({
  // 基础路径前缀
  baseURL: import.meta.env.VITE_API_PREFIX,
  // 请求超时时间：30s
  timeout: 30000
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 保存请求信息, 方便后续进行取消操作
    const controller = new AbortController();
    config.signal = controller.signal;
    sourceMap.set(config.url, controller);
    const userStore = useUserStore();
    config.headers['token'] = userStore.user?.token;
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    sourceMap.delete(response.config.url);
    if (response.config.responseType === 'blob') {
      return response;
    }
    const res = response.data;
    const { code, msg } = res;
    if (code === 200) {
      return res;
    } else {
      errorHandle(res, response);
      return Promise.reject(new Error(msg || 'Error'));
    }
  },
  (error) => {
    if (!axios.isCancel(error)) {
      // 减少服务端服务异常导致错误提示过多的问题
      if (error.status === 500) {
        cancelRequest();
      }
      ElMessage.error('接口请求超时，请重试');
    }
    return Promise.reject(new Error(error));
  }
);

/**
 * get
 * @param url url
 * @param params 请求参数
 * @param code 特殊业务码
 * @param callback 业务码回调函数
 * @param config 其他配置参数 axios
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
const get = ({ url, params, code, callback, ...config }) => {
  if (code && callback) {
    errorCallback[code] = callback;
  }
  return service({
    url: url,
    method: 'get',
    params: params,
    ...config,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  });
};

/**
 * post请求
 * @param url url
 * @param data json
 * @param code 特殊业务码
 * @param callback 业务码回调函数
 * @param config 其他配置参数 axios
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
const post = ({ url, data, code, callback, ...config }) => {
  if (code && callback) {
    errorCallback[code] = callback;
  }
  return service({
    url: url,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    },
    ...config
  });
};

const upload = ({ url, data, ..._config }) => {
  return service({
    url: url,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const download = ({ url, params, ...config }) => {
  return service({
    url: url,
    method: 'get',
    params: params,
    responseType: 'blob',
    ...config
  });
};

/**
 * 业务移除处理
 * 注意: 优先执行特殊错误回调(可在errorCallback定义), 如果没有则弹出错误信息
 * @param {*} data 管理后台返回的数据
 * @param {*} response response信息
 */
const errorHandle = (data, response) => {
  const callbackFunc = errorCallback[data.code];
  if (callbackFunc) {
    callbackFunc(data, response);
  } else {
    errorMsg(data.msg);
  }
};

// 导出实例
export default {
  get,
  post,
  upload,
  download,
  service
};
