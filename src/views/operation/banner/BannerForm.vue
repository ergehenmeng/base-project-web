<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="520px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" >
      <el-form-item label="标题" prop="title" class="w450">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="轮播类型" prop="bannerType" class="w450">
        <el-select v-model="formData.bannerType">
          <el-option v-for="item in dictList" :key="item.id" :label="item.showValue" :value="item.hiddenValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户端" prop="clientType" class="w450">
        <el-select v-model="formData.clientType">
          <el-option label="PC" value="PC" />
          <el-option label="ANDROID" value="ANDROID" />
          <el-option label="IOS" value="IOS" />
          <el-option label="H5" value="H5" />
          <el-option label="WECHAT" value="WECHAT" />
        </el-select>
      </el-form-item>
      <el-form-item label="上传图片" prop="imgUrl" class="w450">
        <UploadImage v-model:img-url="formData.imgUrl"></UploadImage>
      </el-form-item>
      <el-form-item label="展示时间" prop="showTime" class="w450">
        <div class="w350">
          <el-date-picker
            v-model="formData.showTime"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="截止时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm" time-format="HH:mm"
            class="w350"
          />
        </div>
      </el-form-item>
      <el-form-item label="是否点击" prop="click">
        <el-radio-group v-model="formData.click" @change="changeClick">
          <el-radio :value="true">可点击</el-radio>
          <el-radio :value="false">不可点击</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="跳转地址" prop="jumpUrl" class="w450">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" v-model="formData.jumpUrl" show-word-limit maxlength="100" :disabled="formData.click === false" />
      </el-form-item>
      <el-form-item label="备注" prop="remark" class="w450">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="formData.remark" maxlength="100" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { createApi, updateApi } from '@/api/operation/banner';
import useDictStore from '@/store/dict.js';
import { successMsg } from '@/utils/message';
import UploadImage from '@/components/UploadImage.vue';

const dictStore = useDictStore();
const dictList = dictStore.getDict('banner_type');
const loading = ref(false);
const dialogTitle = ref('');
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  clientType: [{ required: true, message: '请选择客户端', trigger: 'change' }],
  bannerType: [{ required: true, message: '请选择轮播类型', trigger: 'change' }],
  imgUrl: [{ required: true, message: '请上传图片', trigger: 'blur' }],
  click: [{ required: true, message: '是否可点击', trigger: 'change' }],
  showTime: [{ required: true, message: '请选择展示时间', trigger: 'blur' }]
});

const formData = ref({
  id: null,
  title: '',
  clientType: null,
  bannerType: null,
  jumpUrl: '',
  click: false,
  imgUrl: null,
  showTime: [],
  remark: ''
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = '编辑轮播';
    formData.value = { ...row };
    formData.value.showTime = [row.startTime, row.endTime];
  } else {
    dialogTitle.value = '新增轮播';
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    clientType: null,
    bannerType: null,
    jumpUrl: null,
    click: false,
    imgUrl: null,
    showTime: [],
    remark: ''
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      formData.value.startTime = formData.value.showTime[0];
      formData.value.endTime = formData.value.showTime[1];
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('修改轮播成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('新增轮播成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

const changeClick = (value) => {
  if (value === false) {
    formRules.jumpUrl = [{required: false, message: '请输入跳转地址', trigger: 'blur'}];
    formData.value.jumpUrl = '';
  } else {
    formRules.jumpUrl = [{ required: true, message: '请输入跳转地址', trigger: 'blur' }];
  }
};

defineExpose({
  openDialog
});
</script>
