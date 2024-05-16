import { createRouter, createWebHashHistory } from "vue-router";
import useUserStore from "@/store/user";

export const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/",
    name: "main",
    component: () => import("@/views/main/index.vue"),
  },
  {
    path: "/403",
    name: "forbidden",
    component: () => import("@/views/error/403.vue"),
  },
  {
    path: "/404",
    name: "notFound",
    component: () => import("@/views/error/404.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 严格模式，默认为true 即匹配/user/detail而不是/user/detail/
  strict: true,
});

const whiteList = ["/login"];

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  // 用户已登录, 即使访问登录页, 也跳转到首页
  if (userStore.isLogin) {
    if (to.path === "/login") {
      next("/");
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      // 未登录, 且不在白名单中, 需要跳转到登录页
      next("/login?redirect=" + to.path);
    }
  }
});

export default router;
