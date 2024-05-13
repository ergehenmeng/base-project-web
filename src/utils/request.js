import axios from "axios";

// 创建axios实例
const service = axios.create({
  timeout: 30000, // 请求超时时间：30s
  headers: {},
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    const { code, msg, data } = res;
    if (code === 200) {
      return data;
    } else {
      return Promise.reject(new Error(msg || "Error"));
    }
  },
  (error) => {
    return Promise.reject(new Error(msg || "Error"));
  }
);

const get = (url, params, ...config) => {
  const res = service({
    method: "get",
    url: url,
    params: params,
    ...config,
  });
  return res.data;
};

const post = (url, data, ...config) => {
  const res = service({
    method: "post",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });
  return res.data;
};

const upload = (url, data) => {
  const res = service({
    method: "post",
    url: url,
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const download = (url, params, ...config) => {
  return service({
    method: "get",
    url: url,
    params: params,
    responseType: "blob",
  });
};

// 统一处理请求响应异常
function handleError() {}

// 导出实例
export default {
  get,
  post,
  upload,
  download,
  service,
};
