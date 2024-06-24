export default [
  {
    path: '/log',
    meta: {
      title: '日志管理'
    },
    children: [
      {
        path: 'sms',
        meta: {
          title: '短信日志'
        },
        name: 'smsLogIndex',
        component: () => import('@/views/log/sms/index.vue')
      },
      {
        path: 'task',
        meta: {
          title: '任务日志'
        },
        name: 'taskLogIndex',
        component: () => import('@/views/log/task/index.vue')
      },
      {
        path: 'member',
        meta: {
          title: '会员日志'
        },
        name: 'memberLogIndex',
        component: () => import('@/views/log/member/index.vue')
      },
      {
        path: 'pay',
        meta: {
          title: '支付日志'
        },
        name: 'payLogIndex',
        component: () => import('@/views/log/pay/index.vue')
      },
      {
        path: 'system',
        meta: {
          title: '系统日志'
        },
        name: 'systemLogIndex',
        component: () => import('@/views/log/system/index.vue')
      }
    ]
  }
];
