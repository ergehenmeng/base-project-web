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
      },
      {
        path: 'role',
        meta: {
          title: '商户角色'
        },
        children: [
          {
            path: '',
            name: 'merchantRoleIndex',
            component: () => import('@/views/merchant/role/index.vue')
          }
        ]
      },
      {
        path: 'detail',
        meta: {
          title: '商户信息'
        },
        children: [
          {
            path: '',
            name: 'merchantDetailIndex',
            component: () => import('@/views/merchant/detail/index.vue')
          }
        ]
      },
      {
        path: 'account',
        meta: {
          title: '商户账户'
        },
        children: [
          {
            path: '',
            name: 'merchantAccountIndex',
            component: () => import('@/views/merchant/account/index.vue')
          }
        ]
      },
      {
        path: 'accountLog',
        meta: {
          title: '资金变动记录'
        },
        component: () => import('@/views/merchant/accountLog/index.vue')
      },
      {
        path: 'withdraw',
        meta: {
          title: '提现记录'
        },
        component: () => import('@/views/merchant/withdraw/index.vue')
      },
      {
        path: 'freezeLog',
        meta: {
          title: '冻结记录'
        },
        component: () => import('@/views/merchant/freezeLog/index.vue')
      }
    ]
  }
];
