import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import "@/styles/index.scss";
import { createPinia } from "pinia";
import {createPersistedState} from "pinia-plugin-persistedstate";

const app = createApp(App);
// 绑定路由
app.use(router);
// 创建pinia
const pinia = createPinia();
pinia.use(createPersistedState({
  key: id => `__persisted__${id}`
}));
// 绑定状态管理
app.use(pinia);
// 配置全局路由
app.config.globalProperties.$router = router;
// 挂载
app.mount("#app");
