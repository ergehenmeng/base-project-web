export default [
    {
        path: "/config",
        meta: {
            title: "运营配置",
        },
        children: [
            {
                path: "news",
                name: "newsConfig",
                component: () => import("@/views/config/news/index.vue"),
                meta: {
                    title: "资讯配置",
                },
            }
        ],
    },
];
