export default [
  {
    path: '/user',
    meta: {
      title: '商户会员'
    },
    children: [
      {
        path: 'merchant',
        meta: {
          title: '商户管理'
        },
        name: 'merchantIndex',
        component: () => import('@/views/user/merchant/index.vue')
      },
      {
        path: 'member',
        meta: {
          title: '会员管理'
        },
        name: 'memberIndex',
        component: () => import('@/views/user/member/index.vue')
      }
    ]
  }
];
