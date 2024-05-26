<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
             v-loading="loading">
      <el-form-item label="问题分类" prop="helpType">
        <el-select v-model="formData.helpType">
          <el-option v-for="item in dictList" :key="item.id" :label="item.showValue" :value="item.hiddenValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="formData.state">
          <el-option label="显示" :value="1"/>
          <el-option label="隐藏" :value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="问" prop="ask">
        <el-input v-model="formData.ask" show-word-limit maxlength="50"/>
      </el-form-item>
      <el-form-item label="答" prop="answerText">
        <el-input v-model="formData.answerText" type="textarea" style="display: none;"/>
        <WangEditor v-model:html-value="formData.answer" v-model:text-value="formData.answerText"></WangEditor>
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
import { createApi, updateApi, selectApi } from '@/api/system/help';
import { reactive, ref } from 'vue';
import useDictStore from "@/store/dict.js";
import WangEditor from "@/components/WangEditor.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const dictStore = useDictStore();
const dictList = dictStore.getDict('help_type');
const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);

const formRules = reactive({
  ask: [
    {required: true, message: "'问'不能为空", trigger: 'blur'}
  ],
  answerText: [
    {required: true, message: "'答'不能为空", trigger: 'change'}
  ],
  state: [
    {required: true, message: '状态不能为空', trigger: 'change'}
  ],
  helpType: [
    {required: true, message: '帮助分类不能为空', trigger: 'change'}
  ]
})

const formData = ref({
  id: null,
  ask: "",
  answer: "",
  answerText: "",
  helpType: null,
  state: 1
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value).then(res => {
          ElMessage.success("修改问答成功");
          showDialog.value = false;
          router.go(-1);
        }).finally(() => {
          loading.value = false;
        })
      } else {
        createApi(formData.value).then(res => {
          ElMessage.success("新增问答成功");
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
  loading.value = true;
  selectApi(params).then(res => {
    formData.value = res.data;
    formData.value.answerText = res.data.answer;
  }).finally(() => {
    loading.value = false;
  })
})

</script>

