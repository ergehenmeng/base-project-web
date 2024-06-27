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
        name: 'marketingCouponIndex',
        component: () => import('@/views/marketing/coupon/index.vue')
      }
    ]
  }
];
