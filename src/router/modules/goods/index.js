export default [
  {
    path: "/goods",
    meta: {
      title: "商品管理",
    },
    children: [
      {
        path: "scenic",
        name: "scenic",
        component: () => import("@/views/goods/ticket/scenic/index.vue"),
        meta: {
          title: "景区管理",
        },
      },
      {
        path: "ticket",
        name: "ticket",
        component: () => import("@/views/goods/ticket/index.vue"),
        meta: {
          title: "门票管理",
        },
      },
      {
        path: "homestay",
        name: "homestay",
        component: () => import("@/views/goods/homestay/index.vue"),
        meta: {
          title: "民宿管理",
        },
      },
      {
        path: "room",
        name: "room",
        component: () => import("@/views/goods/homestay/room/index.vue"),
        meta: {
          title: "房型管理",
        },
      },
      {
        path: "store",
        name: "store",
        component: () => import("@/views/goods/item/store/index.vue"),
        meta: {
          title: "零售店铺",
        },
      },
      {
        path: "item",
        name: "item",
        component: () => import("@/views/goods/item/index.vue"),
        meta: {
          title: "零售商品",
        },
      },
      {
        path: "travelAgency",
        name: "travelAgency",
        component: () => import("@/views/goods/line/travelAgency/index.vue"),
        meta: {
          title: "旅行社",
        },
      },
      {
        path: "line",
        name: "line",
        component: () => import("@/views/goods/line/index.vue"),
        meta: {
          title: "线路管理",
        },
      },
      {
        path: "restaurant",
        name: "restaurant",
        component: () => import("@/views/goods/voucher/restaurant/index.vue"),
        meta: {
          title: "餐饮商家",
        },
      },
      {
        path: "voucher",
        name: "voucher",
        component: () => import("@/views/goods/voucher/index.vue"),
        meta: {
          title: "餐饮券",
        },
      },
      {
        path: "venue",
        name: "venue",
        component: () => import("@/views/goods/venue/index.vue"),
        meta: {
          title: "场馆管理",
        },
      },
      {
        path: "site",
        name: "site",
        component: () => import("@/views/goods/venue/site/index.vue"),
        meta: {
          title: "场地管理",
        },
      },
    ],
  },
];
