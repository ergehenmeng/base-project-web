export default [
  {
    path: "/operation",
    meta: {
      title: "平台运营",
    },
    children: [
      {
        path: "activity",
        name: "activity",
        component: () => import("@/views/operation/activity/index.vue"),
        meta: {
          title: "活动管理",
        },
      },
      {
        path: "banner",
        name: "banner",
        component: () => import("@/views/operation/banner/index.vue"),
        meta: {
          title: "轮播管理",
        },
      },
      {
        path: "notice",
        name: "notice",
        meta: {
          title: "公告管理",
        },
        children: [
          {
            path: "",
            name: "noticeIndex",
            component: () => import("@/views/operation/notice/index.vue")
          },
          {
            path: "create",
            name: "noticeCreate",
            component: () => import("@/views/operation/notice/NoticeForm.vue"),
            meta: {
              title: "新增",
            },
          },
          {
            path: "edit/:id",
            name: "noticeEdit",
            component: () => import("@/views/operation/notice/NoticeForm.vue"),
            meta: {
              title: "编辑",
            },
          }
        ],
      },
      {
        path: "news",
        name: "news",
        component: () => import("@/views/operation/news/index.vue"),
        meta: {
          title: "资讯管理",
        },
      },
      {
        path: "comment",
        name: "comment",
        component: () => import("@/views/operation/comment/index.vue"),
        meta: {
          title: "评论管理",
        },
      },
      {
        path: "version",
        name: "version",
        component: () => import("@/views/operation/version/index.vue"),
        meta: {
          title: "版本管理",
        },
      },
    ],
  },
];
