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
      },
      {
        path: 'task',
        name: 'taskConfig',
        component: () => import('@/views/config/task/index.vue'),
        meta: {
          title: '任务配置'
        }
      },
      {
        path: 'memberTag',
        meta: {
          title: '会员标签'
        },
        children: [
            {
                path: '',
                name: 'memberTagIndex',
                component: () => import('@/views/config/memberTag/index.vue')
            },
            {
                path: 'list/:id',
                name: 'memberTagList',
                component: () => import('@/views/config/memberTag/MemberList.vue'),
                meta: {
                    title: '会员列表'
               }
           }
        ]
      },
      {
        path: 'pay',
        name: 'pay',
        component: () => import('@/views/operation/pay/index.vue'),
        meta: {
          title: '支付配置'
        }
      }
    ]
  }
];
