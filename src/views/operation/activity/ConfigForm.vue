<template>
  <div class="edit-content">
    <el-divider/>
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
             v-loading="loading">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20"/>
      </el-form-item>
      <el-form-item label="活动日期" prop="activityDate">
        <div style="width: 350px;">
          <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="formData.activityDate" style="width: 350px;"></el-date-picker>
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
      <el-form-item label="活动时间" prop="activityTime">
        <el-input v-model="formData.activityTime" show-word-limit maxlength="20" placeholder="18:00~22:00"/>
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <UploadImage v-model="formData.coverUrl"></UploadImage>
      </el-form-item>
      <el-form-item label="活动地址" prop="address">
        <el-input v-model="formData.address" show-word-limit maxlength="100"/>
      </el-form-item>
      <el-form-item label="公告内容" prop="introduceText">
        <el-input v-model="formData.introduceText" type="textarea" style="display: none;"/>
        <WangEditor v-model:html-value="formData.introduce" v-model:text-value="formData.introduceText"></WangEditor>
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
import { configApi } from '@/api/operation/activity';
import {reactive, ref} from 'vue';
import WangEditor from "@/components/WangEditor.vue";
import { useRouter} from "vue-router";
import {successMsg} from "@/utils/message.js";
import UploadImage from "@/components/UploadImage.vue";

const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);

const formRules = reactive({
  title: [
    {required: true, message: "活动名称不能为空", trigger: 'blur'}
  ],
  week: [
    {required: true, message: "请选择周期", trigger: 'blur', type: "array"}
  ],
  activityDate: [
    {required: true, message: "请选择活动日期", trigger: 'blur', type: "array"}
  ],
  activityTime: [
    {required: true, message: '请选择活动时间', trigger: 'blur'}
  ],
  address: [
    {required: true, message: "活动地点不能为空", trigger: 'blur'}
  ],
  coverUrl: [
    {required: true, message: "请上传封面", trigger: 'blur'}
  ],
  introduceText: [
    {required: true, message: "活动详细介绍不能为空", trigger: 'blur'}
  ]
})

const formData = ref({
  title: "",
  week: [],
  activityTime: null,
  activityDate: [],
  introduce: "",
  introduceText: "",
  address: null,
  coverUrl: null,
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      formData.value.startDate = formData.value.activityDate[0]
      formData.value.endDate = formData.value.activityDate[1]
      configApi(formData.value).then(() => {
        successMsg("活动添加成功");
        showDialog.value = false;
        router.go(-1);
      }).finally(() => {
        loading.value = false;
      })
    }
  })
}

</script>

