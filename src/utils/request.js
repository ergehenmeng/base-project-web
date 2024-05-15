import axios from "axios";
import useUserStore from "@/store/user";

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
    if (!config.headers) {
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`
      );
    }
    config.headers["token"] = useUserStore().user.token;
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
    const { code, msg } = res;
    if (code === 200) {
      return res;
    } else {
      ElMessage.error(msg)
      return Promise.reject(new Error(msg || "Error"));
    }
  },
  (error) => {
    ElMessage.error("请求超时，请重试");
    return Promise.reject(error);
  }
);

const get = ({ url, params, ...config }) => {
  return service({
    url: url,
    method: "get",
    params: params,
    ...config,
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
