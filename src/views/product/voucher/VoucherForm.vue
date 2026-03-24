<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled" :validate-on-rule-change="false">
      <el-form-item label="商品名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="所属店铺" prop="restaurantId">
        <RestaurantSelect v-model="formData.restaurantId" :disabled="disabled" :clearable="false"></RestaurantSelect>
      </el-form-item>
      <el-form-item label="分类标签" prop="tagId">
        <VoucherTag v-model="formData.tagId" :restaurant-id="formData.restaurantId" />
        <QuestionTip content="标签是左侧导航分类" />
      </el-form-item>
      <el-form-item label="子标签" prop="subTag">
        <el-input-tag v-model="formData.subTag" trigger="Space" placeholder="按空格键生成标签" :max="3" maxlength="8" />
        <QuestionTip content="该标签可以标注辣度、味道、重量、成分等" />
      </el-form-item>
      <el-form-item label="使用范围" prop="useScope">
        <el-radio-group v-model="formData.useScope">
          <el-radio :value="0">全部</el-radio>
          <el-radio :value="1">线上点餐</el-radio>
          <el-radio :value="2">扫码点餐</el-radio>
        </el-radio-group>
        <QuestionTip content="线上点餐：线上下单后到店进行核销。扫码点餐：线下店铺直接扫码点餐" />
      </el-form-item>
      <el-form-item label="划线价">
        <el-input v-model="formData.linePrice" placeholder="小于销售价时不显示" show-word-limit maxlength="8" @keyup="formData.linePrice = numberValidator(formData.linePrice)" />
      </el-form-item>
      <el-form-item label="销售价" prop="salePrice">
        <el-input v-model="formData.salePrice" show-word-limit maxlength="8" @keyup="formData.salePrice = numberValidator(formData.salePrice)" />
      </el-form-item>
      <el-form-item label="商品规格">
        <div v-if="enableSpec" class="voucher-group">
          <div class="voucher-spec">
            <div class="voucher-spec-content" v-for="(item, index) in formData.specList" :key="index">
              <el-form-item label="规格名称" :prop="`specList[${index}].specName`" :rules="{ required: true, message: '请输入规格名称', trigger: 'blur' }">
                <el-input class="w140" v-model.trim="item.specName" @keyup="handleBlurSpec(index)" maxlength="8" />
              </el-form-item>
              <el-form-item label="规格值" :prop="`specList[${index}].valueList`" :rules="{ required: true, message: '请输入规格值', trigger: 'blur' }">
                <div class="spec-value">
                  <div class="spec-value-patch" v-for="(value, idx) in item.valueList" :key="idx">
                    <el-form-item :prop="`specList[${index}].valueList[${idx}]`" :rules="{ required: true, message: '请输入规格值', trigger: 'blur' }">
                      <el-input class="w140" v-model.trim="item.valueList[idx]" maxlength="8" @keyup="handleBlurValue(index, idx)" />
                    </el-form-item>
                    <span class="close">
                      <el-icon @click="handleCloseValue(index, idx)" v-if="!disabled">
                        <CircleCloseFilled />
                      </el-icon>
                    </span>
                  </div>
                  <span class="spec-value-patch" v-if="!disabled && item.valueList.length < 50">
                    <CreateButton title="添加规格值" @click="handleAddValue(index)" />
                  </span>
                </div>
              </el-form-item>
              <span class="spec-close" v-show="index > 0">
                <el-icon @click="handleCloseSpec(index)" v-if="!disabled">
                  <CircleCloseFilled />
                </el-icon>
              </span>
            </div>
            <div style="margin-bottom: 10px" v-if="!disabled">
              <el-button type="primary" size="small" @click="handleAddSpec" v-show="formData.specList.length < 3">添加规格</el-button>
              <el-button size="small" @click="handleDisableSpec">取消规格</el-button>
            </div>
          </div>
        </div>
        <div v-else class="voucher-spec-empty">
          <el-button v-if="!disabled" type="primary" size="small" @click="handleEnableSpec">添加规格</el-button>
          <span v-else>未配置规格</span>
        </div>
      </el-form-item>
      <el-form-item label="有效日期" prop="validType">
        <el-radio-group v-model="formData.validType" @change="validTypeChange">
          <el-radio :value="0">按购买日计算</el-radio>
          <el-radio :value="1">按时间段计算</el-radio>
        </el-radio-group>
        <QuestionTip content="注意：过期后未使用的餐饮商品会自动退款" />
      </el-form-item>
      <el-form-item label="有效期" :prop="validTypeProp" :rules="validTypeRules">
        <div v-if="formData.validType === 0">
          购买起始日起
          <el-input style="width: 50px; margin: 0 5px" onkeyup="this.value=this.value.replace(/\\D/g,'')" v-model="formData.validDays" maxlength="3"></el-input>
          天有效
        </div>
        <div v-else>
          <el-date-picker type="daterange" :disabled-date="disableBeforeDate" value-format="YYYY-MM-DD" v-model="formData.activityDate" style="width: 350px"></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="限购数量" prop="quota">
        <el-input v-model="formData.quota" onkeyup="this.value=this.value.replace(/\\D/g,'')" show-word-limit maxlength="3" />
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <UploadImageList v-model:file-list="formData.coverUrl" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="商品介绍" prop="introduce">
        <WangEditor v-if="!disabled" v-model:html-value="formData.introduce"></WangEditor>
        <div v-else v-html="formData.introduce" class="html-preview" />
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
</template>

<script setup>
import { createApi, selectApi, updateApi } from '@/api/product/voucher';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { errorMsg, successMsg } from '@/utils/message.js';
import RestaurantSelect from '@/components/RestaurantSelect.vue';
import { disableBeforeDate, goBack, numberValidator } from '@/utils/common.js';
import UploadImageList from '@/components/UploadImageList.vue';
import VoucherTag from '@/components/VoucherTag.vue';
import QuestionTip from '@/components/QuestionTip.vue';
import { CircleCloseFilled } from '@element-plus/icons-vue';
import CreateButton from '@/components/CreateButton.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const validTypeProp = ref('validDays');
const validTypeRules = ref({});
const enableSpec = ref(false);

const formRules = reactive({
  title: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
  restaurantId: [{ required: true, message: '请选择所属店铺', trigger: 'change' }],
  tagId: [{ required: true, message: '请选择标签', trigger: 'change' }],
  salePrice: [{ required: true, message: '销售价不能为空', trigger: 'blur' }],
  validType: [{ required: true, message: '请选择有效期', trigger: 'change' }],
  useScope: [{ required: true, message: '请选择使用范围', trigger: 'change' }],
  coverUrl: [{ required: true, message: '封面图不能为空', trigger: 'change', type: 'array' }],
  quota: [{ required: true, message: '限购数量不能为空', trigger: 'blur' }],
  introduce: [{ required: true, message: '商品介绍不能为空', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: null,
  restaurantId: null,
  tagId: null,
  linePrice: null,
  salePrice: null,
  quota: 99,
  validType: 0,
  validDays: null,
  effectDate: null,
  expireDate: null,
  useScope: 0,
  subTag: [],
  coverUrl: [],
  activityDate: [],
  introduce: null,
  specList: []
});

const buildDefaultSpecList = () => {
  return [
    {
      specName: null,
      valueList: [null]
    }
  ];
};

const handleEnableSpec = () => {
  enableSpec.value = true;
  if (!formData.value.specList || formData.value.specList.length === 0) {
    formData.value.specList = buildDefaultSpecList();
  }
};

const handleDisableSpec = () => {
  enableSpec.value = false;
  formData.value.specList = [];
};

const handleAddSpec = () => {
  if (!enableSpec.value) {
    return;
  }
  if (formData.value.specList.length >= 3) {
    errorMsg('最多支持三级规格定义');
    return;
  }
  formData.value.specList.push({
    specName: null,
    valueList: [null]
  });
};

const handleCloseSpec = (index) => {
  if (formData.value.specList.length <= 1) {
    errorMsg('至少保留一个规格');
    return;
  }
  formData.value.specList.splice(index, 1);
};

const handleAddValue = (index) => {
  formData.value.specList[index].valueList.push(null);
};

const handleCloseValue = (index, idx) => {
  if (formData.value.specList[index].valueList.length === 1) {
    errorMsg('至少保留一个规格值');
    return;
  }
  formData.value.specList[index].valueList.splice(idx, 1);
};

const handleBlurSpec = (index) => {
  const name = formData.value.specList[index].specName;
  if (!name) {
    return;
  }
  const repeat = formData.value.specList.filter((item, idx) => idx !== index && item.specName === name).length > 0;
  if (repeat) {
    errorMsg('规格名不能重复');
    formData.value.specList[index].specName = null;
  }
};

const handleBlurValue = (index, idx) => {
  const spec = formData.value.specList[index];
  const valueList = spec.valueList.filter((item) => !!item).map((item) => item);
  if (new Set(valueList).size !== valueList.length) {
    errorMsg('规格值不能重复');
    spec.valueList[idx] = null;
  }
};

const parseSpecConfig = (rawValue) => {
  if (!rawValue) {
    return null;
  }
  if (typeof rawValue === 'object') {
    return rawValue;
  }
  try {
    return JSON.parse(rawValue);
  } catch (_e) {
    return null;
  }
};

const handleSave = () => {
  if (!enableSpec.value) {
    formData.value.specList = [];
  }
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    loading.value = true;
    if (formData.value.validType === 1) {
      formData.value.effectDate = formData.value.activityDate[0];
      formData.value.expireDate = formData.value.activityDate[1];
    } else {
      formData.value.effectDate = null;
      formData.value.expireDate = null;
    }
    const payload = {... formData.value,
      specEnabled: enableSpec.value,
      specConfigJson: JSON.stringify(formData.value.specList)
    };
    const api = formData.value.id ? updateApi : createApi;
    api(payload)
      .then(() => {
        successMsg(formData.value.id ? '商品信息更新成功' : '商品信息添加成功');
        goBack(router);
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

onMounted(() => {
  const params = route.params;
  if (params.id !== undefined) {
    loading.value = true;
    disabled.value = route.fullPath.startsWith('/product/voucher/detail');
    selectApi(params)
      .then((res) => {
        formData.value = { ...formData.value, ...res.data };
        formData.value.validType = formData.value.validDays > 0 ? 0 : 1;
        validTypeChange(formData.value.validType);
        if (res.data.validDays > 0) {
          formData.value.activityDate = null;
        } else {
          formData.value.validDays = null;
          formData.value.activityDate = [res.data.effectDate, res.data.expireDate];
        }
        const specConfig = parseSpecConfig(res.data.specConfigJson);
        if (!specConfig|| specConfig.length === 0) {
          enableSpec.value = false;
          formData.value.specList = [];
        } else {
          enableSpec.value = true;
          formData.value.specList = specConfig;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    validTypeChange(formData.value.validType);
  }
});

const validTypeChange = (val) => {
  if (val === 0) {
    formData.value.activityDate = null;
    validTypeProp.value = 'validDays';
    validTypeRules.value = { required: true, message: '有效期不能为空', trigger: 'blur' };
  } else {
    formData.value.validDays = null;
    validTypeProp.value = 'activityDate';
    validTypeRules.value = { required: true, message: '时间段不能为空', trigger: 'blur' };
  }
};
</script>

<style lang="scss" scoped>
.voucher-group {
  width: 910px;
  border: 1px solid #dcdfe6;
  padding: 10px;
}

.voucher-spec-empty {
  min-height: 32px;
  display: flex;
  align-items: center;
}

.voucher-spec {
  .voucher-spec-content {
    position: relative;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 5px;
    padding: 10px 10px 0 10px;
    margin-bottom: 10px;

    .spec-close {
      position: absolute;
      top: -15px;
      right: -5px;
      cursor: pointer;
    }
  }
}

.spec-value {
  display: flex;
  flex-wrap: wrap;

  .spec-value-patch {
    margin-right: 10px;
    text-align: center;
    position: relative;

    .close {
      position: absolute;
      top: -15px;
      right: -5px;
      cursor: pointer;
    }
  }
}

.el-form-item .el-form-item {
  margin-bottom: 18px;
}

.html-preview :deep(img) {
  display: block;
  max-width: 100% !important;  /* 超大图缩到容器内 */
  width: auto !important;       /* 不强制拉伸小图 */
  height: auto !important;
}
</style>
