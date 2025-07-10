<template>
  <el-dialog title="编辑任务" v-model="showDialog" width="520px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="任务名称" prop="title" class="w450">
        <el-input v-model="formData.title" show-word-limit maxlength="30" />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio label="启用" :value="true"></el-radio>
          <el-radio label="禁用" :value="false"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="日志记录" prop="log">
        <el-radio-group v-model="formData.log">
          <el-radio label="开启" :value="true"></el-radio>
          <el-radio label="关闭" :value="false"></el-radio>
        </el-radio-group>
        <QuestionTip content="注意：针对执行频率高且业务逻辑简单的定时任务建议关闭日志记录"/>
      </el-form-item>
      <el-form-item label="类名" prop="beanName" class="w450">
        <el-input v-model="formData.beanName" show-word-limit maxlength="30" disabled />
      </el-form-item>
      <el-form-item label="方法名" prop="methodName" class="w450">
        <el-input v-model="formData.methodName" show-word-limit maxlength="30" disabled />
      </el-form-item>
      <el-form-item label="方法入参" prop="args" class="w450">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="formData.args" maxlength="300" show-word-limit />
      </el-form-item>
      <el-form-item label="cron表达式" prop="cronExpression" class="w450">
        <el-input v-model="formData.cronExpression" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="报警邮箱" prop="alarmEmail" class="w450">
        <el-input v-model="formData.alarmEmail" maxlength="30" show-word-limit />
      </el-form-item>
      <el-form-item label="锁时间(ms)" prop="lockTime" class="w450">
        <el-input v-model="formData.lockTime" maxlength="10" show-word-limit placeholder="30000~3600000ms之间" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="备注信息" prop="remark" class="w450">
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
import { updateApi } from '@/api/config/task';
import { successMsg } from '@/utils/message';
import QuestionTip from '@/components/QuestionTip.vue'

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
  state: [{ required: true, message: '状态不能为空', trigger: 'change' }],
  log: [{ required: true, message: '日志不能为空', trigger: 'change' }],
  beanName: [{ required: true, message: '类名不能为空', trigger: 'blur' }],
  methodName: [{ required: true, message: '方法名不能为空', trigger: 'blur' }],
  alarmEmail: [{ required: true, message: '报警邮箱不能为空', trigger: 'blur' }],
  lockTime: [
    { required: true, message: '锁时间不能为空', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const number = parseInt(value);
        if (number < 30000 || number > 3600000) {
          callback(new Error('锁持有时间应在30000~3600000ms之间'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

const formData = ref({
  id: null,
  title: null,
  state: null,
  log: null,
  beanName: '',
  methodName: '',
  args: '',
  cronExpression: '',
  alarmEmail: '',
  lockTime: 30000,
  remark: ''
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  formData.value = { ...row };
};

const resetForm = () => {
  formData.value = {
    id: null,
    title: null,
    state: null,
    log: null,
    beanName: '',
    methodName: '',
    args: '',
    cronExpression: '',
    alarmEmail: '',
    lockTime: 30000,
    remark: ''
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      updateApi(formData.value)
        .then(() => {
          successMsg('短信模板更新成功');
          showDialog.value = false;
          emit('reload');
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

defineExpose({
  openDialog
});
</script>
