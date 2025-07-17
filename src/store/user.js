import { loginApi, logoutApi } from '@/api/login';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import router from '@/router';

/**
 * 用户登录信息
 */
const useUserStore = defineStore(
  'user',
  () => {
    const user = ref({
      // 登录token
      token: '',
      // 用户类型 0:系统管理员 1:系统用户 2:商户管理员 3:商户用户
      userType: null,
      // 商户类型 1 2 4 8 16 32
      merchantType: 0,
      // 昵称
      nickName: '',
      // 系统名称
      systemName: '',
      // 用户名
      userName: '',
      // 菜单权限
      menuList: [],
      // 按钮权限
      permList: [],
      // 是否为初始密码
      init: false,
      // 密码是否长时间未修改
      expire: false,
      // 是否锁屏
      isLock: false,
      // 是否绑定微信
      bindWechat: false,
      // 商户id
      merchantId: ''
    });
    // 用户是否登陆
    const isLogin = ref(false);
    // 判断是否有指定的按钮权限
    const hasAuth = (authCode) => {
      const permList = user.value.permList;
      return permList !== null && Array.isArray(permList) && permList.includes(authCode);
    };
    /**
     * 退出登录
     * @param { * } redirectUrl 是否包含重定向地址
     * @returns
     */
    const logout = (redirectUrl = null) => {
      if (!isLogin.value) {
        return;
      }
      user.value = null;
      isLogin.value = false;
      window.localStorage.clear();
      window.sessionStorage.clear();
      // 此处表示被动退出
      if (redirectUrl) {
        router.replace('/login?redirect=' + redirectUrl);
      } else {
        // 表示主动退出
        logoutApi().then((res) => {
          router.replace('/login');
        });
      }
    };
    // 登录并设置用户信息
    const login = async (loginData) => {
      if (isLogin.value) {
        return;
      }
      const { data } = await loginApi(loginData);
      if (data.state === 1) {
        isLogin.value = true;
        user.value = { ...data };
      } else {
        Promise.reject(new Error(data));
      }
    };

    const setInit = (init) => {
      user.value.init = init;
    };
    const setLock = (isLock) => {
      user.value.isLock = isLock;
    }
    const setExpire = (expire) => {
      user.value.expire = expire;
    }
    const setBindWechat = (bindWechat) => {
      user.value.bindWechat = bindWechat;
    }
    return { user, isLogin, login, hasAuth, logout, setInit, setLock, setExpire, setBindWechat };
  },
  // 开启持久化
  { persist: true }
);

export default useUserStore;
