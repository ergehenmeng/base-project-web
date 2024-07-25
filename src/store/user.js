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
      // 昵称
      nickName: '',
      // 按钮权限
      permList: [],
      // 是否为初始密码
      init: false
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
      const result = await loginApi(loginData);
      isLogin.value = true;
      user.value = { ...result.data };
    };

    const setInit = (init) => {
      user.value.init = init;
    };

    return { user, isLogin, login, hasAuth, logout, setInit };
  },
  // 开启持久化
  { persist: true }
);

export default useUserStore;
