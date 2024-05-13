import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import "@/styles/index.scss";

const app = createApp(App);
// 绑定路由
app.use(router);
// 配置全局路由
app.config.globalProperties.$router = router;
// 挂载
app.mount("#app");
