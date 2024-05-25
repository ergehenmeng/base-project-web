import axios from "axios";
import useUserStore from "@/store/user";
import qs from "qs";
import { errorMsg } from "@/utils/message";

const sourceMap = new Map();

/**
 * 特殊错误回调函数注册
 */
const errorCallback = {
  8848: (data, response) => {
    cancelRequest();
    errorMsg(data.msg, () => {
      const userStore = useUserStore();
      userStore.logout(response.config.url);
    })
  },
};

const cancelRequest = () => {
  sourceMap.forEach(item => {
    item.abort();
  });
};

// 创建axios实例
const service = axios.create({
  // 基础路径前缀
  baseURL: import.meta.env.VITE_API_URL,
  // 请求超时时间：30s
  timeout: 30000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 保存请求信息, 方便后续进行取消操作
    const controller = new AbortController();
    config.signal = controller.signal;
    sourceMap.set(config.url, controller);
    const userStore = useUserStore();
    config.headers["token"] = userStore.user.token;
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
    const res = response.data;
    const { code, msg } = res;
    if (code === 200) {
      return res;
    } else {
      errorHandle(res, response);
      return Promise.reject(new Error(msg || "Error"));
    }
  },
  (error) => {
    if (!axios.isCancel(error)) {
      ElMessage.error("接口请求超时，请重试");
    }
    return Promise.reject(new Error(error));
  }
);

const get = ({ url, params, ...config }) => {
  return service({
    url: url,
    method: "get",
    params: params,
    ...config,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
  });
};

const post = ({ url, data, ...config }) => {
  return service({
    url: url,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });
};

const upload = ({ url, data, ...config }) => {
  return service({
    url: url,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const download = ({ url, params, ...config }) => {
  return service({
    url: url,
    method: "get",
    params: params,
    responseType: "blob",
    ...config,
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
}

// 导出实例
export default {
  get,
  post,
  upload,
  download,
  service,
};
