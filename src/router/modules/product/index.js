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
        meta: {
          title: "门票管理",
        },
        children: [
          {
            path: "",
            name: "ticketIndex",
            component: () => import("@/views/product/ticket/index.vue")
          },
          {
            path: "create",
            name: "ticketCreate",
            component: () => import("@/views/product/ticket/TicketForm.vue"),
            meta: {
              title: "新增",
            },
          },
          {
            path: "edit/:id",
            name: "ticketEdit",
            component: () => import("@/views/product/ticket/TicketForm.vue"),
            meta: {
              title: "编辑",
            },
          },
          {
            path: "detail/:id",
            name: "ticketDetail",
            component: () => import("@/views/product/ticket/TicketForm.vue"),
            meta: {
              title: "查看",
            },
          }
        ]
      },
      {
        path: "homestay",
        name: "homestay",
        meta: {
          title: "民宿管理",
        },
        children: [
          {
            path: "",
            name: "homestayIndex",
            component: () => import("@/views/product/homestay/index.vue")
          },
          {
            path: "create",
            name: "homestayCreate",
            component: () => import("@/views/product/homestay/HomestayForm.vue"),
            meta: {
              title: "新增",
            },
          },
          {
            path: "edit/:id",
            name: "homestayEdit",
            component: () => import("@/views/product/homestay/HomestayForm.vue"),
            meta: {
              title: "编辑",
            },
          },
          {
            path: "detail/:id",
            name: "homestayDetail",
            component: () => import("@/views/product/homestay/HomestayForm.vue"),
            meta: {
              title: "查看",
            },
          }
        ]
      },
      {
        path: "room",
        name: "room",
        meta: {
          title: "民宿房型",
        },
        children: [
          {
            path: "",
            name: "roomIndex",
            component: () => import("@/views/product/homestay/room/index.vue")
          },
          {
            path: "create",
            name: "roomCreate",
            component: () => import("@/views/product/homestay/room/RoomForm.vue"),
            meta: {
              title: "新增",
            },
          },
          {
            path: "edit/:id",
            name: "roomEdit",
            component: () => import("@/views/product/homestay/room/RoomForm.vue"),
            meta: {
              title: "编辑",
            },
          },
          {
            path: "detail/:id",
            name: "roomDetail",
            component: () => import("@/views/product/homestay/room/RoomForm.vue"),
            meta: {
              title: "查看",
            },
          },
          {
            path: "calendar/:id",
            name: "calendarDetail",
            component: () => import("@/views/product/homestay/room/CalendarForm.vue"),
            meta: {
              title: "价格日历",
            },
          }
        ]
      },
      {
        path: "store",
        name: "store",
        meta: {
          title: "零售店铺",
        },
        children: [
          {
            path: "",
            name: "storeIndex",
            component: () => import("@/views/product/item/store/index.vue")
          },
          {
            path: "create",
            name: "storeCreate",
            component: () => import("@/views/product/item/store/StoreForm.vue"),
            meta: {
              title: "新增",
            },
          },
          {
            path: "edit/:id",
            name: "storeEdit",
            component: () => import("@/views/product/item/store/StoreForm.vue"),
            meta: {
              title: "编辑",
            },
          },
          {
            path: "detail/:id",
            name: "storeDetail",
            component: () => import("@/views/product/item/store/StoreForm.vue"),
            meta: {
              title: "查看",
            },
          }
        ]
      },
      {
        path: "item",
        name: "item",
        meta: {
          title: "零售商品",
        },
        children: [
          {
            path: "",
            name: "itemIndex",
            component: () => import("@/views/product/item/index.vue")
          },
          {
            path: "create",
            name: "itemCreate",
            component: () => import("@/views/product/item/ItemForm.vue"),
            meta: {
              title: "新增",
            },
          },
          {
            path: "edit/:id",
            name: "itemEdit",
            component: () => import("@/views/product/item/ItemForm.vue"),
            meta: {
              title: "编辑",
            },
          },
          {
            path: "detail/:id",
            name: "itemDetail",
            component: () => import("@/views/product/item/ItemForm.vue"),
            meta: {
              title: "查看",
            },
          }
        ]
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
        path: "travel",
        name: "travel",
        meta: {
          title: "旅行社",
        },
        children: [
          {
            path: "",
            name: "travelIndex",
            component: () => import("@/views/product/line/travel/index.vue")
          },
          {
            path: "create",
            name: "travelCreate",
            component: () => import("@/views/product/line/travel/TravelForm.vue"),
            meta: {
              title: "新增",
            },
          },
          {
            path: "edit/:id",
            name: "travelEdit",
            component: () => import("@/views/product/line/travel/TravelForm.vue"),
            meta: {
              title: "编辑",
            },
          },
          {
            path: "detail/:id",
            name: "travelDetail",
            component: () => import("@/views/product/line/travel/TravelForm.vue"),
            meta: {
              title: "查看",
            },
          }
        ]
      },
      {
        path: "line",
        name: "line",
        meta: {
          title: "线路管理",
        },
        children: [
          {
            path: "",
            name: "lineIndex",
            component: () => import("@/views/product/line/index.vue")
          },
          {
            path: "create",
            name: "lineCreate",
            component: () => import("@/views/product/line/LineForm.vue"),
            meta: {
              title: "新增",
            },
          },
          {
            path: "edit/:id",
            name: "lineEdit",
            component: () => import("@/views/product/line/LineForm.vue"),
            meta: {
              title: "编辑",
            },
          },
          {
            path: "detail/:id",
            name: "lineDetail",
            component: () => import("@/views/product/line/LineForm.vue"),
            meta: {
              title: "查看",
            },
          },
          {
            path: "calendar/:id",
            name: "lineCalendar",
            component: () => import("@/views/product/line/CalendarForm.vue"),
            meta: {
              title: "价格日历",
            },
          }
        ]
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
