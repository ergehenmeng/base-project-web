<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="活动名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="活动时间" prop="timeList">
        <div style="width: 350px">
          <el-date-picker type="datetimerange" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" time-format="HH:mm" v-model="formData.timeList" style="width: 350px"></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="提前预告" prop="advanceHour">
        <el-input v-model="formData.advanceHour" placeholder="单位:小时" show-word-limit maxlength="2" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="商品信息" prop="itemIds">
        <el-select v-model="formData.itemIds" filterable @change="handleItemChange" multiple collapse-tags :max-collapse-tags="2">
          <el-option v-for="item in allItemList" :key="item.id" :value="item.id" :label="item.title" :disabled="item.state === 2 || item.title === null">
            <span style="float: left">{{ item.title === null ? '未命名' : item.title }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.state === 0 ? '未上架' : item.state === 2 ? '强制下架' : '已上架' }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品详情" prop="skuList">
        <el-table :data="formData.skuList" border style="width: 600px" :span-method="objectSpanMethod">
          <el-table-column prop="title" label="商品名称" min-width="150" />
          <el-table-column prop="specValue" label="规格名称" min-width="120">
            <template #default="scope">
              <span v-if="scope.row.specValue">{{ scope.row.specValue }}</span>
              <span v-else title="单规格商品没有规格名称">单规格</span>
            </template>
          </el-table-column>
          <el-table-column prop="salePrice" label="销售价格" min-width="120" />
          <el-table-column width="120">
            <template #header>
              <span><span class="item-required">*</span>限时价<QuestionTip content="限时价不能大于销售价"></QuestionTip></span>
            </template>
            <template #default="scope">
              <el-form-item
                :prop="`skuList[${scope.$index}].discountPrice`"
                :rules="[
                  { required: true, message: '限时价不能为空', trigger: 'blur' },
                  {
                    validator(rule, value, callback) {
                      if (parseFloat(value) > parseFloat(scope.row.salePrice)) {
                        callback(new Error('限购价不能大于销售价'));
                      } else {
                        callback();
                      }
                    }
                  }
                ]"
              >
                <el-input v-model="scope.row.discountPrice" class="w80" maxlength="6" @keyup="scope.row.discountPrice = numberValidator(scope.row.discountPrice)"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="formData.remark" maxlength="200" show-word-limit />
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
import { createApi, itemListApi, selectApi, updateApi } from '@/api/marketing/limit';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import { goBack, numberValidator } from '@/utils/common.js';
import QuestionTip from '@/components/QuestionTip.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const allItemList = ref([]);
const itemMap = new Map();

const formRules = reactive({
  title: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
  timeList: [{ required: true, message: '活动时间不能为空', trigger: 'blur' }],
  advanceHour: [
    { required: true, message: '提前预告时间不能为空', trigger: 'blur' },
    {
      validator(rule, value, callback) {
        if (parseInt(value) > 72) {
          callback(new Error('提前预告时间不能超过72小时'));
        } else {
          callback();
        }
      }
    }
  ],
  itemIds: [{ required: true, message: '请选择参与限时购的商品', trigger: 'change' }],
  skuList: [{ required: true, message: '限时价不能为空', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: null,
  timeList: [],
  advanceHour: null,
  skuList: [],
  itemIds: [],
  remark: null
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      formData.value.startTime = formData.value.timeList[0];
      formData.value.endTime = formData.value.timeList[1];
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('拼团活动更新成功');
            goBack(router)
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('拼团活动添加成功');
            goBack(router)
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
    allItemList.value = res.data;
    allItemList.value.forEach((item) => {
      itemMap.set(item.id, item);
    });
  });
};

const objectSpanMethod = ({ row, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    if (rowIndex % row.skuSize === 0) {
      return {
        rowspan: row.skuSize,
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

const handleItemChange = (itemIds) => {
  formData.value.skuList = [];
  itemIds.forEach((value) => {
    const item = itemMap.get(value);
    if (item) {
      formData.value.skuList.push(...item.skuList);
    }
  });
};

onMounted(() => {
  const params = route.params;
  if (params.id !== undefined) {
    loading.value = true;
    disabled.value = route.fullPath.startsWith('/marketing/limit/detail');
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
    loadingItemList(params.id);
  }
});
</script>