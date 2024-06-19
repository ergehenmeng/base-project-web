import { createRouter, createWebHashHistory } from 'vue-router';
import useUserStore from '@/store/user';
import useBreadcrumbStore from '@/store/breadcrumb';

export const routes = [
  {
    path: '/login',
    name: 'login',
    components: {
      fullScreen: () => import('@/views/Login.vue')
    }
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/views/error/403.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/error/404.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 严格模式，默认为true 即匹配/user/detail而不是/user/detail/
  strict: true
});

const whiteList = ['/login'];

router.beforeEach((to, from, next) => {
  const breadcrumbStore = useBreadcrumbStore();
  breadcrumbStore.switchPage(to);
  const userStore = useUserStore();
  // 用户已登录, 即使访问登录页, 也跳转到首页
  if (userStore.isLogin || whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    // 未登录, 且不在白名单中, 需要跳转到登录页
    next('/login?redirect=' + to.path);
  }
});

const modules = import.meta.glob('./modules/*/*.*', { eager: true });

for (const path in modules) {
  modules[path].default.forEach((item) => {
    router.addRoute(item);
  });
}
export default router;
