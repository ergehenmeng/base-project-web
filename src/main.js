import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "@/styles/index.scss";
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);
// 引入路由
app.use(router);
// 引入element-plus
app.use(ElementPlus, { locale: zhCn });
// 注册element-plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 挂载
app.mount("#app");
