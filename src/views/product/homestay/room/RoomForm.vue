<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="房型名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="所属民宿" prop="homestayId">
        <HomestaySelect v-model="formData.homestayId" :disabled="disabled" :clearable="false" :width="350"></HomestaySelect>
      </el-form-item>
      <el-form-item label="房型" prop="roomType">
        <el-select v-model="formData.roomType">
          <el-option label="标间" :value="1" />
          <el-option label="大床房" :value="2" />
          <el-option label="双人房" :value="3" />
          <el-option label="钟点房" :value="4" />
          <el-option label="套房" :value="5" />
          <el-option label="合租" :value="6" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单确认方式" prop="confirmType">
        <el-radio-group v-model="formData.confirmType">
          <el-radio label="自动确认" :value="1" title="系统自动自动确认有房"></el-radio>
          <el-radio label="手动确认" :value="2" title="需要人工在管理后台进行手动确认是否有房"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="退款方式" prop="refundType">
        <el-radio-group v-model="formData.refundType">
          <el-radio :value="1">直接退款</el-radio>
          <el-radio :value="2">审核后退款</el-radio>
          <el-radio :value="0">不支持退款<QuestionTip content="注意：支持商户人员发起退款"/></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="退款说明" prop="refundDescribe">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 5 }" v-model="formData.refundDescribe" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="面积" prop="dimension">
        <el-input v-model="formData.dimension" show-word-limit maxlength="3" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="居住人数" prop="resident">
        <el-input v-model="formData.resident" show-word-limit maxlength="2" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <UploadImageList v-model:file-list="formData.coverUrl" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="屋内设施" prop="infrastructure">
        <div style="padding: 0 10px;">
          <el-collapse style="width: 780px;">
            <el-collapse-item title="热门设施" name="1">
              <el-checkbox-group v-model="formData.infrastructure">
                <el-checkbox v-for="item in hotInstitutionList" :key="item.hiddenValue" :label="item.showValue" :value="item.hiddenValue"></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item title="卫浴设施" name="2">
              <el-checkbox-group v-model="formData.infrastructure">
                <el-checkbox v-for="item in bathroomList" :key="item.hiddenValue" :label="item.showValue" :value="item.hiddenValue"></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item title="媒体影音" name="3">
              <el-checkbox-group v-model="formData.infrastructure">
                <el-checkbox v-for="item in mediaList" :key="item.hiddenValue" :label="item.showValue" :value="item.hiddenValue"></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item title="配套家电" name="4">
              <el-checkbox-group v-model="formData.infrastructure">
                <el-checkbox v-for="item in applianceList" :key="item.hiddenValue" :label="item.showValue" :value="item.hiddenValue"></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item title="客房景观" name="5">
              <el-checkbox-group v-model="formData.infrastructure">
                <el-checkbox v-for="item in landscapeList" :key="item.hiddenValue" :label="item.showValue" :value="item.hiddenValue"></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item title="儿童设施" name="6">
              <el-checkbox-group v-model="formData.infrastructure">
                <el-checkbox v-for="item in childrenList" :key="item.hiddenValue" :label="item.showValue" :value="item.hiddenValue"></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
          </el-collapse>
        </div>
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
import { createApi, selectApi, updateApi } from '@/api/product/room';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import UploadImageList from '@/components/UploadImageList.vue';
import useDictStore from '@/store/dict.js';
import HomestaySelect from '@/components/HomestaySelect.vue';
import { goBack } from '@/utils/common.js';
import QuestionTip from '@/components/QuestionTip.vue'

const dictStore = useDictStore();
const hotInstitutionList = dictStore.getDict('hot_institution');
const bathroomList = dictStore.getDict('bathroom');
const childrenList = dictStore.getDict('children');
const mediaList = dictStore.getDict('media');
const applianceList = dictStore.getDict('appliance');
const landscapeList = dictStore.getDict('landscape');
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);

const formRules = reactive({
  title: [{ required: true, message: '房型名称不能为空', trigger: 'blur' }],
  homestayId: [{ required: true, message: '请选择所属民宿', trigger: 'change' }],
  roomType: [{ required: true, message: '请选择房型', trigger: 'change' }],
  confirmType: [{ required: true, message: '请选择订单确认方式', trigger: 'change' }],
  refundType: [{ required: true, message: '请选择退款方式', trigger: 'change' }],
  dimension: [{ required: true, message: '面积不能为空', trigger: 'blur' }],
  resident: [{ required: true, message: '居住人数不能为空', trigger: 'blur' }],
  infrastructure: [{ required: true, message: '请选择屋内设施', trigger: 'change', type: 'array' }],
  coverUrl: [{ required: true, message: '请上传封面图', trigger: 'change', type: 'array' }],
  introduceText: [{ required: true, message: '详细介绍不能为空', trigger: 'change' }],
  notesInText: [{ required: true, message: '入住须知不能为空', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: null,
  homestayId: null,
  roomType: null,
  confirmType: 1,
  refundType: 1,
  refundDescribe: null,
  dimension: null,
  resident: null,
  coverUrl: [],
  introduceText: null,
  introduce: null,
  infrastructure: []
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('房型信息更新成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('房型添加成功');
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
    disabled.value = route.fullPath.startsWith('/product/room/detail');
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        formData.value.introduceText = res.data.introduce;
      })
      .finally(() => {
        loading.value = false;
      });
  }
});
</script>
