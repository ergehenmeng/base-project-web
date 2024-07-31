<template>
  <div class="edit-content">
    <el-divider />
    <el-form label-width="150" label-position="left" v-loading="loading">
      <el-form-item label="商户名称：">
        {{ detail.merchantName }}
      </el-form-item>
      <el-form-item label="商家类型：">
        <el-checkbox-group v-model="detail.typeList" disabled>
          <el-checkbox :value="1" label="景区"></el-checkbox>
          <el-checkbox :value="2" label="民宿"></el-checkbox>
          <el-checkbox :value="4" label="餐饮"></el-checkbox>
          <el-checkbox :value="8" label="零售"></el-checkbox>
          <el-checkbox :value="16" label="线路"></el-checkbox>
          <el-checkbox :value="32" label="场馆"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="企业类型：">
        {{ detail.enterpriseType === 1 ? '个人' : '企业' }}
      </el-form-item>
      <el-form-item label="平台服务费："> {{ detail.platformServiceRate }} % </el-form-item>
      <el-form-item label="社会统一信用代码：">
        {{ detail.creditCode }}
      </el-form-item>
      <el-form-item label="营业执照图片：">
        <el-image
          fit="cover"
          :src="detail.businessLicenseUrl?.split(',')[0]"
          :preview-src-list="detail.businessLicenseUrl?.split(',')"
          style="width: 50px; height: 50px"
          preview-teleported
          hide-on-click-modal
        />
      </el-form-item>
      <el-form-item label="法人姓名：">
        {{ detail.legalName }}
      </el-form-item>
      <el-form-item label="法人身份证：">
        {{ detail.legalIdCard }}
      </el-form-item>
      <el-form-item label="法人身份证图片：">
        <el-image fit="cover" :src="detail.legalUrl?.split(',')[0]" :preview-src-list="detail.legalUrl?.split(',')" style="width: 50px; height: 50px" preview-teleported hide-on-click-modal />
      </el-form-item>
      <el-form-item label="联系人电话：">
        {{ detail.mobile }}
      </el-form-item>
      <el-form-item label="微信授权手机号：">
        <div v-if="detail.authMobile" style="display: flex; align-items: center"
          ><span>{{ detail.authMobile }}</span
          >&nbsp;<el-button v-has-perm="'Ywu0'" type="primary" :icon="Unlock" @click="handleUnBind" link style="font-size: 18px" title="解绑微信手机号"></el-button>
        </div>
        <div v-else>
          <el-button type="primary" :icon="Connection" @click="handleBind" style="font-size: 18px" link title="绑定微信手机号"></el-button>
        </div>
      </el-form-item>
      <el-form-item label="详细地址：">
        {{ detail.detailAddress }}
      </el-form-item>
    </el-form>
  </div>
  <UnbindForm ref="formRef" @reload="handleReload"></UnbindForm>
  <QRCodeForm ref="qrCodeRef" tips="请使用微信小程序扫码绑定手机号" file-name="商户授权手机号二维码"></QRCodeForm>
</template>
<script setup>
import { detailApi, generateApi } from '@/api/merchant/detail';
import { Connection, Unlock } from '@element-plus/icons-vue';
import UnbindForm from './UnbindForm.vue';
import { useRouter } from 'vue-router';
import useUserStore from '@/store/user.js';
import QRCodeForm from '@/views/common/QRCodeForm.vue'

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('nwu0');
const router = useRouter();
const formRef = ref();
const qrCodeRef = ref();
const loading = ref(false);

const detail = ref({
  merchantName: null,
  enterpriseType: null,
  creditCode: null,
  businessLicenseUrl: null,
  legalName: null,
  legalIdCard: null,
  legalUrl: null,
  typeList: [],
  platformServiceRate: null,
  mobile: null,
  authMobile: null,
  detailAddress: null
});

onMounted(async () => {
  if (!selectAuth) {
    return;
  }
  const { data } = await detailApi();
  detail.value = data;
});

const handleBind = () => {
  loading.value = true
  generateApi().then(({data: { authCode, expireTime}}) => {
    qrCodeRef.value.openDialog({ base64: authCode, remark: '授权过期时间：' + expireTime});
  }).finally(() => {
    loading.value = false;
  });
};

const handleReload = () => {
  router.go(0);
};

const handleUnBind = () => {
  formRef.value.openDialog();
};
</script>
