import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * 面包屑信息
 */
const useBreadcrumbStore = defineStore(
  "breadcrumb",
  () => {
    const breadcrumb = ref([]);
    const switchPage = (toPage) => {
      const breadcrumbList = toPage.matched.filter(
        (item) => item.meta !== null && item.meta.title !== undefined
      );
      const home = [{ path: "/home", meta: { title: "首页" } }];
      if (breadcrumbList.length === 0) {
        breadcrumb.value = home;
        return;
      }
      breadcrumb.value = home.concat(breadcrumbList);
    };

    return { breadcrumb, switchPage };
  },
  // 开启持久化
  { persist: true }
);

export default useBreadcrumbStore;
