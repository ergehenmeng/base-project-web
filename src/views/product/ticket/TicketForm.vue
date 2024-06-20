<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="门票名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="所属景区" prop="scenicId">
        <ScenicSelect v-model="formData.scenicId" :clearable="false" :disabled="disabled"></ScenicSelect>
      </el-form-item>
      <el-form-item label="票种" prop="category">
        <el-select v-model="formData.category">
          <el-option label="成人票" :value="1" />
          <el-option label="老人票" :value="2" />
          <el-option label="儿童票" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="划线价">
        <el-input v-model="formData.linePrice" placeholder="小于销售价时不显示" show-word-limit maxlength="6" @keyup="formData.linePrice = numberValidator(formData.linePrice)" />
      </el-form-item>
      <el-form-item label="销售价" prop="salePrice">
        <el-input v-model="formData.salePrice" show-word-limit maxlength="6" @keyup="formData.salePrice = numberValidator(formData.salePrice)" />
      </el-form-item>
      <el-form-item label="虚拟销量" prop="virtualNum">
        <el-input v-model="formData.virtualNum" placeholder="不填写默认为0" show-word-limit maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="formData.stock" show-word-limit maxlength="5" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="提前购票(天)" prop="advanceDay">
        <el-input v-model="formData.advanceDay" show-word-limit maxlength="2" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="单次限购(张)" prop="quota">
        <el-input v-model="formData.quota" placeholder="默认限购99张" show-word-limit maxlength="2" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="预定时间" prop="dueDate">
        <div style="width: 350px">
          <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="formData.dueDate" style="width: 350px"></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="核销方式" prop="verificationType">
        <el-radio-group v-model="formData.verificationType">
          <el-radio :value="1" title="核销端核销">手动核销</el-radio>
          <el-radio :value="0" title="次日凌晨自动核销">自动核销</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否实名购票" prop="realBuy">
        <el-radio-group v-model="formData.realBuy">
          <el-radio :value="true">实名制</el-radio>
          <el-radio :value="false">非实名制</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="详细介绍" prop="introduceText">
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
import { createApi, selectApi, updateApi } from '@/api/product/ticket';
import { reactive, ref } from 'vue';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import { numberValidator } from '@/utils/common.js';
import ScenicSelect from '@/components/ScenicSelect.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);

const formRules = reactive({
  title: [{ required: true, message: '门票名称不能为空', trigger: 'blur' }],
  scenicId: [{ required: true, message: '请选择所属景区', trigger: 'change' }],
  salePrice: [{ required: true, message: '销售价不能为空', trigger: 'blur' }],
  stock: [{ required: true, message: '库存不能为空', trigger: 'blur' }],
  advanceDay: [{ required: true, message: '提前购票不能为空', trigger: 'blur' }],
  dueDate: [{ required: true, message: '预定日期不能为空', trigger: 'blur', type: 'array' }],
  introduceText: [{ required: true, message: '详细介绍不能为空', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: null,
  scenicId: null,
  category: null,
  linePrice: null,
  salePrice: null,
  virtualNum: 0,
  stock: 99999,
  verificationType: 1,
  realBuy: true,
  advanceDay: 1,
  quota: 99,
  dueDate: [],
  introduceText: null,
  introduce: null
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      formData.value.startDate = formData.value.dueDate[0];
      formData.value.endDate = formData.value.dueDate[1];
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('门票信息更新成功');
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('门票添加成功');
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
    disabled.value = route.fullPath.startsWith('/product/ticket/detail');
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
