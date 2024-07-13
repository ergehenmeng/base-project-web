<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="剩余积分"
        ><span style="font-size: 18px">{{ amount }}</span></el-form-item
      >
      <el-form-item label="充值方式" prop="rechargeType">
        <el-radio-group v-model="formData.rechargeType">
          <el-radio label="余额充值" :value="1"></el-radio>
          <el-radio label="扫码充值" :value="2"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="充值金额" prop="amount">
        <el-input v-model="formData.amount" @keyup="formData.amount = numberValidator(formData.amount)" show-word-limit maxlength="8" :placeholder="`充值金额不能低于${minRecharge}元`" />
      </el-form-item>
      <el-form-item label="支付方式" prop="payChannel" v-show="formData.rechargeType === 2">
        <el-radio-group v-model="formData.payChannel">
          <el-radio label="微信" value="WECHAT"></el-radio>
          <el-radio label="支付宝" value="ALIPAY"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave">充值</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { balanceRechargeApi, rechargeDetailApi, scanRechargeApi } from '@/api/merchant/score';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import { goBack, numberValidator } from '@/utils/common.js';

const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const amount = ref(0);
const minRecharge = ref(0);

const formRules = reactive({
  amount: [
    { required: true, message: '请输入充值金额', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (parseFloat(value) < minRecharge.value) {
          callback(new Error(`充值金额不能低于${minRecharge.value}元`));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  rechargeType: [{ required: true, message: '请选择充值方式', trigger: 'change' }],
  payChannel: [{ required: true, message: '请选择支付方式', trigger: 'change' }]
});

const formData = ref({
  payChannel: 'WECHAT',
  rechargeType: 1,
  amount: null
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.rechargeType === 1) {
        balanceRechargeApi(formData.value)
          .then(() => {
            successMsg('积分充值成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        scanRechargeApi(formData.value)
          .then(({ data }) => {
            console.log('待完成扫码展示', data);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

onMounted(async () => {
  const { data } = await rechargeDetailApi();
  amount.value = data.amount;
  minRecharge.value = parseFloat(data.minRecharge);
});
</script>
