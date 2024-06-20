<template>
  <div class="edit-content">
    <el-divider />
    <el-row>
      <el-col :span="8">
        <el-statistic title="可用积分" :value="amountValue">
        </el-statistic>
        <el-button v-has-perm="'KVu0'" type="primary" style="margin-top: 10px;" @click="handleRecharge" size="small">充值</el-button>
        <el-button v-has-perm="'5Vu0'" type="primary" style="margin-top: 10px;" @click="handleWithdraw" size="small">提现</el-button>
      </el-col>
      <el-col :span="8">
        <el-statistic title="支付冻结积分" :value="payFreeze" >
        </el-statistic>
        <el-button v-has-perm="'ZVu0'" type="primary" style="margin-top: 10px;" @click="handleWithdraw" size="small">冻结记录</el-button>
      </el-col>
      <el-col :span="8">
        <el-statistic title="提现冻结积分" :value="withdrawFreeze">
        </el-statistic>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { accountApi } from '@/api/merchant/score';
import { useTransition } from '@vueuse/core'
import useUserStore from '@/store/user.js'
import { useRouter } from 'vue-router'

const router = useRouter();
const userStore = useUserStore();
const selectAuth = userStore.hasAuth('JVu0');
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
  amount.value = data.amount;
  payFreeze.value = data.payFreeze;
  withdrawFreeze.value = data.withdrawFreeze;
})

const handleWithdraw = () => {
  console.log("提现逻辑待补全")
}

const handleRecharge = () => {
  router.push("/merchant/score/recharge")
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