<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled" :validate-on-rule-change="false">
      <el-form-item label="优惠券名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="优惠券类型" prop="couponType">
        <el-radio-group v-model="formData.couponType" @change="handleCouponType" :disabled="disabled">
          <el-radio label="抵扣券" :value="1"></el-radio>
          <el-radio label="折扣券" :value="2"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="抵扣金额" prop="deductionValue" v-show="formData.couponType === 1">
        <el-input v-model="formData.deductionValue" :disabled="disabled" show-word-limit maxlength="6" @keyup="formData.deductionValue = numberValidator(formData.deductionValue)" />
      </el-form-item>
      <el-form-item label="折扣比例" prop="discountValue" v-show="formData.couponType === 2" :disabled="disabled">
        <el-input v-model="formData.discountValue" maxlength="2" onkeyup="this.value=this.value.replace(/\D/g,'')" >
          <template #append>折</template>
        </el-input>
      </el-form-item>
      <el-form-item label="使用门槛" :prop="thresholdProp">
        <el-radio-group v-model="formData.threshold" @change="handleThreshold" :disabled="disabled">
          <el-radio :value="2"
            >满
            <el-input
              style="width: 80px; margin: 0 5px"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              v-model="formData.useThreshold"
              maxlength="6"
              @keyup="formData.useThreshold = numberValidator(formData.useThreshold)"
              :disabled="thresholdDisabled || disabled"
            ></el-input>
            元使用
          </el-radio>
          <el-radio label="无门槛" :value="1"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="formData.stock" show-word-limit maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="领取方式" prop="mode">
        <el-radio-group v-model="formData.mode" :disabled="disabled" @change="handleMode">
          <el-radio label="页面领取" :value="1"></el-radio>
          <el-radio label="手动发放" :value="2"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="单人领取限制" prop="maxLimit">
        <el-input v-model="formData.maxLimit" show-word-limit maxlength="2" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="适用类型" prop="productType">
        <!-- 默认只显示该商户拥有的产品类型,如果是系统用户默认都显示 -->
        <el-radio-group v-model="formData.productType" :disabled="disabled" @change="handleProductChange">
          <el-radio label="门票" value="ticket" v-if="merchantType === 0 || (merchantType&1) === 1"></el-radio>
          <el-radio label="民宿" value="homestay" v-if="merchantType === 0 || (merchantType&2) === 2"></el-radio>
          <el-radio label="餐饮券" value="voucher" v-if="merchantType === 0 || (merchantType&4) === 4"></el-radio>
          <el-radio label="零售" value="item" v-if="merchantType === 0 || (merchantType&8) === 8"></el-radio>
          <el-radio label="线路" value="line" v-if="merchantType === 0 || (merchantType&16) === 16"></el-radio>
          <el-radio label="场馆" value="venue" v-if="merchantType === 0 || (merchantType&32) === 32"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="使用范围" prop="useScope">
        <el-radio-group v-model="formData.useScope" @change="handleUseScope" :disabled="disabled">
          <el-radio label="店铺通用" :value="1"></el-radio>
          <el-radio label="指定商品" :value="2"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关联店铺" prop="storeId">
        <StoreTypeSelect v-model="formData.storeId" :product-type="formData.productType" :clearable="false" :disabled="disabled" @change="handleChange"></StoreTypeSelect>
      </el-form-item>
      <el-form-item label="关联商品" prop="productIds" v-show="formData.useScope === 2">
        <el-button @click="handleProductSelect" type="primary">{{ formData.productIds.length > 0 ? `共计${formData.productIds.length}个商品` : '选择商品' }}
          <el-icon class="el-icon--right">
            <ArrowRight />
          </el-icon>
        </el-button>
      </el-form-item>
      <el-form-item label="发放时间" prop="timeList">
        <div style="width: 370px">
          <el-date-picker
            :disabled="disabled"
            type="datetimerange"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            time-format="HH:mm"
            v-model="formData.timeList"
            style="width: 350px"
          ></el-date-picker><QuestionTip content="注意：只有未开始的优惠券才支持删除"></QuestionTip>
        </div>
      </el-form-item>
      <el-form-item label="使用时间" prop="useTimeList">
        <div style="width: 350px">
          <el-date-picker
            :disabled="disabled"
            type="datetimerange"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            v-model="formData.useTimeList"
            time-format="HH:mm"
            style="width: 350px"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="使用说明" prop="instruction">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" v-model="formData.instruction" maxlength="50" show-word-limit />
      </el-form-item>
    </el-form>
    <div>
      <div class="edit-button-footer" v-if="!disabled">
        <el-button @click="goBack($router)">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
      <div class="edit-button-footer" v-else>
        <el-button @click="goBack($router)">返回</el-button>
      </div>
    </div>
  </div>
  <ProductDialog ref="formRef" @reload="setProduct"></ProductDialog>
</template>

<script setup>
import { createApi, selectApi, updateApi } from '@/api/marketing/coupon';
import { useRoute, useRouter } from 'vue-router';
import { errorMsg, successMsg, warningMsg } from '@/utils/message.js';
import { goBack, numberValidator } from '@/utils/common.js';
import StoreTypeSelect from '@/components/StoreTypeSelect.vue';
import { ArrowRight } from '@element-plus/icons-vue';
import ProductDialog from '@/components/ProductDialog.vue';
import useUserStore from '@/store/user.js'
import QuestionTip from '@/components/QuestionTip.vue'

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const thresholdProp = ref('useThreshold');
const thresholdDisabled = ref(false);
const formRef = ref();
const userStore = useUserStore();

const merchantType = userStore.user?.merchantType;

const formRules = reactive({
  title: [{ required: true, message: '优惠券名称不能为空', trigger: 'blur' }],
  maxLimit: [{ required: true, message: '单人领取限制不能为空', trigger: 'blur' }],
  stock: [{ required: true, message: '库存不能为空', trigger: 'blur' }],
  storeId: [{ required: true, message: '请选择店铺', trigger: 'change' }],
  couponType: [{ required: true, message: '请选择优惠券类型', trigger: 'change' }],
  mode: [{ required: true, message: '请选择领取方式', trigger: 'change' }],
  useScope: [{ required: true, message: '请选择使用范围', trigger: 'change' }],
  threshold: [{ required: true, message: '请选择使用门槛', trigger: 'change' }],
  productType: [{ required: true, message: '请选择商品类型', trigger: 'change' }],
  timeList: [{ required: true, message: '请选择发放时间', trigger: 'blur', type: 'array' }],
  useTimeList: [{ required: true, message: '请选择使用时间', trigger: 'blur', type: 'array' }],
  instruction: [{ required: true, message: '使用说明不能为空', trigger: 'blur' }],
  deductionValue: [{ required: true, message: '请输入抵扣金额', trigger: 'blur' }]
});

const formData = ref({
  id: null,
  title: null,
  stock: 9999,
  maxLimit: 1,
  mode: 1,
  couponType: 1,
  useScope: 1,
  storeId: null,
  deductionValue: null,
  discountValue: null,
  threshold: 2,
  useThreshold: null,
  productType: null,
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
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('优惠券添加成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

// 切换商品类型或者店铺时,将之前选中的商品清空,防止影响,因为优惠券如果是商品级,只能在某一个店铺使用
const handleChange = () => {
  formData.value.productIds = [];
};

const handleProductChange = () => {
  formData.value.productIds = [];
  formData.value.storeId = null;
};

const handleMode = (value) => {
  if (value === 2) {
    warningMsg('手动发放模式下，只能通过抽奖或联系运营人员进行发放');
  }
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
    formRules.useThreshold = [];
    formDataRef.value?.resetFields('useThreshold');
  } else {
    thresholdProp.value = 'useThreshold';
    thresholdDisabled.value = false;
    formRules.useThreshold = [{ required: true, message: '请输入门槛金额', trigger: 'blur' }];
    formRules.threshold = [];
  }
};

const handleProductSelect = () => {
  if (!formData.value.storeId) {
    errorMsg('请选择店铺');
    return;
  }
  formRef.value.openDialog(formData.value.productType, formData.value.productIds);
};

const handleUseScope = () => {
  if (formData.value.useScope === 2) {
    formRules.productIds = [{ required: true, message: '请选择关联的商品', trigger: 'change' }];
  } else {
    formRules.productIds = [];
  }
};

onMounted(() => {
  const params = route.params;
  if (params.id !== undefined) {
    loading.value = true;
    // 详情页面进来不可点击
    disabled.value = route.fullPath.startsWith('/marketing/coupon/detail');
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        formData.value.timeList = [res.data.startTime, res.data.endTime];
        formData.value.useTimeList = [res.data.useStartTime, res.data.useEndTime];
        handleCouponType(res.data.couponType);
        const useThreshold = parseFloat(res.data.useThreshold);
        if (useThreshold > 0) {
          formData.value.threshold = 2;
          formData.value.useThreshold = res.data.useThreshold;
        } else {
          formData.value.threshold = 1;
          formData.value.useThreshold = null;
        }
        handleUseScope();
        handleThreshold(formData.value.threshold);
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    handleThreshold(2);
  }
});
</script>
