<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled" :validate-on-rule-change="false">
      <el-form-item label="活动名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="活动时间" prop="timeList">
        <div style="width: 350px">
          <el-date-picker type="datetimerange" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" time-format="HH:mm" v-model="formData.timeList" style="width: 350px"></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="拼团人数" prop="num">
        <el-input v-model="formData.num" show-word-limit maxlength="1" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="拼团有效期" prop="expireTime">
        <el-input v-model="formData.expireTime" placeholder="单位:分钟" show-word-limit maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="商品信息" prop="itemId">
        <el-select v-model="formData.itemId" filterable @change="handleItemChange">
          <el-option v-for="item in itemList" :key="item.id" :value="item.id" :label="item.title" :disabled="item.state === 2 || item.title === null">
            <span style="float: left">{{ item.title === null ? '未命名' : item.title }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.state === 0 ? '未上架' : item.state === 2 ? '强制下架' : '已上架' }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品详情" prop="skuList">
        <el-table :data="allSkuList" border style="width: 600px" @selection-change="handleSelectionChange">
          <el-table-column prop="id" label="选择" type="selection" width="60"></el-table-column>
          <el-table-column prop="skuPic" label="封面图片" width="100">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-image
                  fit="contain"
                  :src="scope.row.skuPic?.split(',')[0]"
                  :preview-src-list="scope.row.skuPic?.split(',')"
                  style="width: 50px; height: 50px"
                  preview-teleported
                  hide-on-click-modal
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="specValue" label="规格名称" min-width="150" />
          <el-table-column prop="salePrice" label="销售价格" width="130" />
          <el-table-column width="110" >
            <template #header>
              <span><span class="item-required">*</span>拼团价格</span>
            </template>
            <template #default="scope" >
              <el-form-item :prop="`skuList[${scope.$index}].discountPrice`" validate-status="validating" :rules="getSkuRule(scope.row.skuId)">
                <el-input v-if="showElement(scope.row.skuId)" v-model="scope.row.discountPrice" class="w80" maxlength="6" @keyup="scope.row.discountPrice = numberValidator(scope.row.discountPrice)" />
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
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
import { createApi, itemListApi, selectApi, updateApi } from '@/api/marketing/group';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import { goBack, numberValidator } from '@/utils/common.js';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const itemList = ref([]);
const skuMap = new Map();
const allSkuList = ref([]);

const formRules = reactive({
  title: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
  itemId: [{ required: true, message: '请选择商品', trigger: 'change' }],
  timeList: [{ required: true, message: '活动时间不能为空', trigger: 'blur' }],
  num: [{ required: true, message: '拼团人数不能为空', trigger: 'blur' }],
  expireTime: [{ required: true, message: '拼团有效期不能为空', trigger: 'blur' }],
  skuList: [{ required: true, message: '请选择要拼团商品', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: '',
  itemId: null,
  timeList: [],
  num: null,
  expireTime: null,
  // 选中的sku列表
  skuList: []
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('拼团活动更新成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('拼团活动添加成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

const loadingItemList = (id) => {
  itemListApi({ id: id }).then((res) => {
    itemList.value = res.data;
    itemList.value.forEach((item) => {
      skuMap.set(item.id, item.skuList);
    });
    handleItemChange(formData.value.itemId);
  });
};

const handleItemChange = (value) => {
  const sku = skuMap.get(value);
  if (sku) {
    allSkuList.value = sku;
  } else {
    allSkuList.value = [];
  }
};

const handleSelectionChange = (val) => {
  formData.value.skuList = val;
};

/**
 * 该行选中则校验拼团价格,否则不校验
 * @type {ComputedRef<function(*): [{trigger: string, message: string, required: boolean}]|[]>}
 */
const getSkuRule = computed(() => {
  return (id) => {
    const selectList = formData.value.skuList.filter((item) => item.skuId === id);
    return selectList.length > 0
      ? [
          {
            required: true,
            message: '拼团价格不能为空',
            trigger: 'blur'
          }
        ]
      : [];
  };
});

const showElement = computed(() => {
  return (id) => {
    const selectList = formData.value.skuList.filter((item) => item.skuId === id);
    return selectList.length > 0;
  };
});

onMounted(() => {
  const params = route.params;
  if (params.id !== undefined) {
    loading.value = true;
    disabled.value = route.fullPath.startsWith('/marketing/group/detail');
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        formData.value.timeList = [res.data.startTime, res.data.endTime];
        loadingItemList(params.id);
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    loadingItemList();
  }
});
</script>
