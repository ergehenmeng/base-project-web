import { dictListApi } from '@/api/system/dict';
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 数据字典
 * [{
 *     hiddenValue: "1",
 *     showValue: "男",
 * }]
 */
const useDictStore = defineStore(
  'dict',
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
      return dictList.find((item) => item.hiddenValue === value)?.showValue;
    };

    const getDict = (nid) => {
      const dictList = dictMap.value[nid];
      if (dictList) {
        return dictList;
      } else {
        console.warn('数据字典未初始化', nid);
        return [];
      }
    };

    /**
     * 加载数据字典
     * @param nid 数据字典编码
     * @returns {Promise<void>}
     */
    const initDict = async (...nid) => {
      if (nid.length === 0) {
        return;
      }
      const idList = [...nid];
      const { data } = await dictListApi({ idList });
      data.forEach((item) => {
        dictMap.value[item.nid] = item.itemList;
      });
    };
    return { dictMap, parseDict, getDict, initDict };
  },
  // 开启持久化
  { persist: true }
);

export default useDictStore;
