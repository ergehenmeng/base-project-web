export default [
  {
    path: '/merchant',
    meta: {
      title: '商户中心'
    },
    children: [
      {
        path: 'user',
        meta: {
          title: '商户用户'
        },
        children: [
          {
            path: '',
            name: 'merchantUserIndex',
            component: () => import('@/views/merchant/user/index.vue')
          }
        ]
      }
    ]
  }
];
