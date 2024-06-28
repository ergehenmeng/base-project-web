<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled" :validate-on-rule-change="false">
      <el-form-item label="优惠券名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="优惠券类型" prop="couponType">
        <el-radio-group v-model="formData.couponType" @change="handleCouponType">
          <el-radio label="抵扣券" :value="1"></el-radio>
          <el-radio label="折扣券" :value="2"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="抵扣金额" prop="deductionValue" v-show="formData.couponType === 1">
        <el-input v-model="formData.deductionValue" show-word-limit maxlength="6" @keyup="formData.deductionValue = numberValidator(formData.deductionValue)" />
      </el-form-item>
      <el-form-item label="折扣比例" prop="discountValue" v-show="formData.couponType === 2">
        <el-input v-model="formData.discountValue" show-word-limit maxlength="2" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="使用门槛" :prop="thresholdProp">
        <el-radio-group v-model="formData.threshold" @change="handleThreshold">
          <el-radio label="不限制" :value="1"></el-radio>
          <el-radio :value="2"
            >满
            <el-input
              style="width: 50px; margin: 0 5px"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              v-model="formData.useThreshold"
              maxlength="6"
              @keyup="formData.useThreshold = numberValidator(formData.useThreshold)"
              :disabled="thresholdDisabled"
            ></el-input>
            元使用
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产品类型" prop="productType">
        <el-radio-group v-model="formData.productType">
          <el-radio label="门票" value="ticket"></el-radio>
          <el-radio label="民宿" value="homestay"></el-radio>
          <el-radio label="餐饮券" value="voucher"></el-radio>
          <el-radio label="零售" value="item"></el-radio>
          <el-radio label="线路" value="line"></el-radio>
          <el-radio label="场馆" value="venue"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="使用范围" prop="useScope">
        <el-radio-group v-model="formData.useScope">
          <el-radio label="店铺通用" :value="1"></el-radio>
          <el-radio label="指定商品" :value="2"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关联店铺" prop="storeId">
        <StoreAllSelect v-model="formData.storeId" :product-type="formData.productType" :clearable="false"></StoreAllSelect>
      </el-form-item>
      <el-form-item label="关联商品" prop="productIds" v-show="formData.useScope === 2">
        <el-button @click="handleProductSelect" type="primary" >{{formData.productIds.length > 0 ? `共计${formData.productIds.length}个商品` : '选择商品'}}<el-icon class="el-icon--right"><ArrowRight /></el-icon></el-button>
      </el-form-item>
      <el-form-item label="发放时间" prop="timeList">
        <div style="width: 350px">
          <el-date-picker type="datetimerange" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" time-format="HH:mm" v-model="formData.timeList" style="width: 350px"></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="使用时间" prop="useTimeList">
        <div style="width: 350px">
          <el-date-picker type="datetimerange" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" v-model="formData.useTimeList" time-format="HH:mm" style="width: 350px"></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="使用说明" prop="instruction">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" v-model="formData.remark" autosize maxlength="50" show-word-limit />
      </el-form-item>
    </el-form>
    <div>
      <div class="edit-button-footer" v-if="!disabled">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
      <div class="edit-button-footer" v-else>
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
  </div>
  <TicketDialog ref="ticketRef" @reload="setProduct"></TicketDialog>
</template>

<script setup>
import { createApi, selectApi, updateApi } from '@/api/marketing/coupon';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { errorMsg, successMsg } from '@/utils/message.js'
import { numberValidator } from '@/utils/common.js';
import StoreAllSelect from '@/components/StoreAllSelect.vue';
import { ArrowRight } from '@element-plus/icons-vue';
import TicketDialog from '@/components/TicketDialog.vue'

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const thresholdProp = ref('threshold');
const thresholdDisabled = ref(true);
const ticketRef = ref();

const formRules = reactive({
  title: [{ required: true, message: '优惠券名称不能为空', trigger: 'blur' }],
  maxLimit: [{ required: true, message: '单人领取限制不能为空', trigger: 'blur' }],
  stock: [{ required: true, message: '库存不能为空', trigger: 'blur' }],
  storeId: [{ required: true, message: '请选择店铺', trigger: 'change' }],
  couponType: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
  useScope: [{ required: true, message: '请选择使用范围', trigger: 'change' }],
  threshold: [{ required: true, message: '请选择使用门槛', trigger: 'change' }],
  productType: [{ required: true, message: '请选择优惠券类型', trigger: 'change' }],
  timeList: [{ required: true, message: '请选择发放时间', trigger: 'blur', type: 'array' }],
  useTimeList: [{ required: true, message: '请选择使用时间', trigger: 'blur', type: 'array' }],
  instruction: [{ required: true, message: '使用说明不能为空', trigger: 'blur' }],
  deductionValue: [{ required: true, message: '请输入抵扣金额', trigger: 'blur' }]
});

const formData = ref({
  id: null,
  title: null,
  stock: null,
  maxLimit: 1,
  mode: 1,
  couponType: 1,
  useScope: 1,
  storeId: null,
  deductionValue: null,
  discountValue: null,
  threshold: 1,
  useThreshold: null,
  productType: 'ticket',
  timeList: [],
  useTimeList: [],
  instruction: null,
  productIds: []
});


const setProduct = (data) => {
  formData.value.productIds = data;
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      formData.value.startTime = formData.value.timeList[0];
      formData.value.endTime = formData.value.timeList[1];
      formData.value.useStartTime = formData.value.useTimeList[0];
      formData.value.useEndTime = formData.value.useTimeList[1];
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('优惠券信息更新成功');
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('优惠券添加成功');
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

const handleCouponType = (value) => {
  if (value === 1) {
    formRules.deductionValue = [{ required: true, message: '请输入抵扣金额', trigger: 'blur' }];
    formRules.discountValue = [];
  } else {
    formRules.deductionValue = [];
    formRules.discountValue = [
      { required: true, message: '请输入折扣比例', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          const rate = parseInt(value);
          if (rate < 10 || rate >= 100) {
            callback(new Error('折扣比例应在10-99之间'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ];
  }
};

const handleThreshold = (value) => {
  if (value === 1) {
    thresholdProp.value = 'threshold';
    thresholdDisabled.value = true;
    formRules.threshold = [{ required: true, message: '请选择使用门槛', trigger: 'change' }];
  } else {
    thresholdProp.value = 'useThreshold';
    thresholdDisabled.value = false;
    formRules.useThreshold = [{ required: true, message: '请输入门槛金额', trigger: 'change' }];
  }
};

const handleProductSelect = () => {
  // if (!formData.value.storeId) {
  //   errorMsg('请选择店铺');
  //   return;
  // }
  ticketRef.value.openDialog();
}

onMounted(() => {
  const params = route.params;
  if (params.id !== undefined) {
    loading.value = true;
    // 详情页面进来不可点击
    disabled.value = route.fullPath.startsWith('/marketing/coupon/detail');
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        formData.value.dueDate = [res.data.startDate, res.data.endDate];
        formData.value.introduceText = res.data.introduce;
      })
      .finally(() => {
        loading.value = false;
      });
  }
});
</script>
