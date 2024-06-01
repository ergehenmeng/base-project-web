<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
             v-loading="loading">
      <el-form-item label="资讯标题" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20"/>
      </el-form-item>
      <el-form-item label="描述信息" prop="depict">
        <el-input v-model="formData.depict" show-word-limit maxlength="50"/>
      </el-form-item>
      <el-form-item label="图集" prop="image">
        <UploadImageList v-model="formData.image"></UploadImageList>
      </el-form-item>
      <el-form-item label="视频" prop="video">
        <el-input v-model="formData.video" show-word-limit maxlength="200"/>
      </el-form-item>
      <el-form-item label="详细信息" prop="contentText">
        <el-input v-model="formData.contentText" type="textarea" style="display: none;"/>
        <WangEditor v-model:html-value="formData.content" v-model:text-value="formData.contentText"></WangEditor>
      </el-form-item>
    </el-form>
    <div class="edit-footer">
      <div class="edit-button-footer">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {createApi, updateApi, selectApi} from '@/api/operation/notice';
import {reactive, ref} from 'vue';
import WangEditor from "@/components/WangEditor.vue";
import {useRoute, useRouter} from "vue-router";
import {successMsg} from "@/utils/message.js";
import UploadImageList from "@/components/UploadImageList.vue";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);

const formRules = reactive({
  title: [
    {required: true, message: "标题不能为空", trigger: 'blur'}
  ],
  contentText: [
    {required: true, message: "内容不能为空", trigger: 'change'}
  ],
  noticeType: [
    {required: true, message: '请选择公告类型', trigger: 'change'}
  ]
})

const formData = ref({
  id: null,
  title: "",
  depict: "",
  content: "",
  contentText: "",
  image: [],
  video: ""
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value).then(() => {
          successMsg("公告更新成功");
          showDialog.value = false;
          router.go(-1);
        }).finally(() => {
          loading.value = false;
        })
      } else {
        createApi(formData.value).then(() => {
          successMsg("公告添加成功");
          showDialog.value = false;
          router.go(-1);
        }).finally(() => {
          loading.value = false;
        })
      }
    }
  })
}

onMounted(() => {
  const params = route.params;
  if (params.id !== undefined) {
    loading.value = true;
    selectApi(params).then(res => {
      formData.value = res.data;
      formData.value.answerText = res.data.answer;
    }).finally(() => {
      loading.value = false;
    })
  }
})

</script>

