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
        children: [
          {
            path: '',
            name: 'merchantIndex',
            component: () => import('@/views/user/merchant/index.vue')
          },
          {
            path: 'create',
            meta: {
              title: '新增'
            },
            name: 'merchantCreate',
            component: () => import('@/views/user/merchant/MerchantForm.vue')
          },
          {
            path: 'edit/:id',
            meta: {
              title: '编辑'
            },
            name: 'merchantEdit',
            component: () => import('@/views/user/merchant/MerchantForm.vue')
          },
          {
            path: 'detail/:id',
            meta: {
              title: '详情'
            },
            name: 'merchantDetail',
            component: () => import('@/views/user/merchant/MerchantForm.vue')
          }
        ]
      },
      {
        path: 'member',
        meta: {
          title: '会员管理'
        },
        children: [
          {
            path: '',
            name: 'memberIndex',
            component: () => import('@/views/user/member/index.vue'),
          },
          {
            path: 'login/:id',
            meta: {
              title: '登录日志'
            },
            name: 'memberLoginLog',
            component: () => import('@/views/user/member/LoginLog.vue')
          }
        ]
      }
    ]
  }
];
