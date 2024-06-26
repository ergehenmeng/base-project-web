<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="线路名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="所属区域" prop="areaCode">
        <PoiAreaSelect v-model="formData.areaCode" :clearable="false"></PoiAreaSelect>
      </el-form-item>
      <el-form-item label="预计游玩时间" prop="playTime">
        <el-input v-model="formData.playTime" show-word-limit maxlength="3" placeholder="单位:小时" @keyup="formData.playTime = numberValidator(formData.playTime, 1)" />
      </el-form-item>
      <el-form-item label="封面图" prop="coverList">
        <UploadImageList v-model:file-list="formData.coverList" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="详细介绍" prop="introduceText">
        <WangEditor v-model:html-value="formData.introduce" v-model:text-value="formData.introduceText" :disabled="disabled"></WangEditor>
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
import { createApi, selectApi, updateApi } from '@/api/poi/line';
import { reactive, ref } from 'vue';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import PoiAreaSelect from '@/components/PoiAreaSelect.vue';
import UploadImageList from '@/components/UploadImageList.vue';
import { numberValidator } from '@/utils/common.js'

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const mapRef = ref();
const disabled = ref(false);

const formRules = reactive({
  title: [{ required: true, message: '线路名称不能为空', trigger: 'blur' }],
  areaCode: [{ required: true, message: '所属区域', trigger: 'change' }],
  playTime: [{ required: true, message: '预计游玩时间不能为空', trigger: 'blur' }],
  coverList: [{ required: true, message: '请上传封面图', trigger: 'change' }],
  introduceText: [{ required: true, message: '详细介绍不能为空', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: '',
  areaCode: '',
  playTime: null,
  introduceText: '',
  introduce: '',
  coverList: []
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('点位信息更新成功');
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('点位信息添加成功');
            router.go(-1);
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
    disabled.value = route.fullPath.startsWith('/poi/line/detail');
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        if (res.data.coverUrl) {
          formData.value.coverList = res.data.coverUrl.split(',');
        } else {
          formData.value.coverList = [];
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
});
</script>
