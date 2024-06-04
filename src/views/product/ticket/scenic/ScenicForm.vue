<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
             v-loading="loading" >
      <el-form-item label="景区名称" prop="scenicName">
        <el-input v-model="formData.scenicName" show-word-limit maxlength="20"/>
      </el-form-item>
      <el-form-item label="景区等级" prop="level">
        <el-select v-model="formData.level">
          <el-option label="5A" :value="5"/>
          <el-option label="4A" :value="4"/>
          <el-option label="3A" :value="3"/>
          <el-option label="无" :value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="营业时间" prop="openTime">
        <el-input v-model="formData.openTime" show-word-limit maxlength="20"/>
      </el-form-item>
      <el-form-item label="景区电话" prop="phone">
        <el-input v-model="formData.phone" show-word-limit maxlength="12"/>
      </el-form-item>
      <el-form-item label="标签" prop="tag">
        <el-select v-model="formData.tag">
          <el-option label="5A" :value="5"/>
          <el-option label="4A" :value="4"/>
          <el-option label="3A" :value="3"/>
          <el-option label="无" :value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="省市县" prop="countyId">
        <AreaSelect v-model="formData.countyId"></AreaSelect>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input v-model="formData.detailAddress" show-word-limit maxlength="100"/>
      </el-form-item>
      <el-form-item label="经纬度" prop="latitude">
        <el-input v-model="formData.latitude" show-word-limit disabled class="w100"/> -
        <el-input v-model="formData.longitude" show-word-limit disabled class="w100"/>
        &nbsp;
        <el-button :icon="Search" type="primary">选择</el-button>
      </el-form-item>
      <el-form-item label="描述信息" prop="depict">
        <el-input v-model="formData.depict" show-word-limit maxlength="50"/>
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <UploadImageList  v-model:file-list="formData.coverList"></UploadImageList>
      </el-form-item>
      <el-form-item label="详细介绍" prop="introduceText">
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
import {createApi, updateApi, selectApi} from '@/api/product/scenic';
import {reactive, ref} from 'vue';
import WangEditor from "@/components/WangEditor.vue";
import {useRoute, useRouter} from "vue-router";
import {successMsg} from "@/utils/message.js";
import {phoneValidator} from "@/utils/common.js";
import UploadImageList from "@/components/UploadImageList.vue";
import AreaSelect from "@/components/AreaSelect.vue";
import {Search} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);

const formRules = reactive({
  scenicName: [
    {required: true, message: "景区名称不能为空", trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ],
  level: [
    {required: true, message: "请选择景区等级", trigger: 'change'}
  ],
  phone: [
    {required: true, validator: phoneValidator, trigger: 'blur'},
  ],
  detailAddress: [
    {required: true, message: "详细地址不能为空", trigger: 'blur'},
    {min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur'}
  ],
  longitude: [
    {required: true, message: "请选择经纬度", trigger: 'blur'},
  ],
  latitude: [
    {required: true, message: "请选择经纬度", trigger: 'blur'},
  ],
  depict: [
    {required: true, message: "描述信息不能为空", trigger: 'blur'},
    {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
  ],
  coverList: [
    {required: true, message: "请上传封面图", trigger: 'change', type: "array"}
  ],
  introduceText: [
    {required: true, message: "详细介绍不能为空", trigger: 'change'}
  ]
})

const formData = ref({
  id: null,
  scenicName: "",
  level: 0,
  phone: "",
  countyId: [],
  detailAddress: null,
  longitude: null,
  latitude: null,
  depict: null,
  coverList: [],
  introduceText: null,
  introduce: null
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

