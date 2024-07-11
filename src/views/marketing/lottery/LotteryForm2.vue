<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="活动名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="10" />
      </el-form-item>
      <el-form-item prop="storeId">
        <template #label>
          <span>使用店铺<QuestionTip content="不选默认所有店铺生效"></QuestionTip></span>
        </template>
        <StoreAllSelect v-model:store-ids="formData.storeId" v-model:store-list="storeList"></StoreAllSelect>
      </el-form-item>
      <el-form-item label="活动时间" prop="timeList">
        <div style="width: 350px">
          <el-date-picker type="datetimerange" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" time-format="HH:mm" v-model="formData.timeList" style="width: 350px"></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="单日抽奖次数限制" prop="lotteryDay">
        <el-input v-model="formData.lotteryDay" show-word-limit maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="总抽奖次数限制" prop="lotteryTotal">
        <el-input v-model="formData.lotteryTotal" show-word-limit maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="中奖次数限制" prop="winNum">
        <el-input v-model="formData.winNum" show-word-limit maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <UploadImage v-model="formData.coverUrl"></UploadImage>
      </el-form-item>
      <el-form-item label="抽奖标题" prop="subTitle">
        <el-input v-model="formData.subTitle" show-word-limit maxlength="10" />
      </el-form-item>
      <el-form-item label="抽奖规则" prop="rule">
        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 8 }" v-model="formData.rule" autosize maxlength="1000" show-word-limit />
      </el-form-item>
      <el-form-item label="奖品配置" prop="prizeList">
        <el-table :data="formData.prizeList" border style="width: 650px;" stripe show-overflow-tooltip>
          <el-table-column label="奖品名称" prop="prizeName" width="120"/>
          <el-table-column label="奖品类型" prop="prizeType" width="90" :formatter="formatter"/>
          <el-table-column label="单次中奖发放数量" prop="num" width="150"/>
          <el-table-column label="奖品总数量" prop="totalNum" width="100"/>
          <el-table-column label="奖品图片" width="90">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-image fit="contain" :src="scope.row?.coverUrl" style="width: 50px; height: 50px" preview-teleported hide-on-click-modal />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="100">
            <template #header>
              <span style="margin-right: 5px">操作</span>
              <CreateButton v-show="formData.prizeList.length < 8" title="新增奖品信息" @click="handleCreatePrize"></CreateButton>
            </template>
            <template #default="scope">
              <el-button v-has-perm="'b1i0'" type="danger" :icon="Delete" @click="handleDeletePrize(scope.row)" link title="删除"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div class="lottery-show" >
      <div class="lottery-page">
        <div class="lottery-top"></div>
        <div class="lottery-title"></div>
        <div class="lottery-sub-title"></div>
        <div class="lottery-content"></div>
      </div>
    </div>
    <div>
      <div class="edit-button-footer" v-if="!disabled">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
      <div class="edit-button-footer" v-else>
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
  </div>
  <PrizeForm ref="prizeRef" @reload="addPrize"></PrizeForm>
</template>

<script setup>
import { createApi, selectApi, updateApi } from '@/api/marketing/lottery';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import StoreAllSelect from '@/components/StoreAllSelect.vue';
import { storeApi } from '@/api/product/index.js';
import QuestionTip from "@/components/QuestionTip.vue";
import UploadImage from "@/components/UploadImage.vue";
import {Delete} from "@element-plus/icons-vue";
import CreateButton from "@/components/CreateButton.vue";
import PrizeForm from "@/views/marketing/lottery/PrizeForm.vue";

const prizeRef = ref();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const storeList = ref([]);

const formRules = reactive({
  title: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
  coverUrl: [{ required: true, message: '封面图不能为空', trigger: 'change' }],
  lotteryDay: [{ required: true, message: '单日抽奖次数不能为空', trigger: 'blur' }],
  lotteryTotal: [{ required: true, message: '总抽奖次数不能为空', trigger: 'blur' }],
  winNum: [{ required: true, message: '中奖次数不能为空', trigger: 'blur' }],
  subTitle: [{ required: true, message: '抽奖标题不能为空', trigger: 'blur' }],
  rule: [{ required: true, message: '抽奖规则不能为空', trigger: 'blur' }],
  timeList: [{ required: true, message: '活动时间不能为空', trigger: 'blur', type: 'array' }],
  prizeList: [{ required: true, message: '奖品信息不能为空', trigger: 'change', type: 'array' }]
});

const formData = ref({
  id: null,
  title: null,
  storeId: null,
  lotteryDay: 1,
  lotteryTotal: 1,
  winNum: 1,
  coverUrl: null,
  subTitle: null,
  rule: null,
  timeList: [],
  prizeList: []
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('拼团活动更新成功');
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('拼团活动添加成功');
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

const handleCreatePrize = () => {
  prizeRef.value.openDialog();
}

const handleDeletePrize = (row) => {
}

const addPrize = (data) => {
  formData.value.prizeList.push({...data});
}

const loadStore = () => {
  if (storeList.value.length === 0) {
    storeApi().then((res) => {
      storeList.value = res.data;
    });
  }

};

const formatter = (row, column, cellValue) => {
  if (cellValue === 0) {
    return "谢谢参与"
  }
  return cellValue === 1 ? "优惠券" : "积分";
};

onMounted(() => {
  loadStore();
  const params = route.params;
  if (params.id !== undefined) {
    loading.value = true;
    disabled.value = route.fullPath.startsWith('/marketing/lottery/detail');
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        formData.value.timeList = [res.data.startTime, res.data.endTime];
      })
      .finally(() => {
        loading.value = false;
      });
  }
});
</script>
<style lang="scss" scoped>
.lottery-show {
  padding: 10px;
  .lottery-page {
    background: url("@/assets/images/lottery-bg.jpg") 0 0 / 375px 812px;
    height: 812px;
    width: 375px;
    position: relative;
    border-radius: 10px;
    .lottery-top {
      height: 135px;
      background: url("@/assets/images/lottery-top.png") 0 0 / 375px 135px;
    }
    .lottery-title {
      height: 40px;
    }
  }
}
</style>