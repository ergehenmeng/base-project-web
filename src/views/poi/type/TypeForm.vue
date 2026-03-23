<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="450px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="类型名称" prop="title" class="w380">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="所属区域" prop="areaCode" class="w380">
        <PoiAreaSelect v-model="formData.areaCode" />
      </el-form-item>
      <el-form-item prop="iconClass">
        <template #label><span>图标<QuestionTip content="请输入https://remixicon.com图标class名称，如: ri-map-pin-line"/></span></template>
        <div class="icon-config">
          <el-input v-model="formData.iconClass" placeholder="输入remixicon类名" class="icon-input" />
          <el-color-picker v-model="formData.iconColor" show-alpha />
          <div class="icon-preview" v-if="formData.iconClass" :style="{ backgroundColor: formData.iconColor }">
            <i :class="formData.iconClass" style="color: #fff"></i>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="排序" prop="sort" class="w380">
        <el-input v-model="formData.sort" placeholder="不填写默认1" maxlength="3" onkeyup="this.value=this.value.replace(/\D/g,'')" />
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
import { createApi, updateApi } from '@/api/poi/type';
import { successMsg } from '@/utils/message.js';
import PoiAreaSelect from '@/components/PoiAreaSelect.vue';
import QuestionTip from '@/components/QuestionTip.vue';

const dialogTitle = ref('');
const formDataRef = ref();
const showDialog = ref(false);
const loading = ref(false);
const disabled = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }],
  areaCode: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
  iconClass: [{ required: true, message: '图标class不能为空', trigger: 'blur' }]
});

const formData = ref({
  id: null,
  title: null,
  areaCode: null,
  icon: null,
  iconClass: null,
  iconColor: '#409EFF',
  sort: null
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = '编辑点位类型';
    const iconStr = row.icon || '';
    const [iconClass, iconColor] = iconStr.split('|');
    formData.value = {
      ...row,
      iconClass: iconClass || '',
      iconColor: iconColor || '#409EFF'
    };
  } else {
    dialogTitle.value = '新增点位类型';
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    title: null,
    areaCode: null,
    icon: null,
    iconClass: null,
    iconColor: '#409EFF',
    sort: null
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      const submitData = {
        ...formData.value,
        icon: `${formData.value.iconClass}|${formData.value.iconColor}`
      };
      if (formData.value.id) {
        updateApi(submitData)
          .then(() => {
            successMsg('点位信息更新成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(submitData)
          .then(() => {
            successMsg('点位信息添加成功');
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

defineExpose({
  openDialog
});
</script>
<style scoped>
.icon-config {
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon-input {
  width: 200px;
}
.icon-preview {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}
.icon-preview i {
  font-size: 16px;
}
</style>
