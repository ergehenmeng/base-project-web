export default [
  {
    path: '/statistics',
    meta: {
      title: '统计分析'
    },
    children: [
      {
        path: 'home',
        meta: {
          title: '首页统计'
        },
        children: [
          {
            path: '',
            name: 'statisticsIndex',
            component: () => import('@/views/statistics/Home.vue')
          }
        ]
      }
    ]
  }
];
