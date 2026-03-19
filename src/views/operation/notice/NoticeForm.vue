<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <UploadImage v-model:img-url="formData.coverUrl"></UploadImage>
      </el-form-item>
      <el-form-item label="公告类型" prop="noticeType">
        <el-select v-model="formData.noticeType">
          <el-option v-for="item in dictList" :key="item.id" :label="item.showValue" :value="item.hiddenValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <WangEditor v-model:html-value="formData.content" ></WangEditor>
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
import { createApi, selectApi, updateApi } from '@/api/operation/notice';
import useDictStore from '@/store/dict.js';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import { goBack } from '@/utils/common.js';
import UploadImage from '@/components/UploadImage.vue'

const route = useRoute();
const router = useRouter();
const dictStore = useDictStore();
const dictList = dictStore.getDict('notice_type');
const loading = ref(false);
const formDataRef = ref();

const formRules = reactive({
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '内容不能为空', trigger: 'change' }],
  coverUrl: [{ required: true, message: '请上传封面图', trigger: 'change' }],
  noticeType: [{ required: true, message: '请选择公告类型', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: '',
  coverUrl: null,
  content: '',
  noticeType: null
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('公告更新成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('公告添加成功');
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
      })
      .finally(() => {
        loading.value = false;
      });
  }
});
</script>
