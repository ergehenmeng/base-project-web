import {dictListApi} from "@/api/system/dict";
import {defineStore} from "pinia";
import {ref} from "vue";

/**
 * 数据字典
 * [{
 *     hiddenValue: "1",
 *     showValue: "男",
 * }]
 */
const useDictStore = defineStore(
    "dict",
    () => {

        const dictMap = ref({});

        /**
         * 解析数据字典
         * @param nid 数据字典编码
         * @param value 字典选项
         * @returns { string } 值
         */
        const parseDict = (nid, value) => {
            const dictList = getDict(nid);
            return dictList.find(item => item.hiddenValue === value)?.showValue;
        };

        const getDict = (nid) => {
            const dictList = dictMap.value[nid]
            if (dictList) {
                return dictList;
            }
            loadDict(nid);
            const loadList = dictMap.value[nid]
            if (loadList) {
                return loadList;
            } else {
                console.warn("数据字典加载失败", nid);
                return [];
            }
        };

        /**
         * 加载数据字典
         * @param nid 数据字典编码
         * @returns {Promise<void>}
         */
        const loadDict = async (nid) => {
            const {data} = await dictListApi({nid});
            dictMap.value[nid] = data;
        };
        return {dictMap, parseDict, getDict, loadDict};
    },
    // 开启持久化
    {persist: true}
);

export default useDictStore;
