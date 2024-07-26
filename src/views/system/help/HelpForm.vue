<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="问题分类" prop="helpType">
        <el-select v-model="formData.helpType">
          <el-option v-for="item in dictList" :key="item.id" :label="item.showValue" :value="item.hiddenValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio :value="1">显示</el-radio>
          <el-radio :value="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="问" prop="ask">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" v-model="formData.ask" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="答" prop="answerText">
        <WangEditor v-model:html-value="formData.answer" v-model:text-value="formData.answerText"></WangEditor>
      </el-form-item>
    </el-form>
    <div>
      <div class="edit-button-footer">
        <el-button @click="goBack($router)">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { createApi, selectApi, updateApi } from '@/api/system/help';
import useDictStore from '@/store/dict.js';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import { goBack } from '@/utils/common.js';

const route = useRoute();
const router = useRouter();
const dictStore = useDictStore();
const dictList = dictStore.getDict('help_type');
const loading = ref(false);
const formDataRef = ref();

const formRules = reactive({
  ask: [{ required: true, message: "'问'不能为空", trigger: 'blur' }],
  answerText: [{ required: true, message: "'答'不能为空", trigger: 'change' }],
  helpType: [{ required: true, message: '请选择帮助分类', trigger: 'change' }]
});

const formData = ref({
  id: null,
  ask: '',
  answer: '',
  answerText: '',
  helpType: null,
  state: 1
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('修改问答成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('新增问答成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

onMounted(() => {
  const params = route.params;
  if (params.id !== undefined) {
    loading.value = true;
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        formData.value.answerText = res.data.answer;
      })
      .finally(() => {
        loading.value = false;
      });
  }
});
</script>
