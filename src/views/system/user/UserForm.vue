<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="520px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="昵称" prop="nickName" class="w450">
        <el-input v-model="formData.nickName" show-word-limit maxlength="10" />
      </el-form-item>
      <el-form-item label="账户名" prop="userName" class="w450">
        <el-input v-model="formData.userName" show-word-limit maxlength="15" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile" class="w450">
        <el-input v-model="formData.mobile" maxlength="11" >
          <template #suffix><QuestionTip content="提示：手机号后8位为初始密码"/></template>
        </el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds" class="w450">
        <el-select v-model="formData.roleIds" filterable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3" clearable title="注意：此处只显示系统角色，不显示商户角色">
          <el-option v-for="role in roleList" :label="role.desc" :value="role.value" :key="role.value"/>
          <template v-if="roleList.length === 0 && roleAuth" #footer>
            <div style="display: flex; justify-content: center;">
              <el-link type="primary" @click="addRoleHandle" underline="never">添加角色</el-link>
            </div>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptCode" class="w450">
        <el-tree-select check-strictly :props="defaultProps" :data="deptData" v-model="formData.deptCode" default-expand-all clearable>
        </el-tree-select>
      </el-form-item>
      <el-form-item label="数据权限" prop="dataType" class="w450">
        <el-select v-model="formData.dataType" clearable title="注意：数据权限需要按实际需求进行开发，且自定义数据权限需要手动选择">
          <el-option label="本人数据" :value="1"></el-option>
          <el-option label="本部门数据" :value="2"></el-option>
          <el-option label="本部门及子部门数据" :value="4"></el-option>
          <el-option label="所有数据" :value="8"></el-option>
          <el-option label="自定义数据" :value="16"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark" class="w450">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" v-model="formData.remark" maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave" v-if="!disabled">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { createApi, roleListApi, selectApi, updateApi } from '@/api/system/user'
import { listApi } from '@/api/system/dept';
import { successMsg } from '@/utils/message.js';
import QuestionTip from '@/components/QuestionTip.vue'
import useUserStore from '@/store/user.js'
import { useRouter } from 'vue-router'

const router = useRouter();
const loading = ref(false);
const dialogTitle = ref('');
const roleList = ref([]);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);
const disabled = ref(false);
const userStore = useUserStore();
const roleAuth = userStore.hasAuth('KjK0');

const formRules = reactive({
  nickName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
  mobile: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  userName: [
    { required: true, message: '账户名不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '账户名长度6~15字符', trigger: 'blur'}
  ],
  roleIds: [{ required: true, message: '请选择角色', trigger: 'change', type: 'array' }]
});

const deptData = ref([]);

const defaultProps = {
  label: 'title',
  value: 'code',
  children: 'children'
};

const formData = ref({
  id: null,
  nickName: '',
  userName: '',
  mobile: '',
  deptCode: '',
  roleIds: [],
  dataType: null,
  remark: ''
});

const openDialog = (row) => {
  resetForm();
  if (row.id) {
    if (row.type === "edit") {
      dialogTitle.value = '编辑用户';
      disabled.value = false;
    } else {
      dialogTitle.value = '查看用户';
      disabled.value = true;
    }
    loading.value = true
    selectApi({ id: row.id}).then(res => {
      formData.value = res.data;
    }).finally(() => {
      loading.value = false;
    })
  } else {
    dialogTitle.value = '新增用户';
    disabled.value = false;
  }
  showDialog.value = true;
};

const resetForm = () => {
  formData.value = {
    id: null,
    nickName: '',
    userName: '',
    mobile: '',
    deptCode: '',
    roleIds: [],
    dataType: null,
    remark: ''
  };
  formDataRef.value?.resetFields();
};

const addRoleHandle = () => {
  router.push('/sys/role');
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('修改用户成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('新增用户成功');
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

const loadingRoleList = () => {
  roleListApi().then((res) => {
    roleList.value = res.data;
  });
};

const loadingDeptList = () => {
  listApi().then((res) => {
    deptData.value = res.data;
  });
}

onMounted(() => {
  loadingRoleList();
  loadingDeptList();
})

defineExpose({
  openDialog
});
</script>
