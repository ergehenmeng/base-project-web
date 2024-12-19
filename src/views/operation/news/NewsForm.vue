<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :validate-on-rule-change="false">
      <el-form-item label="资讯标题" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="描述信息" prop="depict" v-if="showField.includeDepict">
        <el-input type="textarea" v-model="formData.depict" :autosize="{ minRows: 2, maxRows: 3 }" show-word-limit maxlength="50" />
      </el-form-item>
      <el-form-item label="标签" prop="tagList" v-if="showField.includeTag">
        <CustomTag v-model="formData.tagList" :width="350" />
      </el-form-item>
      <el-form-item label="图集" prop="imageList" v-if="showField.includeImage">
        <UploadImageList v-model:file-list="formData.imageList"></UploadImageList>
      </el-form-item>
      <el-form-item label="视频" prop="video" v-if="showField.includeVideo">
        <el-input type="textarea" v-model="formData.video" placeholder="视频url地址"  :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit maxlength="200" />
      </el-form-item>
      <el-form-item label="留言" prop="commentSupport" >
        <el-radio-group v-model="formData.commentSupport">
          <el-radio :value="true">开启</el-radio>
          <el-radio :value="false">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="详细信息" prop="contentText">
        <WangEditor v-model:html-value="formData.content" v-model:text-value="formData.contentText"></WangEditor>
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
import { configApi, createApi, selectApi, updateApi } from '@/api/operation/news';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { errorMsg, successMsg } from '@/utils/message.js';
import UploadImageList from '@/components/UploadImageList.vue';
import { goBack } from '@/utils/common.js';
import CustomTag from '@/components/CustomTag.vue'

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();

const formRules = reactive({
  title: [{ required: true, message: '资讯标题不能为空', trigger: 'blur' }],
  contentText: [{ required: true, message: '详细信息不能为空', trigger: 'blur' }],
  commentSupport: [{ required: true, message: '请选择是否开启留言', trigger: 'change' }]
});

const showField = ref({
  includeDepict: false,
  includeImage: false,
  includeVideo: false,
  includeTag: false
});

const formData = ref({
  id: null,
  title: '',
  depict: '',
  content: '',
  commentSupport: false,
  contentText: '',
  imageList: [],
  tagList: [],
  video: '',
  code: ''
});

const handleSave = () => {
  console.log('formData', formData.value.tagList)
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('资讯更新成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('资讯添加成功');
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
  const query = route.query;
  if (!query.code) {
    errorMsg('请选择资讯分类');
    return;
  }
  formData.value.code = query.code;
  configApi({ code: query.code }).then((res) => {
    const { includeDepict, includeImage, includeVideo, includeTag } = res.data;
    showField.value.includeTag = includeTag;
    if (includeDepict === true) {
      showField.value.includeDepict = true;
      formRules.depict = [{ required: true, message: '资讯描述不能为空', trigger: 'blur' }];
    }
    if (includeImage === true) {
      showField.value.includeImage = true;
      formRules.imageList = [{ required: true, message: '请上传图片', trigger: 'change' }];
    }
    if (includeVideo === true) {
      showField.value.includeVideo = true;
      formRules.video = [{ required: true, message: '请输入视频地址', trigger: 'blur' }];
    }
    if (params.id) {
      loading.value = true;
      selectApi(params)
        .then((res) => {
          formData.value = res.data;
          formData.value.answerText = res.data.answer;
          const image = res.data.image;
          if (image) {
            formData.value.imageList = image.split(',');
          } else {
            formData.value.imageList = [];
          }
          const tagName = res.data.tagName;
          if (tagName) {
            formData.value.tagList = tagName.split(',');
          } else {
            formData.value.tagList = [];
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
});
</script>
