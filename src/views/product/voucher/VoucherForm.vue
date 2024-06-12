<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
             v-loading="loading" :disabled="disabled">
      <el-form-item label="餐饮券名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20"/>
      </el-form-item>
      <el-form-item label="所属店铺" prop="restaurantId">
        <RestaurantSelect v-model="formData.restaurantId" :disabled="disabled" :clearable="false"></RestaurantSelect>
      </el-form-item>
      <el-form-item label="有效日期" >
        <el-radio-group v-model="formData.validType" @change="validTypeChange">
          <el-radio :value="0">按购买日计算</el-radio>
          <el-radio :value="1">按时间段计算</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="有效期" :prop="validTypeProp" :rules="validTypeRules">
        <div v-if="formData.validType === 0">
        购买起始日起<el-input style="width: 50px; margin: 0 5px;" onkeyup="this.value=this.value.replace(/\D/g,'')" v-model="formData.validDays" maxlength="3" ></el-input>天有效
        </div>
        <div v-else>
          <el-date-picker type="daterange" :disabled-date="disableBeforeDate" value-format="YYYY-MM-DD" v-model="formData.activityDate" style="width: 350px;" ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="可用时间段" prop="timeList">
        <div style="width: 350px;">
          <el-time-picker is-range v-model="formData.timeList" style="width: 350px;" format="HH:mm" value-format="HH:mm"></el-time-picker>
        </div>
      </el-form-item>
      <el-form-item label="划线价" prop="linePrice">
        <el-input v-model="formData.linePrice" placeholder="划线价小于销售价时不显示" show-word-limit maxlength="8" @keyup="formData.linePrice=numberValidator(formData.linePrice);"/>
      </el-form-item>
      <el-form-item label="销售价" prop="salePrice">
        <el-input v-model="formData.salePrice" show-word-limit maxlength="8" @keyup="formData.salePrice=numberValidator(formData.salePrice);"/>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="formData.stock" onkeyup="this.value=this.value.replace(/\D/g,'')" show-word-limit maxlength="5"/>
      </el-form-item>
      <el-form-item label="虚拟销量" prop="virtualNum">
        <el-input v-model="formData.virtualNum" onkeyup="this.value=this.value.replace(/\D/g,'')" show-word-limit maxlength="5"/>
      </el-form-item>
      <el-form-item label="限购数量" prop="quota">
        <el-input v-model="formData.quota" onkeyup="this.value=this.value.replace(/\D/g,'')" show-word-limit maxlength="2"/>
      </el-form-item>
      <el-form-item label="购买说明" prop="depict">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="formData.depict" autosize
                  maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item label="封面图" prop="coverList">
        <UploadImageList  v-model:file-list="formData.coverList" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="餐饮券介绍" prop="introduceText">
        <WangEditor v-if="!disabled" v-model:html-value="formData.introduce" v-model:text-value="formData.introduceText" ></WangEditor>
        <div v-else v-html="formData.introduce"></div>
      </el-form-item>
    </el-form>
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
import {createApi, selectApi, updateApi} from '@/api/product/voucher';
import {reactive, ref} from 'vue';
import WangEditor from "@/components/WangEditor.vue";
import {useRoute, useRouter} from "vue-router";
import {successMsg} from "@/utils/message.js";
import RestaurantSelect from "@/components/RestaurantSelect.vue";
import {disableBeforeDate, numberValidator} from "@/utils/common.js";
import UploadImageList from "@/components/UploadImageList.vue";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const disabled = ref(false);
const validTypeProp = ref('validDays');
const validTypeRules = ref({});

const formRules = reactive({
  title: [
    {required: true, message: "餐饮券名称不能为空", trigger: 'blur'}
  ],
  restaurantId: [
    {required: true, message: "请选择所属店铺", trigger: 'change'}
  ],
  salePrice: [
    {required: true, message: "销售价不能为空", trigger: 'blur'},
  ],
  timeList: [
    {required: true, message: "可用时间段不能为空", trigger: 'blur', type: 'array'},
  ],
  stock: [
    {required: true, message: "库存不能为空", trigger: 'blur'}
  ],
  coverList: [
      {required: true, message: "封面图不能为空", trigger: 'change', type: 'array'},
  ],
  quota: [
    {required: true, message: "限购数量不能为空", trigger: 'blur'},
  ],
  depict: [
    {required: true, message: "购买说明不能为空", trigger: 'blur'},
  ],
  introduceText: [
    {required: true, message: "餐饮券介绍不能为空", trigger: 'change'}
  ]
})

let formData = ref({
  id: null,
  title: null,
  restaurantId: null,
  linePrice: null,
  salePrice: null,
  stock: null,
  validType: 0,
  virtualNum: null,
  depict: null,
  quota: null,
  validDays: null,
  effectDate: null,
  expireDate: null,
  timeList: [],
  effectTime: null,
  expireTime: null,
  coverList: [],
  activityDate: [],
  introduceText: null,
  introduce: null
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.validType === 1) {
        formData.value.effectDate = formData.value.activityDate[0];
        formData.value.expireDate = formData.value.activityDate[1];
      } else {
        formData.value.effectDate = null;
        formData.value.expireDate = null;
      }
      formData.value.effectTime = formData.value.timeList[0];
      formData.value.expireTime = formData.value.timeList[1];
      if (formData.value.id) {
        updateApi(formData.value).then(() => {
          successMsg("餐饮券信息更新成功");
          showDialog.value = false;
          router.go(-1);
        }).finally(() => {
          loading.value = false;
        })
      } else {
        createApi(formData.value).then(() => {
          successMsg("餐饮券添加成功");
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
  const params = route.params;
  if (params.id !== undefined) {
    loading.value = true;
    // 详情页面进来不可点击
    disabled.value = route.fullPath.startsWith("/product/restaurant/detail");
    selectApi(params).then(res => {
      formData.value = {...res.data};
      if (res.data.coverUrl) {
        formData.value.coverList = res.data.coverUrl.split(",");
      } else {
        formData.value.coverList = [];
      }
      formData.value.timeList = [res.data.effectTime, res.data.expireTime];
      formData.value.introduceText = res.data.introduce;
      validTypeChange(formData.value.validType)
      if (res.data.validDays > 0) {
        formData.value.validType = 0;
        formData.value.validDays = res.data.validDays;
      } else {
        formData.value.validDays = null;
        formData.value.validType = 1;
        formData.value.activityDate = [res.data.effectDate, res.data.expireDate];
      }
      console.log(formData.value)
    }).finally(() => {
      loading.value = false;
    })
  }
  validTypeChange(formData.value.validType)
})

const validTypeChange = (val) => {
  if (val === 0) {
    formData.value.activityDate = null;
    validTypeProp.value = 'validDays';
    validTypeRules.value = {required: true, message: "有效期不能为空", trigger: 'blur'};
  } else {
    formData.value.validDays = null;
    validTypeProp.value = 'activityDate';
    validTypeRules.value = {required: true, message: "时间段不能为空", trigger: 'blur'};
  }
}


</script>

