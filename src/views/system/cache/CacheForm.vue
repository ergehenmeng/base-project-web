<template>
  <el-dialog v-model="showDialog" width="520px" draggable align-center :close-on-click-modal="false">
    <template #header>
      <span>查询/删除 <QuestionTip content="注意：目前只支持String类型的缓存删除" /></span>
    </template>
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="key" prop="key" class="w450">
        <el-select @change="queryHandle" v-model="formData.key" placeholder="请输入要查询的key" filterable remote reserve-keyword :loading="keyLoading" :remote-method="loadKeyHandle">
          <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="value" prop="value" class="w450">
        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 5 }" v-model="formData.value" readonly />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="danger" @click="deleteHandle">删除</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { queryApi, deleteApi, scanApi } from '@/api/system/cache';
import { confirmMsg, successMsg } from '@/utils/message.js';
import { renderMsg } from '@/utils/common.js';
import QuestionTip from '@/components/QuestionTip.vue';

const loading = ref(false);
const keyLoading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const options = ref([]);

const formRules = reactive({
  key: [{ required: true, message: 'key不能为空', trigger: 'blur' }]
});

const formData = ref({
  key: null,
  value: null
});

const openDialog = () => {
  showDialog.value = true;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    key: null,
    value: null
  };
  formDataRef.value?.resetFields();
};

const loadKeyHandle = (query) => {
  if (query) {
    keyLoading.value = true;
    scanApi({ key: query })
      .then(({ data }) => {
        options.value = data.map((item) => {
          return { value: item, label: item };
        });
      })
      .finally(() => {
        keyLoading.value = false;
      });
  } else {
    options.value = [];
  }
};

const queryHandle = (value) => {
  if (value) {
    loading.value = true;
    queryApi({ key: value })
      .then(({ data }) => {
        formData.value.value = data;
      })
      .catch(() => {
        formData.value.value = null;
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    formData.value.value = null;
  }
};

const deleteHandle = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      const msg = renderMsg(['确定要删除', () => formData.value.key, '吗?']);
      confirmMsg(msg, () => {
        loading.value = true;
        deleteApi({ key: formData.value.key })
          .then(() => {
            successMsg('删除成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      });
    }
  });
};

defineExpose({
  openDialog
});
</script>
