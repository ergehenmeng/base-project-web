<template>
  <div class="edit-content">
    <h4>基础信息</h4>
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
             v-loading="loading" :disabled="disabled">
      <el-form-item label="线路名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20"/>
      </el-form-item>
      <el-form-item label="所属旅行社" prop="travelAgencyId">
        <el-select v-model="formData.travelAgencyId">
          <el-option v-for="item in travelList" :key="item.id" :value="item.id" :label="item.title" :disabled="item.state === 2">
            <span style="float: left">{{ item.title }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.state === 0 ? '未上架' : (item.state === 2 ? '强制下架' :'已上架') }}</span>
          </el-option>
        </el-select>
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
        <el-radio-group v-model="formData.refundType" >
          <el-radio :value="0" >不支持退款</el-radio>
          <el-radio :value="1" >直接退款</el-radio>
          <el-radio :value="2" >审核后退款</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="退款说明" prop="refundDescribe" >
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" v-model="formData.refundDescribe" autosize
                  maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="详细介绍" prop="introduce">
        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 8 }" v-model="formData.introduce" autosize
                  maxlength="400" show-word-limit />
      </el-form-item>
      <h4>游玩信息</h4>
      <el-divider />
      <div class="line-day-config">
        <div v-for="(item, index) in formData.configList" :key="index" class="line-day-config-item">
          <h5 style="margin-bottom: 10px; margin-left: 20px;">第{{ index + 1 }}天行程</h5>
          <el-form-item label="起始地" :prop="`configList[${index}].startPoint`" :rules="{required: true, message: '起始地不能为空', trigger: 'blur'}">
            <el-input v-model="item.startPoint" placeholder="出发地" show-word-limit maxlength="10" style="width: 200px !important;" />
            &nbsp;-&nbsp;
            <el-input v-model="item.endPoint" placeholder="目的地" show-word-limit maxlength="10" style="width: 200px !important;"/>
          </el-form-item>
          <el-form-item label="交通方式" :prop="`configList[${index}].trafficType`" :rules="{required: true, message: '交通方式不能为空', trigger: 'change'}">
            <el-radio-group v-model="item.trafficType" >
              <el-radio :value="1" >飞机</el-radio>
              <el-radio :value="2" >汽车</el-radio>
              <el-radio :value="3" >轮船</el-radio>
              <el-radio :value="4" >火车</el-radio>
              <el-radio :value="5" >其他</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="餐饮">
            <el-checkbox-group v-model="item.repast">
              <el-checkbox label="早餐" :value="1" />
              <el-checkbox label="午餐" :value="2" />
              <el-checkbox label="晚餐" :value="4" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="详细介绍" :prop="`configList[${index}].depictText`" :rules="{required: true, message: '详细介绍不能为空', trigger: 'blur'}">
            <WangEditor v-model:html-value="item.depict" v-model:text-value="item.depictText" :width="570" :height="300"></WangEditor>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-backtop :right="100" :bottom="100" />
    <div >
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
import {createApi, selectApi, updateApi, travelListApi} from '@/api/product/line';
import {reactive, ref} from 'vue';
import {useRoute, useRouter} from "vue-router";
import {successMsg} from "@/utils/message.js";
import ProvinceCitySelect from "@/components/ProvinceCitySelect.vue";
import WangEditor from "@/components/WangEditor.vue";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const disabled = ref(false);
const travelList = ref([]);
const formRules = reactive({
  title: [
    {required: true, message: "线路名称不能为空", trigger: 'blur'}
  ],
  travelAgencyId: [
    {required: true, message: "请选择所属旅行社", trigger: 'change'}
  ],
  startCity: [
    {required: true, message: "请选择出发城市", trigger: 'change', type: "array"}
  ],
  refundType: [
    {required: true, message: "请选择退款方式", trigger: 'change'},
  ],
  duration: [
    {required: true, message: "游玩天数不能为空", trigger: 'change'},
  ],
  advanceDay: [
    {required: true, message: "提前购票不能为空", trigger: 'blur'}
  ],
  introduceText: [
    {required: true, message: "详细介绍不能为空", trigger: 'change'}
  ]
})

const formData = ref({
  id: null,
  title: null,
  travelAgencyId: null,
  startCity: [],
  coverList: [],
  virtualNum: 0,
  duration: 1,
  refundType: 1,
  refundDescribe: null,
  advanceDay: 1,
  configList: [{
    routeIndex: 1,
    startPoint: null,
    endPoint: null,
    trafficType: null,
    repast: [],
    depict: null,
    depictText: null
  }],
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
        repast: [],
        depict: null,
        depictText: null
      })
    }
  } else {
    for (let i = 0; i < length - value; i++) {
      formData.value.configList.pop();
    }
  }
}

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    console.log(formData.value);
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value).then(() => {
          successMsg("线路信息更新成功");
          showDialog.value = false;
          router.go(-1);
        }).finally(() => {
          loading.value = false;
        })
      } else {
        createApi(formData.value).then(() => {
          successMsg("线路添加成功");
          showDialog.value = false;
          router.go(-1);
        }).finally(() => {
          loading.value = false;
        })
      }
    }
  })
}

onMounted(() => {
  travelListApi().then(res => {
    travelList.value = res.data;
  }).then(() => {
    const params = route.params;
    if (params.id !== undefined) {
      loading.value = true;
      // 详情页面进来不可点击
      disabled.value = route.fullPath.startsWith("/product/line/detail");
      selectApi(params).then(res => {
        formData.value = res.data;
        formData.value.dueDate = [res.data.startDate, res.data.endDate];
        formData.value.introduceText = res.data.introduce;
      }).finally(() => {
        loading.value = false;
      })
    }
  })


})


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