<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="兑换码名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="有效时间" prop="timeList">
        <div style="width: 400px">
          <el-date-picker type="datetimerange" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" time-format="HH:mm" v-model="formData.timeList" style="width: 400px"></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input v-model="formData.amount" show-word-limit maxlength="5" @keyup="formData.amount = numberValidator(formData.amount)" />
      </el-form-item>
      <el-form-item label="发放数量" prop="num">
        <el-input v-model="formData.num" show-word-limit maxlength="3" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="可使用店铺" prop="storeIds">
        <StoreAllSelect v-model:store-ids="formData.storeIds" v-model:store-list="storeList" :multiple="true"></StoreAllSelect>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" v-model="formData.remark" autosize maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { createApi, detailApi, updateApi } from '@/api/marketing/redeem';
import { storeApi } from '@/api/product';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import { numberValidator } from '@/utils/common.js'
import StoreAllSelect from '@/components/StoreAllSelect.vue'

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const storeMap = new Map();
const storeList = ref([]);
const dialogTitle = ref('');
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
  itemId: [{ required: true, message: '请选择商品', trigger: 'change' }],
  timeList: [{ required: true, message: '活动时间不能为空', trigger: 'blur' }],
  num: [{ required: true, message: '拼团人数不能为空', trigger: 'blur' }],
  expireTime: [{ required: true, message: '拼团有效期不能为空', trigger: 'blur' }],
});

const formData = ref({
  id: null,
  title: '',
  timeList: [],
  amount: null,
  num: null,
  storeIds: [],
  storeList: [],
  remark: null
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  storeApi().then(res => {
    res.data.forEach(item => {
      storeMap.set(item.storeId, item.productType)
    })
    storeList.value = res.data;
  })
  if (row.id) {
    detailApi({id: row.id})
        .then((res) => {
          formData.value = res.data;
          formData.value.timeList = [res.data.startTime, res.data.endTime];
        })
        .finally(() => {
          loading.value = false;
        });
  }

  if (row.id) {
    dialogTitle.value = '编辑兑换码';
    formData.value = { ...row };
  } else {
    dialogTitle.value = '新增兑换码';
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    timeList: [],
    amount: null,
    num: null,
    storeIds: [],
    storeList: [],
    remark: null
  };
  formDataRef.value?.resetFields();
};


const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      formData.value.startTime = formData.value.timeList[0];
      formData.value.endTime = formData.value.timeList[1];
      formData.value.storeIds.forEach(storeId => {
        formData.value.storeList.push({storeId, productType: storeMap.get(storeId)})
      })
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('兑换码配置更新成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('兑换码配置添加成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};
defineExpose({
  openDialog
});
</script>
