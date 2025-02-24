<template>
  <el-dialog title="提现" v-model="showDialog" width="400px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="left" label-width="auto" v-loading="loading">
      <el-form-item label="可用积分">
        <span style="font-size: 20px">{{ formData.useAmount }}</span>
      </el-form-item>
      <el-form-item label="提现金额" prop="amount" style="width: 330px">
        <el-input v-model="formData.amount" @keyup="formData.amount = numberValidator(formData.amount)" maxlength="6" :placeholder="`最低提现金额为${minWithdraw}元`">
          <template #suffix>
            <QuestionTip content="100积分可以兑换1元"></QuestionTip>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleApply">申请提现</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { withdrawApplyApi, withdrawDetailApi } from '@/api/merchant/score';
import { successMsg } from '@/utils/message.js';
import { numberValidator } from '@/utils/common.js';
import QuestionTip from '@/components/QuestionTip.vue';
import useUserStore from '@/store/user.js';
import Big from 'big.js'

const loading = ref(false);
const emit = defineEmits(['reload']);
const userStore = useUserStore();
const withdrawAuth = userStore.hasAuth('5Vu0');

const formRules = reactive({
  amount: [
    { required: true, message: '请输入提现金额', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (parseFloat(value) < minWithdraw.value) {
          callback(new Error(`提现金额不能低于${minWithdraw.value}元`));
        } else if (new Big(parseFloat(value)).times(100).toNumber() > formData.value.useAmount) {
          callback(new Error(`可提现金额不足`));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});
const minWithdraw = ref(0);
const formData = ref({
  amount: 0,
  useAmount: 0
});

const formDataRef = ref();
const showDialog = ref(false);

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  formData.value = { ...row };
};

const resetForm = () => {
  formData.value = {
    amount: 0,
    useAmount: 0
  };
  formDataRef.value?.resetFields();
};

const handleApply = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      withdrawApplyApi(formData.value)
        .then(() => {
          successMsg('提现申请成功');
          showDialog.value = false;
          emit('reload');
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

onMounted(async () => {
  if (withdrawAuth) {
    const { data } = await withdrawDetailApi();
    minWithdraw.value = parseFloat(data);
  }
});

defineExpose({
  openDialog
});
</script>
