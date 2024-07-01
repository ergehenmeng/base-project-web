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
        <el-table :data="skuList" border style="width: 100%">
          <el-table-column prop="skuPic" label="封面图片" min-width="80">
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
          <el-table-column prop="salePrice" label="销售价格" min-width="150" />
        </el-table>
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
import { createApi, itemListApi, selectApi, updateApi } from '@/api/marketing/group';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const itemList = ref([]);
const skuMap = new Map();
const skuList = ref([]);

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
    itemList.value = res.data;
    itemList.value.forEach((item) => {
      skuMap.set(item.id, item.skuList);
    });
    handleItemChange(formData.value.itemId);
  });
};

const handleItemChange = (value) => {
  const sku = skuMap.get(value)
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
