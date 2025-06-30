export default [
  {
    path: '/order',
    meta: {
      title: '订单管理'
    },
    children: [
      {
        path: 'homestay/:state?',
        name: 'homestayOrder',
        meta: {
          title: '民宿订单'
        },
        children: [
          {
            path: '',
            name: 'homestayOrderIndex',
            component: () => import('@/views/order/homestay/index.vue')
          },
          {
            path: 'detail/:orderNo',
            name: 'homestayOrderDetail',
            component: () => import('@/views/order/homestay/detail/index.vue'),
            meta: {
              title: '详情'
            }
          }
        ]
      },
      {
        path: 'line/:state?',
        name: 'lineOrder',
        meta: {
          title: '线路订单'
        },
        children: [
          {
            path: '',
            name: 'lineOrderIndex',
            component: () => import('@/views/order/line/index.vue')
          },
          {
              path: 'detail/:orderNo',
            name: 'lineOrderDetail',
            component: () => import('@/views/order/line/detail/index.vue'),
            meta: {
              title: '详情'
            }
          }
        ]
      },
      {
        path: 'ticket/:state?',
        name: 'ticketOrder',
        meta: {
          title: '门票订单'
        },
        children: [
          {
            path: '',
            name: 'ticketOrderIndex',
            component: () => import('@/views/order/ticket/index.vue')
          },
          {
            path: 'detail/:orderNo',
            name: 'ticketOrderDetail',
            component: () => import('@/views/order/ticket/detail/index.vue'),
            meta: {
              title: '详情'
            }
          }
        ]
      },
      {
        path: 'voucher/:state?',
        name: 'voucherOrder',
        meta: {
          title: '餐饮订单'
        },
        children: [
          {
            path: '',
            name: 'voucherOrderIndex',
            component: () => import('@/views/order/voucher/index.vue')
          },
          {
            path: 'detail/:orderNo',
            name: 'voucherOrderDetail',
            component: () => import('@/views/order/voucher/detail/index.vue'),
            meta: {
              title: '详情'
            }
          }
        ]
      },
      {
        path: 'venue/:state?',
        name: 'venueOrder',
        meta: {
          title: '场馆订单'
        },
        children: [
          {
            path: '',
            name: 'venueOrderIndex',
            component: () => import('@/views/order/venue/index.vue')
          },
          {
            path: 'detail/:orderNo',
            name: 'venueOrderDetail',
            component: () => import('@/views/order/venue/detail/index.vue'),
            meta: {
              title: '详情'
            }
          }
        ]
      },
      {
        path: 'item/:state?',
        name: 'itemOrder',
        meta: {
          title: '零售订单'
        },
        children: [
          {
            path: '',
            name: 'itemOrderIndex',
            component: () => import('@/views/order/item/index.vue')
          },
          {
            path: 'detail/:orderNo',
            name: 'itemOrderDetail',
            component: () => import('@/views/order/item/detail/index.vue'),
            meta: {
              title: '详情'
            }
          }
        ]
      }
    ]
  }
];
