<template>
  <div class="edit-content">
    <el-divider />
    <el-row>
      <el-col :span="8">
        <el-statistic title="可提现金额" :value="amountValue" precision="2">
        </el-statistic>
        <el-button v-has-perm="'izu0'" type="primary" style="margin-top: 10px;" @click="handleWithdraw" size="small">提现</el-button>
      </el-col>
      <el-col :span="8">
        <el-statistic title="支付冻结金额" :value="payFreeze" precision="2">
        </el-statistic>
      </el-col>
      <el-col :span="8">
        <el-statistic title="提现冻结金额" :value="withdrawFreeze" precision="2">
        </el-statistic>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { accountApi } from '@/api/merchant/account';
import { useTransition } from '@vueuse/core'
import useUserStore from '@/store/user.js'

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('Xzu0');
const amount = ref(0.00);
const payFreeze = ref(0);
const withdrawFreeze = ref(0);
const amountValue = useTransition(amount, {
  duration: 500,
})

onMounted(async () => {
  if (!selectAuth) {
    return;
  }
  const { data } = await accountApi();
  amount.value = parseFloat(data.amount);
  payFreeze.value = parseFloat(data.payFreeze);
  withdrawFreeze.value = parseFloat(data.withdrawFreeze);
})

const handleWithdraw = () => {
  console.log("提现逻辑待补全")
}

</script>

<style lang="scss" scoped>
.el-statistic {
  --el-statistic-content-font-size: 30px;
}
.el-col {
  text-align: center;
}
</style>