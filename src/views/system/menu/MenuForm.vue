<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="500px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
      v-loading="loading">
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="10" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="formData.icon" @focus="selectIcon" ref="inputRef"/>
        <el-popover placement="bottom" :width="300" trigger="click" :virtual-ref="inputRef" ref="popoverRef" virtual-triggering>
          <template #reference>
          </template>
          <el-row>
            <el-col :span="2">
              <Edit />
            </el-col>
          </el-row>
        </el-popover>
      </el-form-item>
      <el-form-item label="菜单级别" prop="grade">
        <el-select v-model="formData.grade">
          <el-option label="导航菜单" :value="1"></el-option>
          <el-option label="按钮菜单" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="路由地址" prop="path">
        <el-input v-model="formData.path" show-word-limit maxlength="50" />
      </el-form-item>
      <el-form-item label="权限URL" prop="subPath">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" v-model="formData.subPath" autosize
          maxlength="500" show-word-limit />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="formData.state">
          <el-option label="启用" :value="true"></el-option>
          <el-option label="禁用" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单类型" prop="displayState">
        <el-select v-model="formData.displayState">
          <el-option label="商户菜单" :value="1" title="表示菜单或按钮只对商户开放"></el-option>
          <el-option label="系统系统" :value="2" title="表示菜单或按钮只对系统人员开放"></el-option>
          <el-option label="通用菜单" :value="3" title="表示菜单或按钮对商户和系统人员都开放"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" v-model="formData.remark" autosize
          maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click=" showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { createApi, updateApi } from '@/api/system/menu';
import { reactive, ref } from 'vue';

const loading = ref(false);
const dialogTitle = ref("");
const formDataRef = ref();
const showDialog = ref(false);
const showIcon = ref(false);
const popoverRef = ref();
const inputRef = ref();
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [
    { required: true, message: '菜单名称不能为空', trigger: 'blur' }
  ],
  grade: [
    { required: true, message: '请选择菜单级别', trigger: 'change' }
  ],
  subPath: [
    { required: true, message: '权限URL不能为空', trigger: 'blur' }
  ],
  state: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  displayState: [
      { required: true, message: '请选择菜单类型', trigger: 'change' }
  ]
})

const formData = ref({
  id: null,
  title: "",
  grade: null,
  state: true,
  icon: "",
  pid: "",
  path: "",
  subPath: "",
  sort: 999,
  displayState: 1,
  remark: ""
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = "编辑角色";
    formData.value = {...row};
  } else {
    dialogTitle.value = "新增角色";
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    roleName: "",
    remark: ""
  }
  formDataRef.value?.resetFields();
}

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value).then(res => {
          ElMessage.success("修改角色成功");
          showIcon.value = false;
          showDialog.value = false;
          emit('reload');
        }).finally(() => {
          loading.value = false;
        })
      } else {
        createApi(formData.value).then(res => {
          ElMessage.success("新增角色成功");
          showIcon.value = false;
          showDialog.value = false;
          emit('reload');
        }).finally(() => {
          loading.value = false;
        })
      }
    }
  })
}

const selectIcon = () => {
  console.log("xxxx")
  showIcon.value = true;
}

defineExpose({
  openDialog
})

</script>
