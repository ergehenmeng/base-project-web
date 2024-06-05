import { defineStore } from "pinia";
import { ref } from "vue";
import { listApi } from "@/api/system/area";
/**
 * 省市县信息
 */
const useAreaStore = defineStore(
    "area",
    () => {
        const areaList = ref([]);
        const initArea = () => {
            listApi().then(res => {
                areaList.value = res.data;
            });
        }
        return { areaList, initArea};
    },
    // 开启持久化
    { persist: true }
);

export default useAreaStore;
