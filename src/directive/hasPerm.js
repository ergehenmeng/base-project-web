import useUserStore from '@/store/user';
import usePermStore from '@/store/perm';

// 自定义指令, 判断是否包含在指定的按钮权限
export default {
  mounted(el, binding) {
    let perm = false;
    const { value } = binding;
    if (value) {
      const userStore = useUserStore();
      const permStore = usePermStore();
      perm = userStore.isLogin && permStore.hasAuth(value);
    } else {
      console.warn('v-has-perm未配置权限标示符');
    }
    if (!perm) {
      el.parentNode?.removeChild(el);
    }
  }
};
