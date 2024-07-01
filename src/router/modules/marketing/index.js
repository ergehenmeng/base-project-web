export default [
  {
    path: '/marketing',
    meta: {
      title: '营销中心'
    },
    children: [
      {
        path: 'coupon',
        meta: {
          title: '优惠券'
        },
        children: [
          {
            path: '',
            name: 'marketingCouponIndex',
            component: () => import('@/views/marketing/coupon/index.vue'),
          },
          {
            path: 'create',
            name: 'marketingCouponCreate',
            meta: {
              title: '新增'
            },
            component: () => import('@/views/marketing/coupon/CouponForm.vue'),
          },
          {
            path: 'edit/:id',
            name: 'marketingCouponEdit',
            meta: {
              title: '编辑'
            },
            component: () => import('@/views/marketing/coupon/CouponForm.vue'),
          },
          {
            path: 'detail/:id',
            name: 'marketingCouponDetail',
            meta: {
              title: '详情'
            },
            component: () => import('@/views/marketing/coupon/CouponForm.vue'),
          },
          {
            path: 'grant/:id',
            name: 'marketingCouponGrant',
            meta: {
              title: '发放'
            },
            component: () => import('@/views/marketing/coupon/GrantPage.vue'),
          },
          {
            path: 'receive/:id',
            name: 'marketingCouponReceive',
            meta: {
              title: '领取详情'
            },
            component: () => import('@/views/marketing/coupon/ReceivePage.vue'),
          }
        ]
      },
      {
        path: 'coupon',
        meta: {
          title: '拼团'
        },
        children: [
          {
            path: '',
            name: 'marketingGroupIndex',
            component: () => import('@/views/marketing/group/index.vue'),
          },
          {
            path: 'create',
            name: 'marketingGroupCreate',
            meta: {
              title: '新增'
            },
            component: () => import('@/views/marketing/group/GroupForm.vue'),
          },
          {
            path: 'edit/:id',
            name: 'marketingGroupEdit',
            meta: {
              title: '编辑'
            },
            component: () => import('@/views/marketing/group/GroupForm.vue'),
          },
          {
            path: 'detail/:id',
            name: 'marketingGroupDetail',
            meta: {
              title: '详情'
            },
            component: () => import('@/views/marketing/group/GroupForm.vue'),
          }
        ]
      }
    ]
  }
];
