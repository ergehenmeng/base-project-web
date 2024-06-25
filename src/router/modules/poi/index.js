export default [
  {
    path: '/poi',
    meta: {
      title: '区域导览'
    },
    children: [
      {
        path: 'area',
        meta: {
          title: 'POI区域'
        },
        children: [
          {
            path: '',
            name: 'poiAreaIndex',
            component: () => import('@/views/poi/area/index.vue')
          },
          {
            path: 'create',
            meta: {
              title: '新增'
            },
            component: () => import('@/views/poi/area/AreaForm.vue')
          },
          {
            path: 'edit/:id',
            meta: {
              title: '编辑'
            },
            component: () => import('@/views/poi/area/AreaForm.vue')
          },
          {
            path: 'detail/:id',
            meta: {
              title: '详情'
            },
            component: () => import('@/views/poi/area/AreaForm.vue')
          }
        ]
      },
      {
        path: 'type',
        meta: {
          title: 'POI类型'
        },
        name: 'poiTypeIndex',
        component: () => import('@/views/poi/type/index.vue')
      },
      {
        path: 'point',
        meta: {
          title: 'POI点位'
        },
        name: 'poiPointIndex',
        component: () => import('@/views/poi/point/index.vue')
      },
      {
        path: 'line',
        meta: {
          title: 'POI线路'
        },
        name: 'poiLineIndex',
        component: () => import('@/views/poi/line/index.vue')
      }
    ]
  }
]
