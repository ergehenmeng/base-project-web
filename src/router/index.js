import { createRouter, createWebHashHistory } from "vue-router";

export const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/main",
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

export default router;
