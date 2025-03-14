<template>
  <div class="edit-content">
    <h4>基础信息</h4>
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="线路名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="所属旅行社" prop="travelAgencyId">
        <TravelSelect v-model="formData.travelAgencyId" :clearable="false" :disabled="disabled"></TravelSelect>
      </el-form-item>
      <el-form-item label="出发城市" prop="startCity">
        <ProvinceCitySelect v-model="formData.startCity" />
      </el-form-item>
      <el-form-item label="游玩天数" prop="duration">
        <el-select v-model="formData.duration" @change="changeDay">
          <el-option label="一日游" :value="1" />
          <el-option label="二日游" :value="2" />
          <el-option label="三日游" :value="3" />
          <el-option label="四日游" :value="4" />
          <el-option label="五日游" :value="5" />
          <el-option label="六日游" :value="6" />
          <el-option label="七日游" :value="7" />
          <el-option label="八日游" :value="8" />
          <el-option label="九日游" :value="9" />
          <el-option label="十日游" :value="10" />
          <el-option label="十一日游" :value="11" />
          <el-option label="十二日游" :value="12" />
          <el-option label="十三日游" :value="13" />
          <el-option label="十四日游" :value="14" />
          <el-option label="十五日游" :value="15" />
        </el-select>
      </el-form-item>
      <el-form-item label="虚拟销量" prop="virtualNum">
        <el-input v-model="formData.virtualNum" placeholder="不填写默认为0" show-word-limit maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="提前购票(天)" prop="advanceDay">
        <el-input v-model="formData.advanceDay" show-word-limit maxlength="2" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="退款方式" prop="refundType">
        <el-radio-group v-model="formData.refundType">
          <el-radio :value="1">直接退款</el-radio>
          <el-radio :value="2">审核后退款</el-radio>
          <el-radio :value="0">不支持退款</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="退款说明" prop="refundDescribe">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" v-model="formData.refundDescribe" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <UploadImageList v-model:file-list="formData.coverUrl" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="详细介绍" prop="introduceText">
        <WangEditor v-if="!disabled" v-model:html-value="formData.introduce" v-model:text-value="formData.introduceText" :width="570" :height="300"></WangEditor>
        <div v-else v-html="formData.introduce" class="html-preview"/>
      </el-form-item>
      <h4>游玩信息</h4>
      <el-divider />
      <div class="line-day-config">
        <div v-for="(item, index) in formData.configList" :key="index" class="line-day-config-item">
          <h5 style="margin-bottom: 10px; margin-left: 20px">第{{ index + 1 }}天行程</h5>
          <el-form-item label="起始地" :prop="`configList[${index}].startPoint`" :rules="{ required: true, message: '起始地不能为空', trigger: 'blur' }">
            <el-input v-model="item.startPoint" placeholder="出发地" show-word-limit maxlength="10" class="w220" />
            &nbsp;-&nbsp;
            <el-input v-model="item.endPoint" placeholder="目的地" show-word-limit maxlength="10" class="w220" />
          </el-form-item>
          <el-form-item label="交通方式" :prop="`configList[${index}].trafficType`" :rules="{ required: true, message: '交通方式不能为空', trigger: 'change' }">
            <el-radio-group v-model="item.trafficType">
              <el-radio :value="1">飞机</el-radio>
              <el-radio :value="2">汽车</el-radio>
              <el-radio :value="3">轮船</el-radio>
              <el-radio :value="4">火车</el-radio>
              <el-radio :value="5">其他</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="餐饮">
            <el-checkbox-group v-model="item.repastList">
              <el-checkbox label="早餐" :value="1" />
              <el-checkbox label="午餐" :value="2" />
              <el-checkbox label="晚餐" :value="4" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="游玩介绍" :prop="`configList[${index}].depictText`" :rules="{ required: true, message: '游玩介绍不能为空', trigger: 'blur' }">
            <WangEditor v-if="!disabled" v-model:html-value="item.depict" v-model:text-value="item.depictText" :width="570" :height="300"></WangEditor>
            <div v-else v-html="item.depict" class="html-preview"/>
          </el-form-item>
        </div>
      </div>
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
import { createApi, selectApi, updateApi } from '@/api/product/line';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import ProvinceCitySelect from '@/components/ProvinceCitySelect.vue';
import WangEditor from '@/components/WangEditor.vue';
import UploadImageList from '@/components/UploadImageList.vue';
import TravelSelect from '@/components/TravelSelect.vue';
import { goBack } from '@/utils/common.js';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const formRules = reactive({
  title: [{ required: true, message: '线路名称不能为空', trigger: 'blur' }],
  travelAgencyId: [{ required: true, message: '请选择所属旅行社', trigger: 'change' }],
  startCity: [{ required: true, message: '请选择出发城市', trigger: 'change', type: 'array' }],
  refundType: [{ required: true, message: '请选择退款方式', trigger: 'change' }],
  coverUrl: [{ required: true, message: '请上传封面图', trigger: 'change', type: 'array' }],
  duration: [{ required: true, message: '游玩天数不能为空', trigger: 'change' }],
  advanceDay: [{ required: true, message: '提前购票不能为空', trigger: 'blur' }],
  introduceText: [{ required: true, message: '详细介绍不能为空', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: null,
  travelAgencyId: null,
  startCity: [],
  coverUrl: [],
  virtualNum: 0,
  duration: 1,
  refundType: 1,
  refundDescribe: null,
  advanceDay: 1,
  configList: [
    {
      routeIndex: 1,
      startPoint: null,
      endPoint: null,
      trafficType: null,
      repastList: [],
      depict: null,
      depictText: null
    }
  ],
  introduceText: null,
  introduce: null
});

const changeDay = (value) => {
  const length = formData.value.configList.length;
  if (value > length) {
    for (let i = 0; i < value - length; i++) {
      formData.value.configList.push({
        routeIndex: length + i + 1,
        startPoint: null,
        endPoint: null,
        trafficType: null,
        repastList: [],
        depict: null,
        depictText: null
      });
    }
  } else {
    for (let i = 0; i < length - value; i++) {
      formData.value.configList.pop();
    }
  }
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      formData.value.startProvinceId = formData.value.startCity[0];
      formData.value.startCityId = formData.value.startCity[1];
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('线路信息更新成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('线路添加成功');
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
    disabled.value = route.fullPath.startsWith('/product/line/detail');
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        formData.value.startCity = [res.data.startProvinceId, res.data.startCityId];
        formData.value.introduceText = res.data.introduce;
      })
      .finally(() => {
        loading.value = false;
      });
  }
});
</script>

<style lang="scss" scoped>
.line-day-config {
  .line-day-config-item {
    width: 820px;
    border-top: 1px solid #ebeef5;
    padding-top: 20px;
  }
}

.line-day-config > .line-day-config-item:first-child {
  border-top: none;
}
</style>
