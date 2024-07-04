<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled" :validate-on-rule-change="false">
      <el-form-item label="商品名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="描述信息" prop="depict">
        <el-input v-model="formData.title" show-word-limit maxlength="40" />
      </el-form-item>
      <el-form-item label="所属商品" prop="storeId">
        <StoreSelect v-model="formData.storeId"></StoreSelect>
      </el-form-item>
      <el-form-item label="标签" prop="tagId">
        <ItemTag v-model="formData.tagId"></ItemTag>
      </el-form-item>
      <el-form-item label="规格类型">
        <el-radio-group v-model="formData.multiSpec" @change="handleChangeSpec">
          <el-radio label="单规格" :value="false"></el-radio>
          <el-radio label="多规格" :value="true"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="skuList" label="商品规格" v-show="formData.multiSpec">
        <div class="item-group">
          <div class="item-spec">
            <div class="item-spec-content" v-for="(item, index) in formData.specList" :key="index">
              <el-form-item label="规格名称">
                <el-input class="w100" v-model="item.specName" onkeyup="this.value=this.value.trim();" @blur="handleBlurSpec(index)"></el-input>
              </el-form-item>
              <el-form-item label="规格值">
                <div class="spec-value">
                  <div class="spec-value-patch" v-for="(value, idx) in item.valueList">
                    <el-input class="w120" style="margin-bottom: 10px" v-model="value.name" onkeyup="this.value=this.value.trim();" @blur="handleBlurValue(index, idx)"></el-input>
                    <span class="close">
                      <el-icon @click="handleCloseValue(index, idx)">
                        <CircleCloseFilled />
                      </el-icon>
                    </span>
                    <UploadImage v-model="value.pic"></UploadImage>
                  </div>
                  <span class="spec-value-patch">
                    <CreateButton title="添加规格值" @click="handleAddValue(index)"></CreateButton>
                  </span>
                </div>
              </el-form-item>
              <span class="spec-close" v-show="index === 1">
                <el-icon @click="handleCloseSpec">
                  <CircleCloseFilled />
                </el-icon>
              </span>
            </div>
            <div style="margin-bottom: 10px" v-show="formData.specList.length === 1">
              <el-button type="primary" size="small" @click="handleAddSpec">添加规格</el-button>
            </div>
          </div>
          <div class="item-sku">
            <el-table border :data="formData.skuList" :span-method="handleSpanMethod">
              <el-table-column prop="primaryValue">
                <template #header="scope">
                  <span>{{ scope.row.primaryHeader }}</span>
                </template>
                <template #default="scope">
                  <el-text v-model="scope.row.primaryValue"></el-text>
                </template>
              </el-table-column>
              <el-table-column prop="secondValue" v-show="showSecondSpec">
                <template #header="scope">
                  <span>{{ scope.row.secondHeader }}</span>
                </template>
                <template #default="scope">
                  <el-text v-model="scope.row.secondValue"></el-text>
                </template>
              </el-table-column>
              <el-table-column label="成本价" prop="costPrice">
                <template #default="scope">
                  <el-input v-model="scope.row.costPrice" show-word-limit maxlength="6" @keyup="scope.row.costPrice = numberValidator(scope.row.costPrice)" />
                </template>
              </el-table-column>
              <el-table-column label="划线价" prop="linePrice">
                <template #default="scope">
                  <el-input v-model="scope.row.linePrice" show-word-limit maxlength="6" @keyup="scope.row.linePrice = numberValidator(scope.row.linePrice)" />
                </template>
              </el-table-column>
              <el-table-column prop="salePrice">
                <template #header>
                  <span><span class="item-required">*</span>销售价</span>
                </template>
                <template #default="scope">
                  <el-input v-model="scope.row.salePrice" show-word-limit maxlength="6" @keyup="scope.row.salePrice = numberValidator(scope.row.salePrice)" />
                </template>
              </el-table-column>
              <el-table-column prop="stock">
                <template #header>
                  <span><span class="item-required">*</span>库存</span>
                </template>
                <template #default="scope">
                  <el-input v-model="scope.row.stock" show-word-limit maxlength="5" @keyup="scope.row.stock = numberValidator(scope.row.stock)" />
                </template>
              </el-table-column>
              <el-table-column label="虚拟销量" prop="virtualNum">
                <template #default="scope">
                  <el-input v-model="scope.row.virtualNum" show-word-limit maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
                </template>
              </el-table-column>
              <el-table-column label="重量(kg)" prop="weight">
                <template #default="scope">
                  <el-input v-model="scope.row.weight" show-word-limit maxlength="6" @keyup="scope.row.weight = numberValidator(scope.row.weight)" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form-item>
      <template v-for="(item, index) in formData.skuList" :key="index">
        <el-form-item label="成本价" v-show="!formData.multiSpec">
          <el-input v-model="item.salePrice" show-word-limit maxlength="6" @keyup="formData.costPrice = numberValidator(formData.costPrice)" />
        </el-form-item>
        <el-form-item label="划线价" v-show="!formData.multiSpec">
          <el-input v-model="formData.linePrice" show-word-limit maxlength="6" @keyup="formData.linePrice = numberValidator(formData.linePrice)" />
        </el-form-item>
        <el-form-item :prop="salePriceRef" label="销售价" v-show="!formData.multiSpec" :rules="salePriceRule">
          <el-input v-model="formData.salePrice" show-word-limit maxlength="6" @keyup="formData.salePrice = numberValidator(formData.salePrice)" />
        </el-form-item>
        <el-form-item :prop="stockRef" label="库存" v-show="!formData.multiSpec" :rules="stockRule">
          <el-input v-model="formData.stock" show-word-limit maxlength="5" onkeyup="this.value=this.value.replace(/\D/g,'')" />
        </el-form-item>
        <el-form-item label="虚拟销量" v-show="!formData.multiSpec">
          <el-input v-model="formData.virtualNum" show-word-limit maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
        </el-form-item>
        <el-form-item label="重量(kg)" v-show="!formData.multiSpec">
          <el-input v-model="formData.weight" show-word-limit maxlength="6" @keyup="formData.weight = numberValidator(formData.weight)" />
        </el-form-item>
      </template>
      <el-form-item label="限购数量" prop="quota" v-show="!formData.multiSpec">
        <el-input v-model="formData.quota" maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 60px" />
      </el-form-item>
      <el-form-item label="交付方式" prop="deliveryType">
        <el-radio-group v-model="formData.deliveryType" @change="handleDelivery">
          <el-radio :value="1">快递</el-radio>
          <el-radio :value="2">门店自提</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="物流模板" prop="expressId">
        <ExpressSelect v-model="formData.expressId" :clearable="false"></ExpressSelect>
      </el-form-item>
      <el-form-item label="封面图" prop="coverList">
        <UploadImageList v-model:file-list="formData.coverList" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="购买须知" prop="purchaseNotes">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="formData.purchaseNotes" autosize maxlength="400" show-word-limit />
      </el-form-item>
      <el-form-item label="商品介绍" prop="introduceText">
        <WangEditor v-if="!disabled" v-model:html-value="formData.introduce" v-model:text-value="formData.introduceText"></WangEditor>
        <div v-else v-html="formData.introduce"></div>
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
</template>

<script setup>
import { createApi, selectApi, updateApi } from '@/api/product/item';
import { reactive, ref } from 'vue';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { errorMsg, successMsg } from '@/utils/message.js';
import { numberValidator, phoneValidator } from '@/utils/common.js';
import UploadImageList from '@/components/UploadImageList.vue';
import ItemTag from '@/components/ItemTag.vue';
import ExpressSelect from '@/components/ExpressSelect.vue';
import StoreSelect from '@/components/StoreSelect.vue';
import UploadImage from '@/components/UploadImage.vue';
import { CircleCloseFilled } from '@element-plus/icons-vue';
import CreateButton from '@/components/CreateButton.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const salePriceRef = 'skuList[0].salePrice';
const stockRef = ref('skuList[0].stock');
const salePriceRule = ref({ required: true, message: '销售价不能为空', trigger: 'blur' });
const stockRule = ref({ required: true, message: '库存不能为空', trigger: 'blur' });
const showSecondSpec = ref(false);

const formRules = reactive({
  title: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
  depict: [
    { required: true, message: '描述信息不能为空', trigger: 'blur' },
    { min: 5, max: 40, message: '长度在 5 到 40 个字符', trigger: 'blur' }
  ],
  logoUrl: [{ required: true, message: '请上传商品logo', trigger: 'change' }],
  merchantId: [{ required: true, message: '请选择所属商户', trigger: 'change' }],
  telephone: [{ required: true, validator: phoneValidator, trigger: 'blur' }],
  openTime: [{ required: true, message: '营业时间不能为空', trigger: 'blur' }],
  areaList: [{ required: true, message: '请选择省市县', trigger: 'change', type: 'array' }],
  detailAddress: [
    { required: true, message: '详细地址不能为空', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  expressId: [{ required: true, message: '请选择物流模板', trigger: 'change' }],
  depotAddressId: [{ required: true, message: '请选择退换货地址', trigger: 'change' }],
  latitude: [{ required: true, message: '请选择经纬度', trigger: 'change' }],
  coverList: [{ required: true, message: '请上传封面图', trigger: 'change', type: 'array' }],
  introduceText: [{ required: true, message: '商家介绍不能为空', trigger: 'change' }]
});

let formData = ref({
  id: null,
  title: null,
  storeId: null,
  depict: null,
  tagId: [],
  quota: 99,
  deliveryType: 1,
  expressId: null,
  coverList: [],
  multiSpec: false,
  introduceText: null,
  introduce: null,
  purchaseNotes: null,
  skuList: [
    {
      primaryHeader: null,
      primaryValue: null,
      secondHeader: null,
      // 合并多少列
      secondSize: 0,
      secondValue: null,
      linePrice: null,
      costPrice: null,
      salePrice: null,
      stock: null,
      virtualNum: null,
      weight: null
    }
  ],
  specList: [
    {
      id: null,
      specName: null,
      valueList: [
        {
          name: null,
          pic: null
        }
      ]
    }
  ]
});

const handleAddValue = (index) => {
  formData.value.specList[index].valueList.push({
    name: null,
    pic: null
  });
};

const handleCloseSpec = () => {
  if (formData.value.specList.length === 1) {
    errorMsg('至少保留一个规格名');
    return;
  }
  formData.value.specList.splice(1, 1);
};

const handleAddSpec = () => {
  if (formData.value.specList.length >= 2) {
    errorMsg('最多支持两级规格定义');
    return;
  }
  formData.value.specList.push({
    id: null,
    specName: null,
    valueList: [
      {
        name: null,
        pic: null
      }
    ]
  });
};

/**
 * 删除规格值
 * @param index 规格名index
 * @param idx 规格值index
 */
const handleCloseValue = (index, idx) => {
  if (formData.value.specList[index].valueList.length === 1) {
    errorMsg('至少保留一个规格值');
    return;
  }
  formData.value.specList[index].valueList.splice(idx, 1);
};

const handleBlurSpec = (index) => {
  if (formData.value.specList.length === 2 && formData.value.specList[0].specName === formData.value.specList[1].specName) {
    errorMsg('规格名不能重复');
    formData.value.specList[index].specName = null;
    return;
  }
  generateSkuTable();
};

const handleBlurValue = (index, idx) => {
  const spec = formData.value.specList[index];
  const set = new Set();
  spec.valueList.forEach((item) => {
    set.add(item.name);
  });
  if (spec.valueList.length !== set.size) {
    errorMsg('规格值不能重复');
    spec.valueList[idx].name = null;
    return;
  }
  generateSkuTable();
};

const generateSkuTable = () => {
  const spec = formData.value.specList[0];
  if (spec.valueList.length === 0 || !spec.specName) {
    // 一级规格信息都不完整
    return;
  }
  if (formData.value.specList.length === 1 || !formData.value.specList[1].specName || formData.value.specList[1].valueList.length === 0) {
    createPrimarySpec(spec);
    showSecondSpec.value = false;
  } else {
    const secondSpec = formData.value.specList[1];
    const size = secondSpec.valueList.length;
    for (let item of spec.valueList) {
      for (let secondItem of secondSpec.valueList) {
        formData.value.skuList.push({
          primaryHeader: spec.specName,
          primaryValue: item.name,
          secondHeader: secondSpec.specName,
          secondValue: secondItem.name,
          secondSize: size,
          linePrice: null,
          costPrice: null,
          salePrice: null,
          stock: null,
          virtualNum: null,
          weight: null
        });
      }
    }
    showSecondSpec.value = true;
  }
};

const createPrimarySpec = (spec) => {
  for (let item of spec.valueList) {
    formData.value.skuList.push({
      primaryHeader: spec.specName,
      primaryValue: item.name,
      secondHeader: null,
      secondSize: 0,
      secondValue: null,
      linePrice: null,
      costPrice: null,
      salePrice: null,
      stock: null,
      virtualNum: null,
      weight: null
    });
  }
};

const handleSpanMethod = (row, column, rowIndex, columnIndex) => {
  if (columnIndex === 0 && row.secondSize > 0) {
    return {
      rowspan: row.secondSize,
      colspan: 1
    };
  } else {
    return {
      rowspan: 0,
      colspan: 0
    };
  }
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('商品信息更新成功');
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('商品添加成功');
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

onMounted(() => {
  const params = route.params;
  if (params.id !== undefined) {
    loading.value = true;
    // 详情页面进来不可点击
    disabled.value = route.fullPath.startsWith('/product/item/detail');
    selectApi(params)
      .then((res) => {
        formData.value = { ...res.data };
        if (res.data.coverUrl) {
          formData.value.coverList = res.data.coverUrl.split(',');
        } else {
          formData.value.coverList = [];
        }
        formData.value.introduceText = res.data.introduce;
      })
      .finally(() => {
        loading.value = false;
      });
  }
});

const handleDelivery = (value) => {
  if (value === 1) {
    formData.value.expressId = null;
    formRules.expressId = [{ required: true, message: '请选择物流模板', trigger: 'change' }];
  } else {
    formRules.expressId = [];
  }
};

const handleChangeSpec = (value) => {
  if (value) {
    salePriceRule.value = null;
    stockRule.value = null;
    formData.value.specList = [];
    formData.value.skuList = [];
  } else {
    formData.value.skuList = [
      {
        primaryHeader: null,
        primaryValue: null,
        secondHeader: null,
        secondSize: 0,
        secondValue: null,
        linePrice: null,
        costPrice: null,
        salePrice: null,
        stock: null,
        virtualNum: null,
        weight: null
      }
    ];
  }
};
</script>
<style lang="scss" scoped>
.item-group {
  width: 850px;
  border: 1px solid #dcdfe6;
  padding: 10px;

  .item-sku {
    .item-required {
      color: #f56c6c;
    }
  }
}

.item-spec {
  .item-spec-content {
    position: relative;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 5px;
    padding: 10px;
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
    padding-top: 10px;
    margin-right: 20px;
    text-align: center;
    position: relative;

    .close {
      position: absolute;
      top: -5px;
      right: -5px;
      cursor: pointer;
    }
  }
}
</style>
