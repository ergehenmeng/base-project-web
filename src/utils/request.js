import axios from "axios";
import useUserStore from "@/store/user";
import { useRouter } from "vue-router";

/**
 * 特殊错误回调函数注册
 */
const errorCallback = {
  8848: (data, response) => {
    useUserStore().logout(response.config.url);
  },
  403: () => {
    useRouter().push("/403");
  },
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
      errorMsg(res, response);
      return Promise.reject(new Error(msg || "Error"));
    }
  },
  (error) => {
    ElMessage.error("接口请求超时，请重试");
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

/**
 * 弹出错误信息并在关闭时执行回调
 *
 * @param { data } data 响应数据
 * @param { response } response 响应对象
 */
const errorMsg = (data, response) => {
  ElMessage({
    message: data.msg,
    type: "error",
    duration: 3000,
    onClose: () => {
      const callbackFunc = errorCallback[data.code];
      if (callbackFunc) {
        callbackFunc(data, response);
      }
    },
  });
};

// 导出实例
export default {
  get,
  post,
  upload,
  download,
  service,
};
