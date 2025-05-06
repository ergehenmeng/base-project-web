<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" :validate-on-rule-change="false" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="门票名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="所属景区" prop="scenicId">
        <ScenicSelect v-model="formData.scenicId" :clearable="false" :disabled="disabled"></ScenicSelect>
      </el-form-item>
      <el-form-item label="票种类型" prop="category">
        <el-select v-model="formData.category" @change="handleChangeCategory">
          <el-option label="成人" :value="1" />
          <el-option label="老人" :value="2" />
          <el-option label="儿童" :value="3" />
          <el-option label="演出" :value="4" />
          <el-option label="活动" :value="5" />
          <el-option label="研学" :value="6" />
          <el-option label="组合" :value="7" />
        </el-select>
      </el-form-item>
      <el-form-item label="组合票" prop="ticketIds" v-show="formData.category === 7">
        <el-select v-model="formData.ticketIds" multiple :multiple-limit="5" filterable>
          <el-option v-for="item in ticketList" :label="item.title" :value="item.id" :key="item.id" >
            <span style="float: left">{{ item.title }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ formatState(item.category) }}</span>
          </el-option>
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
        <el-input v-model="formData.stock" show-word-limit maxlength="5" onkeyup="this.value=this.value.replace(/\D/g,'')" /><QuestionTip content="注意：该字段为单日库存量"/>
      </el-form-item>
      <el-form-item label="提前购票(天)" prop="advanceDay">
        <el-input v-model="formData.advanceDay" show-word-limit maxlength="2" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="单日限购(张)" prop="quota">
        <el-input v-model="formData.quota" placeholder="默认限购9张" maxlength="2" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="预定时间" prop="dueDate">
        <div style="width: 350px">
          <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="formData.dueDate" style="width: 350px"></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="是否实名购票" prop="realBuy">
        <el-radio-group v-model="formData.realBuy">
          <el-radio :value="true" title="在移动端购票时需要输入姓名及身份证号">实名制</el-radio>
          <el-radio :value="false">非实名制</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="详细介绍" prop="introduceText">
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
import { createApi, selectApi, updateApi, listApi } from '@/api/product/ticket';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg, warningMsg } from '@/utils/message.js'
import { goBack, numberValidator } from '@/utils/common.js';
import ScenicSelect from '@/components/ScenicSelect.vue';
import QuestionTip from '@/components/QuestionTip.vue'

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const ticketList = ref([]);
const ticketLoaded = ref(false);

const formRules = reactive({
  title: [{ required: true, message: '门票名称不能为空', trigger: 'blur' }],
  scenicId: [{ required: true, message: '请选择所属景区', trigger: 'change' }],
  realBuy: [{ required: true, message: '请选择是否实名购票', trigger: 'change' }],
  quota: [{ required: true, message: '单日限购不能为空', trigger: 'blur' }],
  category: [{ required: true, message: '请选择票种类型', trigger: 'change' }],
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
  ticketIds: [],
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
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('门票添加成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

const formatState = computed(() => {
  return (value) => {
    switch (value) {
      case 1: return '成人票';
      case 2: return '老人票';
      case 3: return '儿童票';
      case 4: return '演出票';
      case 5: return '活动票';
      case 6: return '研学票';
      default: return '';
    }
  }
});

const handleChangeCategory = (value) => {
  if (value === 7) {
    warningMsg('注意：选择组合票时不受原始门票库存、上下架状态、预订时间的限制，且销量与原始门票无关');
  }
  formData.value.ticketIds = [];
  loadTicketList(value);
}

const loadTicketList = (value) => {
  if (value === 7) {
    if (formData.value.scenicId === null) {
      warningMsg('请先选择所属景区');
      return;
    }
    formRules.ticketIds = [{ required: true, message: '请输入组合门票', trigger: 'change'}, {
      validator: (rule, value, callback) => {
        let length = formData.value.ticketIds.length
        if (length < 2) {
          callback(new Error('组合票最少选择两张票'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }];
    if (!ticketLoaded.value) {
      listApi({scenicId : formData.value.scenicId, id: formData.value.id}).then((res) => {
        ticketList.value = res.data;
      }).finally(() => {
        ticketLoaded.value = true;
      })
    }
  } else {
    formRules.ticketIds = [];
  }
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
        loadTicketList(res.data.category);
      })
      .finally(() => {
        loading.value = false;
      });
  }
});
</script>
