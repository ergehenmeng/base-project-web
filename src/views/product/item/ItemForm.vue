<template>
  <div class="edit-content">
    <el-divider />
    <el-form
      :model="formData"
      ref="formDataRef"
      :rules="formRules"
      label-position="right"
      label-width="auto"
      v-loading="loading"
      :disabled="disabled"
    >
      <el-form-item label="商品名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="所属店铺" prop="storeId">
        <el-select v-model="formData.storeId" filterable>
          <el-option
            v-for="item in storeList"
            :key="item.storeId"
            :label="item.storeName"
            :value="item.storeId"
          >
            <span style="float: left">{{ item.storeName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.state === 0
                ? '未上架'
                : item.state === 2
                  ? h('span', { style: 'color: red' }, '强制下架')
                  : '已上架'
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述信息" prop="depict">
        <el-input v-model="formData.depict" show-word-limit maxlength="40" />
      </el-form-item>
      <el-form-item label="标签" prop="tagId">
        <ItemTag v-model="formData.tagId"></ItemTag>
      </el-form-item>
      <el-form-item label="限购数量" prop="quota">
        <el-input
          v-model="formData.quota"
          show-word-limit
          maxlength="4"
          onkeyup="this.value=this.value.replace(/\D/g,'')"
          style="width: 100px"
        />
      </el-form-item>
      <el-form-item label="交付方式" prop="deliveryType">
        <el-radio-group v-model="formData.deliveryType">
          <el-radio :value="1">快递</el-radio>
          <el-radio :value="2">门店自提</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="物流模板" prop="expressId">
        <ExpressSelect v-model="formData.expressId" :clearable="false"></ExpressSelect>
      </el-form-item>
      <el-form-item label="规格类型" prop="multiSpec">
        <el-radio-group v-model="formData.multiSpec">
          <el-radio :value="false">单规格</el-radio>
          <el-radio :value="true">多规格</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="封面图" prop="coverList">
        <UploadImageList
          v-model:file-list="formData.coverList"
          :disabled="disabled"
        ></UploadImageList>
      </el-form-item>
      <el-form-item label="购买须知" prop="purchaseNotes">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="formData.purchaseNotes"
          autosize
          maxlength="400"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="商品介绍" prop="introduceText">
        <WangEditor
          v-if="!disabled"
          v-model:html-value="formData.introduce"
          v-model:text-value="formData.introduceText"
        ></WangEditor>
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
    <MapContainer ref="mapRef" @reload="setLocation"></MapContainer>
  </div>
</template>

<script setup>
import { createApi, selectApi, updateApi } from '@/api/product/item';
import { storeListApi } from '@/api/product/store';
import { reactive, ref } from 'vue';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import { phoneValidator } from '@/utils/common.js';
import UploadImageList from '@/components/UploadImageList.vue';
import MapContainer from '@/components/MapContainer.vue';
import ItemTag from '@/components/ItemTag.vue';
import ExpressSelect from '@/components/ExpressSelect.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const mapRef = ref();
const disabled = ref(false);
const storeList = ref([]);

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
  longitude: [{ required: true, message: '请选择经纬度', trigger: 'blur' }],
  latitude: [{ required: true, message: '请选择经纬度', trigger: 'blur' }],
  coverList: [{ required: true, message: '请上传封面图', trigger: 'change', type: 'array' }],
  introduceText: [{ required: true, message: '商家介绍不能为空', trigger: 'change' }]
});

let formData = ref({
  id: null,
  title: null,
  storeId: null,
  depict: null,
  tagId: null,
  quota: 99,
  deliveryType: 1,
  expressId: null,
  coverList: [],
  multiSpec: false,
  introduceText: null,
  introduce: null,
  purchaseNotes: null
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
            showDialog.value = false;
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('店铺添加成功');
            showDialog.value = false;
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
  storeListApi()
    .then((res) => {
      storeList.value = res.data;
    })
    .then(() => {
      const params = route.params;
      if (params.id !== undefined) {
        loading.value = true;
        // 详情页面进来不可点击
        disabled.value = route.fullPath.startsWith('/product/item/detail');
        selectApi(params)
          .then((res) => {
            formData.value = { ...res.data };
            if (res.data.coverUrl) {
              formData.value.coverList = res.data.coverUrl.split(',');
            } else {
              formData.value.coverList = [];
            }
            formData.value.areaList = [res.data.provinceId, res.data.cityId, res.data.countyId];
            formData.value.introduceText = res.data.introduce;
          })
          .finally(() => {
            loading.value = false;
          });
      }
    });
});
const handleMap = () => {
  mapRef.value.openDialog(formData.value.longitude, formData.value.latitude);
};

const setLocation = (lng, lat) => {
  formData.value.longitude = lng;
  formData.value.latitude = lat;
};
</script>
