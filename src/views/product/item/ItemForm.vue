<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled" :validate-on-rule-change="false">
      <el-form-item label="商品名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="描述信息" prop="depict">
        <el-input v-model="formData.depict" type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" show-word-limit maxlength="40" />
      </el-form-item>
      <el-form-item label="所属店铺" prop="storeId">
        <StoreSelect v-model="formData.storeId"></StoreSelect>
      </el-form-item>
      <el-form-item label="商品标签" prop="tagList">
        <ItemTag v-model="formData.tagList"></ItemTag>
      </el-form-item>
      <el-form-item label="规格类型" prop="multiSpec">
        <el-radio-group v-model="formData.multiSpec" @change="handleChangeSpec" :disabled="formData.id !== null">
          <el-radio label="单规格" :value="false"></el-radio>
          <el-radio label="多规格" :value="true"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品规格" v-if="formData.multiSpec">
        <div class="item-group">
          <div class="item-spec">
            <div class="item-spec-content" v-for="(item, index) in formData.specList" :key="index">
              <el-form-item label="规格名称" :prop="`specList[${index}].specName`" :rules="{ required: true, message: '请输入规格名称', trigger: 'blur' }">
                <el-input class="w140" v-model.trim="item.specName" @keyup="handleBlurSpec(index)" maxlength="8"></el-input>
              </el-form-item>
              <el-form-item label="规格值" :prop="`specList[${index}].valueList`" :rules="{ required: true, message: '请输入规格值x', trigger: 'blur' }">
                <div class="spec-value">
                  <div class="spec-value-patch" v-for="(value, idx) in item.valueList">
                    <el-form-item :prop="`specList[${index}].valueList[${idx}].name`" :rules="{ required: true, message: '请输入规格值', trigger: 'blur' }">
                      <el-input class="w140" v-model.trim="value.name" maxlength="8" @keyup="handleBlurValue(index, idx)"></el-input>
                    </el-form-item>
                    <span class="close">
                      <el-icon @click="handleCloseValue(index, idx)" v-if="!disabled">
                        <CircleCloseFilled />
                      </el-icon>
                    </span>
                    <UploadImage v-model:img-url="value.pic" v-if="index === 0" tips="规格图片"></UploadImage>
                  </div>
                  <span class="spec-value-patch" v-if="!disabled">
                    <CreateButton title="添加规格值" @click="handleAddValue(index)"></CreateButton>
                  </span>
                </div>
              </el-form-item>
              <span class="spec-close" v-show="index === 1">
                <el-icon @click="handleCloseSpec" v-if="!disabled">
                  <CircleCloseFilled />
                </el-icon>
              </span>
            </div>
            <div style="margin-bottom: 10px" v-show="formData.specList.length === 1">
              <el-button type="primary" size="small" @click="handleAddSpec" v-if="!disabled">添加规格</el-button>
            </div>
          </div>
          <div class="item-sku">
            <el-table border :data="formData.skuList" :span-method="handleSpanMethod" v-show="formData.skuList.length > 0">
              <el-table-column prop="primarySpecValue" min-width="120">
                <template #header>
                  <span>{{ formData.specList[0]?.specName }}</span>
                </template>
                <template #default="scope">
                  <el-form-item>
                    <span>{{ scope.row.primarySpecValue }}</span>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="secondSpecValue" min-width="120" v-if="showSecondSpec">
                <template #header>
                  <span>{{ formData.specList[1]?.specName }}</span>
                </template>
                <template #default="scope">
                  <el-form-item>
                    <span>{{ scope.row.secondSpecValue }}</span>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="成本价" prop="costPrice">
                <template #default="scope">
                  <el-form-item>
                    <el-input v-model="scope.row.costPrice" class="w80" maxlength="6" @keyup="scope.row.costPrice = numberValidator(scope.row.costPrice)" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="划线价" prop="linePrice">
                <template #default="scope">
                  <el-form-item>
                    <el-input v-model="scope.row.linePrice" class="w80" maxlength="6" @keyup="scope.row.linePrice = numberValidator(scope.row.linePrice)" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="salePrice">
                <template #header>
                  <span><span class="item-required">*</span>销售价</span>
                </template>
                <template #default="scope">
                  <el-form-item :prop="`skuList[${scope.$index}].salePrice`" :rules="{ required: true, message: '销售价不能为空', trigger: 'blur' }">
                    <el-input v-model="scope.row.salePrice" class="w80" maxlength="6" @keyup="scope.row.salePrice = numberValidator(scope.row.salePrice)" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="stock">
                <template #header>
                  <span><span class="item-required">*</span>库存</span>
                </template>
                <template #default="scope">
                  <el-form-item :prop="`skuList[${scope.$index}].stock`" :rules="{ required: true, message: '库存不能为空', trigger: 'blur' }">
                    <el-input v-model="scope.row.stock" class="w80" maxlength="5" @keyup="scope.row.stock = numberValidator(scope.row.stock)" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="虚拟销量" prop="virtualNum">
                <template #default="scope">
                  <el-form-item>
                    <el-input v-model="scope.row.virtualNum" class="w80" maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="重量(kg)" prop="weight">
                <template #default="scope">
                  <el-form-item>
                    <el-input v-model="scope.row.weight" class="w80" maxlength="6" @keyup="scope.row.weight = numberValidator(scope.row.weight)" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form-item>
      <template v-for="(item, index) in formData.skuList" :key="index" v-if="!formData.multiSpec">
        <el-form-item label="成本价">
          <el-input v-model="item.costPrice" show-word-limit maxlength="6" @keyup="item.costPrice = numberValidator(item.costPrice)" />
        </el-form-item>
        <el-form-item label="划线价">
          <el-input v-model="item.linePrice" show-word-limit maxlength="6" @keyup="item.linePrice = numberValidator(item.linePrice)" />
        </el-form-item>
        <el-form-item :prop="`skuList[${index}].salePrice`" label="销售价" :rules="{ required: true, message: '销售价不能为空', trigger: 'blur' }">
          <el-input v-model="item.salePrice" show-word-limit maxlength="6" @keyup="item.salePrice = numberValidator(item.salePrice)" />
        </el-form-item>
        <el-form-item :prop="`skuList[${index}].stock`" label="库存" :rules="{ required: true, message: '库存不能为空', trigger: 'blur' }">
          <el-input v-model="item.stock" show-word-limit maxlength="5" onkeyup="this.value=this.value.replace(/\D/g,'')" />
        </el-form-item>
        <el-form-item label="虚拟销量">
          <el-input v-model="item.virtualNum" show-word-limit maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
        </el-form-item>
        <el-form-item label="重量(kg)">
          <el-input v-model="item.weight" show-word-limit maxlength="6" @keyup="item.weight = numberValidator(item.weight)" />
        </el-form-item>
      </template>
      <el-form-item label="限购数量" prop="quota">
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
      <el-form-item label="封面图" prop="coverUrl">
        <UploadImageList v-model:file-list="formData.coverUrl" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="购买须知" prop="purchaseNotesText">
        <WangEditor v-if="!disabled" v-model:html-value="formData.purchaseNotes" v-model:text-value="formData.purchaseNotesText"></WangEditor>
        <div v-else v-html="formData.purchaseNotes" class="html-preview"/>
      </el-form-item>
      <el-form-item label="商品介绍" prop="introduceText">
        <WangEditor v-if="!disabled" v-model:html-value="formData.introduce" v-model:text-value="formData.introduceText"></WangEditor>
        <div v-else v-html="formData.introduce" class="html-preview"/>
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
import { createApi, selectApi, updateApi } from '@/api/product/item';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { errorMsg, successMsg } from '@/utils/message.js';
import { goBack, numberValidator } from '@/utils/common.js';
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
const showSecondSpec = ref(false);

const formRules = reactive({
  title: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
  depict: [
    { required: true, message: '描述信息不能为空', trigger: 'blur' },
    { min: 5, max: 40, message: '长度在 5 到 40 个字符', trigger: 'blur' }
  ],
  quota: [{ required: true, message: '限购数量不能为空', trigger: 'blur' }, { min: 1, message: '限购数量不能小于1', type: "number", trigger: 'blur' }],
  storeId: [{ required: true, message: '请选择店铺', trigger: 'change' }],
  coverUrl: [{ required: true, message: '请上传封面图', trigger: 'change' }],
  multiSpec: [{ required: true, message: '请选择是否多规格', trigger: 'change' }],
  expressId: [{ required: true, message: '请选择物流模板', trigger: 'change' }],
  deliveryType: [{ required: true, message: '请选择发货方式', trigger: 'change' }],
  purchaseNotesText: [{ required: true, message: '请填写购买须知', trigger: 'blur' }],
  introduceText: [{ required: true, message: '商家介绍不能为空', trigger: 'change' }]
});

let formData = ref({
  id: null,
  title: null,
  storeId: null,
  depict: null,
  tagList: [],
  quota: 99,
  deliveryType: 1,
  expressId: null,
  coverUrl: [],
  multiSpec: false,
  introduceText: null,
  introduce: null,
  purchaseNotes: null,
  purchaseNotesText: null,
  skuList: [
    {
      primarySpecValue: null,
      // 合并多少列
      secondSize: 0,
      secondSpecValue: null,
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
      level: 1,
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
  generateSkuTable();
};

const handleAddSpec = () => {
  if (formData.value.specList.length >= 2) {
    errorMsg('最多支持两级规格定义');
    return;
  }
  formData.value.specList.push({
    id: null,
    level: 2,
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
  generateSkuTable();
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
  const list = [];
  spec.valueList.forEach((item) => {
    if (item.name) {
      set.add(item.name);
      list.push(item.name);
    }
  });
  if (list.length !== set.size) {
    errorMsg('规格值不能重复');
    spec.valueList[idx].name = null;
    return;
  }
  generateSkuTable();
};

const generateSkuTable = () => {
  const specPrimary = formData.value.specList[0];
  formData.value.skuList = [];
  if (!specPrimary.specName || filterSpec(specPrimary).length === 0) {
    return;
  }
  let size = 0;
  if (formData.value.specList.length === 1 || !formData.value.specList[1].specName || (size = filterSpec(formData.value.specList[1]).length) === 0) {
    createPrimarySpec(specPrimary);
    showSecondSpec.value = false;
  } else {
    const secondSpec = formData.value.specList[1];
    createSecondTable(specPrimary, secondSpec, size);
  }
};

const createSecondTable = (specPrimary, secondSpec, size) => {
  for (let primary of specPrimary.valueList) {
    if (primary.name) {
      for (let second of secondSpec.valueList) {
        if (second.name) {
          formData.value.skuList.push({
            primarySpecValue: primary.name,
            secondSpecValue: second.name,
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
    }
  }
  showSecondSpec.value = true;
};

const filterSpec = (spec) => {
  return spec.valueList.filter((item) => {
    return !!item.name;
  });
};

const createPrimarySpec = (spec) => {
  for (let item of spec.valueList) {
    if (item.name) {
      formData.value.skuList.push({
        primarySpecValue: item.name,
        secondSize: 0,
        secondSpecValue: null,
        linePrice: null,
        costPrice: null,
        salePrice: null,
        stock: null,
        virtualNum: null,
        weight: null
      });
    }
  }
};

const handleSpanMethod = ({ row, rowIndex, columnIndex }) => {
  if (columnIndex === 0 && row.secondSize > 0) {
    if (rowIndex % row.secondSize === 0) {
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
  }
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.tagList.length > 0) {
        formData.value.tagId = formData.value.tagList[formData.value.tagList.length - 1];
      }
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('商品信息更新成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('商品添加成功');
            goBack(router);
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
    loadItemDetail(params.id);
  }
});

const loadItemDetail = (id) => {
  selectApi({ id: id })
    .then((res) => {
      showSecondSpec.value = res.data.specList?.length > 1;
      formData.value = { ...res.data };
      formData.value.introduceText = res.data.introduce;
      formData.value.purchaseNotesText = res.data.purchaseNotes;
    })
    .finally(() => {
      loading.value = false;
    });
};

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
    formData.value.specList = [
      {
        id: null,
        level: 1,
        specName: null,
        valueList: [
          {
            name: null,
            pic: null
          }
        ]
      }
    ];
    formData.value.skuList = [];
  } else {
    formData.value.specList = [];
    formData.value.skuList = [
      {
        primarySpecValue: null,
        secondSize: 0,
        secondSpecValue: null,
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
  width: 1100px;
  border: 1px solid #dcdfe6;
  padding: 10px;
}

.item-spec {
  .item-spec-content {
    position: relative;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 15px;

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
    margin-right: 20px;
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
</style>
