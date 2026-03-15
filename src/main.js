import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import '@/styles/index.scss';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import hasPerm from '@/directive/hasPerm.js';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import vue3TreeOrg from 'vue3-tree-org';
import "vue3-tree-org/lib/vue3-tree-org.css";

const app = createApp(App);
// 绑定路由
app.use(router);
// 绑定指令
app.directive('hasPerm', hasPerm);
// 创建pinia
const pinia = createPinia();
pinia.use(
  createPersistedState({
    key: (id) => `__persisted__${id}`,
    storage: window.localStorage
  })
);
// 绑定状态管理
app.use(pinia);
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(vue3TreeOrg)
// 挂载
app.mount('#app');
