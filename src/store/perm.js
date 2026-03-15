import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 权限信息
 */
const usePermStore = defineStore(
  'perm',
  () => {
    const perm = ref({
      // 菜单权限
      menuList: [],
      // 按钮权限
      permList: []
    });
    // 判断是否有指定的按钮权限
    const hasAuth = (authCode) => {
      const permList = perm.value.permList;
      return permList !== null && Array.isArray(permList) && permList.includes(authCode);
    };

    return { perm, hasAuth};
  },
  // 开启持久化
  { persist: true }
);

export default usePermStore;
