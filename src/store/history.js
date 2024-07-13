import { defineStore } from 'pinia';

/**
 * 存储历史页面 用于跳转使用
 * @type
 */
const useHistoryStore = defineStore(
    'history',
    () => {
        const beforePage = ref('');
        const nowPage = ref('');
        const getBeforePage = () => {
            return beforePage.value;
        };
        const getNowPage = () => {
            return nowPage.value;
        };

        const setPage = (before, now) => {
            beforePage.value = before;
            nowPage.value = now;
        };
        return { getNowPage, getBeforePage, setPage };
    }
);

export default useHistoryStore;