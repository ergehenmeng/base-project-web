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
            component: () => import('@/views/marketing/coupon/CouponForm.vue'),
          },
          {
            path: 'edit/:id',
            name: 'marketingCouponEdit',
            component: () => import('@/views/marketing/coupon/CouponForm.vue'),
          },
          {
            path: 'detail/:id',
            name: 'marketingCouponDetail',
            component: () => import('@/views/marketing/coupon/CouponForm.vue'),
          }
        ]
      }
    ]
  }
];
