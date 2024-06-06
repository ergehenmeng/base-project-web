import {defineStore} from "pinia";
import {ref} from "vue";
import {listApi, provinceApi} from "@/api/system/area";

/**
 * 省市县信息
 */
const useAreaStore = defineStore(
    "area",
    () => {
        const areaList = ref([]);
        const cityList = ref([]);
        const provinceList = ref([])
        const provinceId = import.meta.env.VITE_AREA_PROVINCE;
        const initArea = () => {
            listApi().then(res => {
                areaList.value = res.data;
                cityList.value = res.data.filter(item => item.parentId === provinceId)[0].children;
            });
            provinceApi().then(res => {
                provinceList.value = res.data;
            });
        }
        return { areaList, provinceList, cityList, initArea};
    },
    // 开启持久化
    { persist: true }
);

export default useAreaStore;
