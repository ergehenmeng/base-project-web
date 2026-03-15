<template>
  <div class="edit-content">
    <el-divider />
    <el-row>
      <el-col :span="8">
        <el-statistic title="可用积分" :value="amountValue"> </el-statistic>
        <el-button v-has-perm="'KVu0'" type="primary" style="margin-top: 10px" @click="handleRecharge" size="small"> 充值 </el-button>
        <el-button v-has-perm="'5Vu0'" type="primary" style="margin-top: 10px" @click="handleWithdraw" size="small"> 提现 </el-button>
      </el-col>
      <el-col :span="8">
        <el-statistic title="支付冻结积分" :value="payFreezeRef"> </el-statistic>
        <el-button v-has-perm="'ZVu0'" type="primary" style="margin-top: 10px" @click="handleFreeze" size="small"> 冻结记录 </el-button>
      </el-col>
      <el-col :span="8">
        <el-statistic title="提现冻结积分" :value="withdrawFreezeRef"> </el-statistic>
      </el-col>
    </el-row>
  </div>
  <WithdrawForm ref="withdrawFormRef" @reload="reload"></WithdrawForm>
</template>
<script setup>
import { accountApi } from '@/api/merchant/score';
import { useTransition } from '@vueuse/core';
import usePermStore from '@/store/perm';
import { useRouter } from 'vue-router';
import WithdrawForm from '@/views/merchant/score/WithdrawForm.vue';

const router = useRouter();
const permStore = usePermStore();
const selectAuth = permStore.hasAuth('JVu0');
const amountRef = ref(0.0);
const payFreezeRef = ref(0);
const withdrawFreezeRef = ref(0);
const withdrawFormRef = ref();

const amountValue = useTransition(amountRef.value, {
  duration: 500
});

onMounted(async () => {
  if (!selectAuth) {
    return;
  }
  const { data: { amount, payFreeze, withdrawFreeze } } = await accountApi();
  amountRef.value = amount;
  payFreezeRef.value = payFreeze;
  withdrawFreezeRef.value = withdrawFreeze;
});

const handleWithdraw = () => {
  withdrawFormRef.value.openDialog({ useAmount: amountRef.value });
};

const handleRecharge = () => {
  router.push('/merchant/score/recharge');
};

const handleFreeze = () => {
  router.push('/merchant/scoreLog');
};

const reload = () => {
  router.go(0);
};
</script>

<style lang="scss" scoped>
.el-statistic {
  --el-statistic-content-font-size: 30px;
}

.el-col {
  text-align: center;
}
</style>
