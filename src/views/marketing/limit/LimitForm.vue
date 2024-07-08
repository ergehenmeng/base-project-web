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
      <el-form-item label="商品信息" prop="itemId">
        <el-select v-model="formData.itemId" filterable @change="handleItemChange" multiple collapse-tags>
          <el-option v-for="item in itemList" :key="item.id" :value="item.id" :label="item.title" :disabled="item.state === 2 || item.title === null">
            <span style="float: left">{{ item.title === null ? '未命名' : item.title }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.state === 0 ? '未上架' : item.state === 2 ? '强制下架' : '已上架' }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品详情" prop="skuList">
        <el-table :data="skuList" border style="width: 600px;" :span-method="objectSpanMethod">
          <el-table-column prop="skuPic" label="封面图片" min-width="80">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-image
                  fit="contain"
                  :src="scope.row.coverUrl?.split(',')[0]"
                  :preview-src-list="scope.row.coverUrl?.split(',')"
                  style="width: 50px; height: 50px"
                  preview-teleported
                  hide-on-click-modal
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="商品名称" min-width="150" />
          <el-table-column prop="specValue" label="规格名称" min-width="120" />
          <el-table-column prop="salePrice" label="销售价格" min-width="120" />
          <el-table-column prop="discountPrice" label="限时价" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.discountPrice" maxlength="3" @keyup="scope.row.discountPrice=numberValidator(scope.row.discountPrice);"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" v-model="formData.remark" autosize maxlength="200" show-word-limit />
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
import { createApi, itemListApi, selectApi, updateApi } from '@/api/marketing/limit';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import { numberValidator } from '@/utils/common.js'

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const allItemList = ref([]);
const itemMap = new Map();
const skuList = ref([]);

const formRules = reactive({
  title: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
  timeList: [{ required: true, message: '活动时间不能为空', trigger: 'blur' }],
  advanceHour: [{ required: true, message: '提前预告时间不能为空', trigger: 'blur' }],
  itemIds: [{ required: true, message: '请选择要拼团商品', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: null,
  timeList: [],
  advanceHour: null,
  itemIds: [],
  remark: null
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('拼团活动更新成功');
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('拼团活动添加成功');
            router.go(-1);
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
    const itemIds = formData.value.itemList.map(item => item.id);
    handleItemChange(itemIds);
  });
};

const objectSpanMethod = (row, column, rowIndex, columnIndex) => {
  if (columnIndex === 0 || columnIndex === 1) {
    if (skuList.value.length > 1) {
      return {
        rowspan: skuList.value.length,
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
  itemIds.forEach((value) => {
    const sku = itemMap.get(value)
  })

  if (sku) {
    skuList.value = sku;
  } else {
    skuList.value = []
  }
}

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
  }
});
</script>
