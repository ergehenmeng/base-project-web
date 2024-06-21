<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="活动日期" prop="activityDate">
        <div style="width: 350px">
          <el-date-picker type="date" value-format="YYYY-MM-DD" v-model="formData.nowDate" style="width: 350px" :disabled="formData.id !== null"></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="活动时间" prop="activityTime">
        <el-input v-model="formData.activityTime" show-word-limit maxlength="20" placeholder="18:00~22:00" />
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <UploadImage v-model="formData.coverUrl"></UploadImage>
      </el-form-item>
      <el-form-item label="活动地址" prop="address">
        <el-input v-model="formData.address" show-word-limit maxlength="100" />
      </el-form-item>
      <el-form-item label="公告内容" prop="introduceText">
        <WangEditor v-model:html-value="formData.introduce" v-model:text-value="formData.introduceText"></WangEditor>
      </el-form-item>
    </el-form>
    <div>
      <div class="edit-button-footer">
        <el-button @click="$router.back()">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { createApi, selectApi, updateApi } from '@/api/operation/activity';
import { reactive, ref } from 'vue';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import UploadImage from '@/components/UploadImage.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();

const formRules = reactive({
  title: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
  activityTime: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
  address: [{ required: true, message: '活动地点不能为空', trigger: 'blur' }],
  coverUrl: [{ required: true, message: '请上传封面', trigger: 'blur' }],
  introduceText: [{ required: true, message: '活动详细介绍不能为空', trigger: 'blur' }]
});

const formData = ref({
  id: null,
  title: '',
  nowDate: null,
  activityTime: null,
  introduce: '',
  introduceText: '',
  address: null,
  coverUrl: null
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('活动更新成功');
            router.back();
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('活动添加成功');
            router.back();
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
        formData.value.introduceText = res.data.introduce;
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    formData.value.nowDate = route.query.nowDate;
  }
});
</script>
