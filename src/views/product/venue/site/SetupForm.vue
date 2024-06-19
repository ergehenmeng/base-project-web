<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="设置日期" prop="configDate">
        <div style="width: 350px">
          <el-date-picker type="daterange" value-format="YYYY-MM-DD" :disabled-date="disableBeforeDate" v-model="formData.configDate" style="width: 350px"></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="周期" prop="week">
        <el-checkbox-group v-model="formData.week">
          <el-checkbox label="星期一" :value="1"></el-checkbox>
          <el-checkbox label="星期二" :value="2"></el-checkbox>
          <el-checkbox label="星期三" :value="3"></el-checkbox>
          <el-checkbox label="星期四" :value="4"></el-checkbox>
          <el-checkbox label="星期五" :value="5"></el-checkbox>
          <el-checkbox label="星期六" :value="6"></el-checkbox>
          <el-checkbox label="星期日" :value="7"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="价格配置" prop="priceList">
        <TimePhase v-model="formData.priceList"></TimePhase>
      </el-form-item>
    </el-form>
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
</template>

<script setup>
import { setupApi } from '@/api/product/site';
import { reactive, ref } from 'vue';
import { successMsg } from '@/utils/message';
import { disableBeforeDate } from '@/utils/common.js';
import TimePhase from '@/components/TimePhase.vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);

const formRules = reactive({
  configDate: [{ required: true, message: '设置日期不能为空', trigger: 'blur', type: 'array' }],
  week: [{ required: true, message: '请选择周期', trigger: 'change', type: 'array' }],
  priceList: [{ required: true, message: '销售价格不能为空', trigger: 'change', type: 'array' }]
});

const formData = ref({
  venueSiteId: '',
  configDate: [],
  week: [],
  priceList: []
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      formData.value.startDate = formData.value.configDate[0];
      formData.value.endDate = formData.value.configDate[1];
      loading.value = true;
      setupApi(formData.value)
        .then(() => {
          successMsg('场地价格配置成功');
          router.go(-1);
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

onMounted(() => {
  const id = route.params.id;
  if (id) {
    formData.value.venueSiteId = id;
  }
});
</script>
