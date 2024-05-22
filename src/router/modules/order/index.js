export default [
  {
    path: "/order",
    meta: {
      title: "订单管理",
    },
    children: [
      {
        path: "homestay",
        name: "homestay",
        component: () => import("@/views/order/homestay/index.vue"),
        meta: {
          title: "民宿订单",
        },
        children: [
          {
            path: "detail",
            name: "detail",
            component: () => import("@/views/order/homestay/detail/index.vue"),
            meta: {
              title: "详情",
            },
          },
        ],
      },
      {
        path: "line",
        name: "line",
        component: () => import("@/views/order/line/index.vue"),
        meta: {
          title: "线路订单",
        },
        children: [
          {
            path: "detail",
            name: "detail",
            component: () => import("@/views/order/line/detail/index.vue"),
            meta: {
              title: "详情",
            },
          },
        ],
      },
      {
        path: "ticket",
        name: "ticket",
        component: () => import("@/views/order/ticket/index.vue"),
        meta: {
          title: "门票订单",
        },
        children: [
          {
            path: "detail",
            name: "detail",
            component: () => import("@/views/order/ticket/detail/index.vue"),
            meta: {
              title: "详情",
            },
          },
        ],
      },
      {
        path: "voucher",
        name: "voucher",
        component: () => import("@/views/order/voucher/index.vue"),
        meta: {
          title: "餐饮订单",
        },
        children: [
          {
            path: "detail",
            name: "detail",
            component: () => import("@/views/order/voucher/detail/index.vue"),
            meta: {
              title: "详情",
            },
          },
        ],
      },
      {
        path: "venue",
        name: "venue",
        component: () => import("@/views/order/venue/index.vue"),
        meta: {
          title: "场馆预约订单",
        },
        children: [
          {
            path: "detail",
            name: "detail",
            component: () => import("@/views/order/venue/detail/index.vue"),
            meta: {
              title: "详情",
            },
          },
        ],
      },
      {
        path: "item",
        name: "item",
        component: () => import("@/views/order/item/index.vue"),
        meta: {
          title: "零售订单",
        },
        children: [
          {
            path: "detail",
            name: "detail",
            component: () => import("@/views/order/item/detail/index.vue"),
            meta: {
              title: "详情",
            },
          },
        ],
      },
    ],
  },
];
