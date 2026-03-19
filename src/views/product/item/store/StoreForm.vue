<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="店铺名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <MerchantSelect v-model="formData.merchantId" @change="handleMerchantChange" prop="merchantId" width="350"></MerchantSelect>
      <el-form-item label="店铺LOGO" prop="logoUrl">
        <UploadImage v-model:img-url="formData.logoUrl" :disabled="disabled"></UploadImage>
      </el-form-item>
      <el-form-item label="营业时间" prop="openTime">
        <el-input v-model="formData.openTime" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="省市县" prop="areaList">
        <AreaSelect v-model="formData.areaList"></AreaSelect>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input type="textarea" v-model="formData.detailAddress"  :autosize="{ minRows: 2, maxRows: 3 }" show-word-limit maxlength="50" />
      </el-form-item>
      <el-form-item label="经纬度" prop="latitude">
        <LocationMap v-model:latitude="formData.latitude" v-model:longitude="formData.longitude"/>
      </el-form-item>
      <el-form-item label="商家电话" prop="telephone">
        <el-input v-model="formData.telephone" show-word-limit maxlength="13" />
      </el-form-item>
      <el-form-item label="收货地址" prop="depotAddressId">
        <el-select v-model="formData.depotAddressId" filterable>
          <el-option v-for="item in takeList" :key="item.id" :label="item.detailAddress" :value="item.id" :disabled="disabled">
            <span style="float: left">{{ item.detailAddress }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.nickName }}</span>
          </el-option>
        </el-select>
        <QuestionTip content="该地址是用户退换货时商家的收货地址"></QuestionTip>
      </el-form-item>
      <el-form-item label="自提点" prop="pickupId">
        <el-select v-model="formData.pickupId" filterable clearable>
          <el-option v-for="item in pickupList" :key="item.id" :label="item.detailAddress" :value="item.id" :disabled="disabled">
            <span style="float: left">{{ item.detailAddress }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.nickName }}</span>
          </el-option>
        </el-select>
        <QuestionTip content="注意：自提点为空时，商品不支持自提，已设置自提的商品也将不支持自提"></QuestionTip>
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <UploadImageList v-model:file-list="formData.coverUrl" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="商家介绍" prop="introduce">
        <WangEditor v-if="!disabled" v-model:html-value="formData.introduce" ></WangEditor>
        <div v-else v-html="formData.introduce" class="html-preview" />
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
import { addressListApi, createApi, selectApi, updateApi } from '@/api/product/store';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { errorMsg, successMsg } from '@/utils/message.js';
import { goBack, phoneValidator } from '@/utils/common.js';
import UploadImageList from '@/components/UploadImageList.vue';
import AreaSelect from '@/components/AreaSelect.vue';
import UploadImage from '@/components/UploadImage.vue';
import MerchantSelect from '@/components/MerchantSelect.vue';
import QuestionTip from '@/components/QuestionTip.vue';
import LocationMap from '@/components/LocationMap.vue'

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const takeList = ref([]);
const pickupList = ref([]);

const formRules = reactive({
  title: [{ required: true, message: '店铺名称不能为空', trigger: 'blur' }],
  logoUrl: [{ required: true, message: '请上传店铺logo', trigger: 'change' }],
  merchantId: [{ required: true, message: '请选择所属商户', trigger: 'change' }],
  telephone: [{ required: true, validator: phoneValidator, trigger: 'blur' }],
  openTime: [{ required: true, message: '营业时间不能为空', trigger: 'blur' }],
  areaList: [{ required: true, message: '请选择省市县', trigger: 'change', type: 'array' }],
  detailAddress: [
    { required: true, message: '详细地址不能为空', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  depotAddressId: [{ required: true, message: '请选择退换货地址', trigger: 'change' }],
  latitude: [{ required: true, message: '请选择经纬度', trigger: 'change' }],
  coverUrl: [{ required: true, message: '请上传封面图', trigger: 'change', type: 'array' }],
  introduce: [{ required: true, message: '商家介绍不能为空', trigger: 'change' }]
});

let formData = ref({
  id: null,
  title: null,
  logoUrl: null,
  merchantId: null,
  telephone: null,
  areaList: [],
  detailAddress: null,
  longitude: null,
  latitude: null,
  openTime: null,
  coverUrl: [],
  introduce: null,
  depotAddressId: null,
  pickupId: null
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      formData.value.provinceId = formData.value.areaList[0];
      formData.value.cityId = formData.value.areaList[1];
      formData.value.countyId = formData.value.areaList[2];
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('店铺信息更新成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('店铺添加成功');
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
    disabled.value = route.fullPath.startsWith('/product/store/detail');
    selectApi(params)
      .then((res) => {
        formData.value = { ...res.data };
        if (res.data.countyId) {
          formData.value.areaList = [res.data.provinceId, res.data.cityId, res.data.countyId];
        } else {
          formData.value.areaList = [res.data.provinceId, res.data.cityId];
        }
        handleMerchantChange(res.data.merchantId);
      })
      .finally(() => {
        loading.value = false;
      });
  }
});

/**
 * 选择商户时, 自动获取商户的退货地址
 * @param val 商户id
 */
const handleMerchantChange = (val) => {
  if (val) {
    addressListApi({ merchantId: val}).then((res) => {
      takeList.value = res.data.filter(item => item.addressType === 1);
      if (takeList.value.length === 0) {
        errorMsg('请先补充完用户退换货时的收货地址');
      }
      pickupList.value = res.data.filter(item => item.addressType === 2);
    });
  } else {
    takeList.value = [];
    pickupList.value = [];
  }
};
</script>
