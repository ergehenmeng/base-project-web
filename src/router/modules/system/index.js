export default [
  {
    path: "/sys",
    meta: {
      title: "系统管理",
    },
    children: [
      {
        path: "config",
        name: "sysConfig",
        component: () => import("@/views/system/config/index.vue"),
        meta: {
          title: "系统配置",
        },
      },
      {
        path: "menu",
        name: "sysMenu",
        component: () => import("@/views/system/menu/index.vue"),
        meta: {
          title: "菜单管理",
        },
      },
      {
        path: "role",
        name: "sysRole",
        component: () => import("@/views/system/role/index.vue"),
        meta: {
          title: "角色管理",
        },
      },
      {
        path: "user",
        name: "sysUser",
        component: () => import("@/views/system/user/index.vue"),
        meta: {
          title: "用户管理",
        },
      },
      {
        path: "dept",
        name: "sysDept",
        component: () => import("@/views/system/dept/index.vue"),
        meta: {
          title: "部门管理",
        },
      },
      {
        path: "dict",
        name: "sysDict",
        component: () => import("@/views/system/dict/index.vue"),
        meta: {
          title: "数据字典",
        },
      },
      {
        path: "cache",
        name: "sysCache",
        component: () => import("@/views/system/cache/index.vue"),
        meta: {
          title: "缓存管理",
        },
      },
      {
        path: "blackRoster",
        name: "blackRoster",
        component: () => import("@/views/system/blackRoster/index.vue"),
        meta: {
          title: "ip黑名单",
        },
      },
      {
        path: "image",
        name: "image",
        component: () => import("@/views/system/image/index.vue"),
        meta: {
          title: "图片管理",
        },
      },
      {
        path: "auth",
        name: "sysAuth",
        component: () => import("@/views/system/auth/index.vue"),
        meta: {
          title: "授权管理",
        },
      },
      {
        path: "sensitive",
        name: "sensitive",
        component: () => import("@/views/system/sensitive/index.vue"),
        meta: {
          title: "敏感词",
        },
      },
      {
        path: "feedback",
        name: "feedback",
        component: () => import("@/views/system/feedback/index.vue"),
        meta: {
          title: "意见反馈",
        },
      },
      {
        path: "help",
        name: "help",
        component: () => import("@/views/system/help/index.vue"),
        meta: {
          title: "帮助中心",
        },
      },
    ],
  },
];
