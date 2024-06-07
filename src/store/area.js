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
                if (res.data.length > 0) {
                    cityList.value = res.data.filter(item => item.id === provinceId)[0].children;
                }
            });
            provinceApi().then(res => {
                provinceList.value = res.data;
            });
        }
        const parseCity = (provinceId, cityId) => {
            if (provinceList.value.length > 0) {
                const province = provinceList.value.filter(item => item.id === provinceId)[0];
                const city = province.children.filter(item => item.id === cityId)[0];
                return province.title + "-" + city.title;
            }
            return null;
        }
        return { areaList, provinceList, cityList, initArea, parseCity};
    },
    // 开启持久化
    { persist: true }
);

export default useAreaStore;
