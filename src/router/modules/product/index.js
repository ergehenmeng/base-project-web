export default [
  {
    path: "/product",
    meta: {
      title: "商品管理",
    },
    children: [
      {
        path: "scenic",
        name: "scenic",
        meta: {
          title: "景区管理",
        },
        children: [
          {
            path: "",
            name: "scenicIndex",
            component: () => import("@/views/product/ticket/scenic/index.vue")
          },
          {
            path: "create",
            name: "scenicCreate",
            component: () => import("@/views/product/ticket/scenic/ScenicForm.vue"),
            meta: {
              title: "新增",
            },
          },
          {
            path: "edit/:id",
            name: "scenicEdit",
            component: () => import("@/views/product/ticket/scenic/ScenicForm.vue"),
            meta: {
              title: "编辑",
            },
          },
          {
            path: "detail/:id",
            name: "scenicDetail",
            component: () => import("@/views/product/ticket/scenic/ScenicForm.vue"),
            meta: {
              title: "查看",
            },
          }
        ]
      },
      {
        path: "ticket",
        name: "ticket",
        component: () => import("@/views/product/ticket/index.vue"),
        meta: {
          title: "门票管理",
        },
      },
      {
        path: "homestay",
        name: "homestay",
        component: () => import("@/views/product/homestay/index.vue"),
        meta: {
          title: "民宿管理",
        },
      },
      {
        path: "room",
        name: "room",
        component: () => import("@/views/product/homestay/room/index.vue"),
        meta: {
          title: "房型管理",
        },
      },
      {
        path: "store",
        name: "store",
        component: () => import("@/views/product/item/store/index.vue"),
        meta: {
          title: "零售店铺",
        },
      },
      {
        path: "item",
        name: "item",
        component: () => import("@/views/product/item/index.vue"),
        meta: {
          title: "零售商品",
        },
      },
      {
        path: "express",
        name: "express",
        component: () => import("@/views/product/item/express/index.vue"),
        meta: {
          title: "快递模板",
        },
      },
      {
        path: "address",
        name: "address",
        component: () => import("@/views/product/item/address/index.vue"),
        meta: {
          title: "收货地址",
        },
      },
      {
        path: "travelAgency",
        name: "travelAgency",
        component: () => import("@/views/product/line/travelAgency/index.vue"),
        meta: {
          title: "旅行社",
        },
      },
      {
        path: "line",
        name: "line",
        component: () => import("@/views/product/line/index.vue"),
        meta: {
          title: "线路管理",
        },
      },
      {
        path: "restaurant",
        name: "restaurant",
        component: () => import("@/views/product/voucher/restaurant/index.vue"),
        meta: {
          title: "餐饮商家",
        },
      },
      {
        path: "voucher",
        name: "voucher",
        component: () => import("@/views/product/voucher/index.vue"),
        meta: {
          title: "餐饮券",
        },
      },
      {
        path: "venue",
        name: "venue",
        component: () => import("@/views/product/venue/index.vue"),
        meta: {
          title: "场馆管理",
        },
      },
      {
        path: "site",
        name: "site",
        component: () => import("@/views/product/venue/site/index.vue"),
        meta: {
          title: "场地管理",
        },
      },
    ],
  },
];
