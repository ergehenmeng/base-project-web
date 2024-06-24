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
      }
    ]
  }
];
