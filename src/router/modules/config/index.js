export default [
  {
    path: '/config',
    meta: {
      title: '运营配置'
    },
    children: [
      {
        path: 'news',
        name: 'newsConfig',
        component: () => import('@/views/config/news/index.vue'),
        meta: {
          title: '资讯配置'
        }
      },
      {
        path: 'push',
        name: 'pushConfig',
        component: () => import('@/views/config/push/index.vue'),
        meta: {
          title: '推送模板'
        }
      },
      {
        path: 'itemTag',
        name: 'itemTagConfig',
        component: () => import('@/views/config/itemTag/index.vue'),
        meta: {
          title: '零售标签'
        }
      },
      {
        path: 'notice',
        name: 'noticeConfig',
        component: () => import('@/views/config/notice/index.vue'),
        meta: {
          title: '站内性模板'
        }
      },
      {
        path: 'email',
        name: 'emailConfig',
        component: () => import('@/views/config/email/index.vue'),
        meta: {
          title: '邮件模板'
        }
      }
    ]
  }
];
