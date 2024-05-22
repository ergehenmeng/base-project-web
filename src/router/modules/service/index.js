export default [
  {
    path: "/service",
    meta: {
      title: "售后管理",
    },
    children: [
      {
        path: "refund",
        name: "refund",
        component: () => import("@/views/service/refund/index.vue"),
        meta: {
          title: "退款订单",
        },
        children: [
          {
            path: "detail",
            name: "detail",
            component: () => import("@/views/service/refund/detail/index.vue"),
            meta: {
              title: "详情",
            },
          },
        ],
      },
      {
        path: "verify",
        name: "verify",
        component: () => import("@/views/service/verify/index.vue"),
        meta: {
          title: "核销订单",
        },
      },
      {
        path: "evaluation",
        name: "evaluation",
        component: () => import("@/views/service/evaluation/index.vue"),
        meta: {
          title: "订单评价",
        },
      },
      {
        path: "cart",
        name: "cart",
        component: () => import("@/views/service/cart/index.vue"),
        meta: {
          title: "购物车",
        },
      },
    ],
  },
];
