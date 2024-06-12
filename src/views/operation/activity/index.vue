<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="景区">
          <ScenicSelect v-model="queryParams.scenicId" style="width: 300px !important;"></ScenicSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
        </el-form-item>
        <el-form-item class="right-button" v-has-perm="'UdU0'">
          <el-button type="primary" :icon="Plus" @click="handleCreate">新增</el-button>
        </el-form-item>
        <el-form-item class="right-button" v-has-perm="'ZdU0'">
          <el-button type="primary" :icon="Plus" @click="handleConfig">配置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-calendar ref="calendar" v-model="nowDate">
        <template #header="{ date }">
          <span>{{ date }}</span>
          <el-button-group>
            <el-button size="small" @click="selectDate('prev-month')">
              上一月
            </el-button>
            <el-button size="small" @click="selectDate('today')">今天</el-button>
            <el-button size="small" @click="selectDate('next-month')">
              下一月
            </el-button>
          </el-button-group>
        </template>
        <template #date-cell="{ data }">
          <span style="display: block">{{ data.day.split('-')[2] }}</span>
          <ul class="calender-msg-list">
            <el-scrollbar height="50">
              <li v-for="item in activityList(data)" :key="item.id">
                <el-row>
                  <el-col :span="19">
                    <el-text truncated>{{ item.title }}</el-text>
                  </el-col>
                  <el-col :span="2">
                    <el-button v-has-perm="'kdU0'" type="primary" :icon="Edit" @click="handleEdit(item)" link title="编辑">
                    </el-button>
                  </el-col>
                  <el-col :span="2">
                    <el-button v-has-perm="'OdU0'" type="danger" :icon="Delete" @click="handleDelete(item)" link
                               title="删除">
                    </el-button>
                  </el-col>
                </el-row>
              </li>
            </el-scrollbar>
          </ul>
        </template>
      </el-calendar>
    </div>
  </div>
</template>
<script setup>
import {listApi, deleteApi,} from '@/api/operation/activity';
import { reactive, ref} from 'vue';
import {Edit, Delete, Plus} from '@element-plus/icons-vue';
import {confirmMsg, successMsg} from '@/utils/message';
import useUserStore from '@/store/user';
import useDictStore from "@/store/dict.js";
import dayjs from "dayjs";
import {useRouter} from "vue-router";
import ScenicSelect from "@/components/ScenicSelect.vue";

const router = useRouter();
const userStore = useUserStore();
const dictStore = useDictStore();
const dictList = dictStore.getDict('banner_type');

const loading = ref(false);
const calendar = ref();
const nowDate = ref(new Date())

const dataMap = ref({});
const selectAuth = userStore.hasAuth("5dU0");

const queryParams = reactive({
  scenicId: null,
  month: dayjs().format("YYYY-MM")
})

const getList = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      const {data} = await listApi(queryParams);
      data.forEach((item) => {
        dataMap.value[item.nowDate] = item.activityList;
      })
    }
  } finally {
    loading.value = false;
  }
}

onBeforeMount(() => {
  getList()
})

const selectDate = (val) => {
  if (!calendar.value) {
    return
  }
  calendar.value.selectDate(val)
  queryParams.month = dayjs(nowDate.value).format("YYYY-MM")
  getList();
}

const activityList = (data) => {
  for (let key in dataMap.value) {
    if (key === data.day) {
      return dataMap.value[key];
    }
  }
}

const handleDelete = (row) => {
  confirmMsg("确定要删除该活动吗?", () => {
    const data = {id: row.id};
    deleteApi(data).then(() => {
      successMsg('活动删除成功');
      getList();
    })
  })
}

const handleConfig = () => {
  router.push("/operation/activity/config")
}

const handleCreate = () => {
  router.push({
    name: "activityCreate",
    query: {
      "nowDate": dayjs(nowDate.value).format("YYYY-MM-DD")
    }
  })
}

const handleEdit = (item) => {
  router.push("/operation/activity/edit/" + item.id)
}


</script>
<style lang="scss" scoped>
.calender-msg-list {
  list-style: none;
}
</style>
