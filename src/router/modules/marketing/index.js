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
            name: 'couponIndex',
            component: () => import('@/views/marketing/coupon/index.vue'),
          },
          {
            path: 'create',
            name: 'couponCreate',
            meta: {
              title: '新增'
            },
            component: () => import('@/views/marketing/coupon/CouponForm.vue'),
          },
          {
            path: 'edit/:id',
            name: 'couponEdit',
            meta: {
              title: '编辑'
            },
            component: () => import('@/views/marketing/coupon/CouponForm.vue'),
          },
          {
            path: 'detail/:id',
            name: 'couponDetail',
            meta: {
              title: '详情'
            },
            component: () => import('@/views/marketing/coupon/CouponForm.vue'),
          },
          {
            path: 'grant/:id',
            name: 'couponGrant',
            meta: {
              title: '发放'
            },
            component: () => import('@/views/marketing/coupon/GrantPage.vue'),
          },
          {
            path: 'receive/:id',
            name: 'couponReceive',
            meta: {
              title: '领取详情'
            },
            component: () => import('@/views/marketing/coupon/ReceivePage.vue'),
          }
        ]
      },
      {
        path: 'group',
        meta: {
          title: '拼团'
        },
        children: [
          {
            path: '',
            name: 'groupIndex',
            component: () => import('@/views/marketing/group/index.vue'),
          },
          {
            path: 'create',
            name: 'groupCreate',
            meta: {
              title: '新增'
            },
            component: () => import('@/views/marketing/group/GroupForm.vue'),
          },
          {
            path: 'edit/:id',
            name: 'groupEdit',
            meta: {
              title: '编辑'
            },
            component: () => import('@/views/marketing/group/GroupForm.vue'),
          },
          {
            path: 'detail/:id',
            name: 'groupDetail',
            meta: {
              title: '详情'
            },
            component: () => import('@/views/marketing/group/GroupForm.vue'),
          }
        ]
      },
      {
        path: 'limit',
        meta: {
          title: '限时购'
        },
        children: [
          {
            path: '',
            name: 'limitIndex',
            component: () => import('@/views/marketing/limit/index.vue'),
          },
          {
            path: 'create',
            name: 'limitCreate',
            meta: {
              title: '新增'
            },
            component: () => import('@/views/marketing/limit/LimitForm.vue'),
          },
          {
            path: 'edit/:id',
            name: 'limitEdit',
            meta: {
              title: '编辑'
            },
            component: () => import('@/views/marketing/limit/LimitForm.vue'),
          },
          {
            path: 'detail/:id',
            name: 'limitDetail',
            meta: {
              title: '详情'
            },
            component: () => import('@/views/marketing/limit/LimitForm.vue'),
          }
        ]
      },
      {
        path: 'lottery',
        meta: {
          title: '抽奖'
        },
        children: [
          {
            path: '',
            name: 'lotteryIndex',
            component: () => import('@/views/marketing/lottery/index.vue'),
          },
          {
            path: 'create',
            name: 'lotteryCreate',
            meta: {
              title: '新增'
            },
            component: () => import('@/views/marketing/lottery/LotteryForm.vue'),
          },
          {
            path: 'edit/:id',
            name: 'lotteryEdit',
            meta: {
              title: '编辑'
            },
            component: () => import('@/views/marketing/lottery/LotteryForm.vue'),
          },
          {
            path: 'detail/:id',
            name: 'lotteryDetail',
            meta: {
              title: '详情'
            },
            component: () => import('@/views/marketing/lottery/LotteryForm.vue'),
          },
          {
            path: 'log/:id',
            name: 'lotteryLog',
            meta: {
              title: '抽奖记录'
            },
            component: () => import('@/views/marketing/lottery/LogPage.vue'),
          }
        ]
      },
      {
        path: 'redeem',
        meta: {
          title: '兑换码'
        },
        children: [
          {
            path: '',
            name: 'redeemIndex',
            component: () => import('@/views/marketing/redeem/index.vue'),
          },
          {
            path: 'create',
            name: 'redeemCreate',
            meta: {
              title: '新增'
            },
            component: () => import('@/views/marketing/redeem/RedeemForm.vue'),
          },
          {
            path: 'edit/:id',
            name: 'redeemEdit',
            meta: {
              title: '编辑'
            },
            component: () => import('@/views/marketing/redeem/RedeemForm.vue'),
          },
          {
            path: 'detail/:id',
            name: 'redeemDetail',
            meta: {
              title: '详情'
            },
            component: () => import('@/views/marketing/redeem/RedeemForm.vue'),
          },
          {
            path: 'key/:id',
            name: 'redeemKey',
            meta: {
              title: '兑换码列表'
            },
            component: () => import('@/views/marketing/redeem/CdKeyPage.vue'),
          }
        ]
      }
    ]
  }
];
