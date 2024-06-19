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
      <el-form-item label="模板名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio :value="1">启用</el-radio>
          <el-radio :value="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="计费方式" prop="chargeMode">
        <el-radio-group v-model="formData.chargeMode" @change="switchMode">
          <el-radio :value="1">按件数</el-radio>
          <el-radio :value="2">按重量</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="配送区域" prop="regionList">
        <div style="width: 1100px">
          <table>
            <tr>
              <th class="title">配送区域</th>
              <th class="item">{{ title.firstPart }}</th>
              <th class="item">{{ title.firstPrice }}</th>
              <th class="item">{{ title.nextPart }}</th>
              <th class="item">{{ title.nextUnitPrice }}</th>
            </tr>
            <tr v-for="(item, index) in formData.regionList" :key="item.regionCode">
              <td>
                <div style="display: flex; justify-content: center; align-items: center">
                  <el-tooltip :content="item.regionName" placement="top">
                    <el-text truncated style="width: 250px">{{ item.regionName }}</el-text>
                  </el-tooltip>
                  <el-button
                    v-has-perm="'9fO0'"
                    type="primary"
                    :icon="Edit"
                    @click="handleEdit(item.regionCode)"
                    link
                    title="编辑"
                  >
                  </el-button>
                  <el-button
                    v-has-perm="'afO0'"
                    type="danger"
                    :icon="Delete"
                    @click="handleDelete(item.regionCode)"
                    link
                    title="删除"
                  >
                  </el-button>
                </div>
              </td>
              <td>
                <div style="display: flex; justify-content: center; align-items: center">
                  <el-form-item
                    :prop="`regionList[${index}].firstPart`"
                    :rules="{ required: true, message: '该项不能为空', trigger: 'blur' }"
                  >
                    <el-input
                      v-model="item.firstPart"
                      onkeyup="this.value=this.value.replace(/\D/g,'')"
                      style="width: 100px"
                    />
                  </el-form-item>
                </div>
              </td>
              <td>
                <div style="display: flex; justify-content: center; align-items: center">
                  <el-form-item
                    :prop="`regionList[${index}].firstPrice`"
                    :rules="{ required: true, message: '该项不能为空', trigger: 'blur' }"
                  >
                    <el-input
                      v-model="item.firstPrice"
                      @keyup="item.firstPrice = numberValidator(item.firstPrice)"
                      style="width: 100px"
                    />
                  </el-form-item>
                </div>
              </td>
              <td>
                <div style="display: flex; justify-content: center; align-items: center">
                  <el-form-item
                    :prop="`regionList[${index}].nextPart`"
                    :rules="{ required: true, message: '该项不能为空', trigger: 'blur' }"
                  >
                    <el-input
                      v-model="item.nextPart"
                      onkeyup="this.value=this.value.replace(/\D/g,'')"
                      style="width: 100px"
                    />
                  </el-form-item>
                </div>
              </td>
              <td>
                <div style="display: flex; justify-content: center; align-items: center">
                  <el-form-item
                    :prop="`regionList[${index}].nextUnitPrice`"
                    :rules="{ required: true, message: '该项不能为空', trigger: 'blur' }"
                  >
                    <el-input
                      v-model="item.nextUnitPrice"
                      @keyup="item.nextUnitPrice = numberValidator(item.nextUnitPrice)"
                      style="width: 100px"
                    />
                  </el-form-item>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </el-form-item>
      <div style="margin-left: 80px">
        <el-button type="primary" @click="handleAddRegion">添加区域</el-button>
      </div>
    </el-form>
    <AreaTree ref="areaRef" @reload="handleReload"></AreaTree>
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
import { createApi, selectApi, updateApi } from '@/api/product/express';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { confirmMsg, successMsg } from '@/utils/message.js';
import { numberValidator } from '@/utils/common.js';
import AreaTree from '@/components/AreaTree.vue';
import { Delete, Edit } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const areaRef = ref();
const showDialog = ref(false);
const disabled = ref(false);

const formRules = reactive({
  title: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
  chargeMode: [{ required: true, message: '请选择计费方式', trigger: 'change' }],
  regionList: [{ required: true, message: '请选择配送区域', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: null,
  state: 1,
  chargeMode: 1,
  regionList: []
});

const handleAddRegion = () => {
  const regionCodes = formData.value.regionList.map((item) => item.regionCode).join(',');
  areaRef.value.openDialog(regionCodes.split(','));
};

const handleEdit = (regionCode) => {
  const regionCodes = formData.value.regionList
    .map((item) => item.regionCode)
    .filter((item) => item.regionCode !== regionCode)
    .join(',');
  areaRef.value.openDialog(regionCodes.split(','), regionCode);
};
const handleDelete = (regionCode) => {
  confirmMsg('确定要删除该区域配置吗?', () => {
    formData.value.regionList = formData.value.regionList.filter(
      (item) => item.regionCode !== regionCode
    );
  });
};

const handleReload = (json) => {
  formData.value.regionList.push({
    regionCode: json.regionCode,
    regionName: json.regionName,
    firstPart: null,
    firstPrice: null,
    nextPart: null,
    nextUnitPrice: null
  });
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('快递模板更新成功');
            showDialog.value = false;
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('快递模板添加成功');
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

const title = ref({});

const switchMode = (val) => {
  if (val === 1) {
    title.value = {
      firstPart: '首件',
      nextPart: '续件',
      firstPrice: '首件运费(元)',
      nextUnitPrice: '续件运费(元)'
    };
  } else {
    title.value = {
      firstPart: '首重(Kg)',
      nextPart: '续重(Kg)',
      firstPrice: '首重运费(元)',
      nextUnitPrice: '续重运费(元)'
    };
  }
};

onMounted(() => {
  const params = route.params;
  if (params.id) {
    loading.value = true;
    try {
      selectApi({ id: params.id }).then((res) => {
        formData.value = res.data;
        switchMode(res.data.chargeMode);
      });
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style lang="scss" scoped>
table,
td,
th {
  border-collapse: collapse;
  border: 1px solid #dcdfe6;
  text-align: center;
}

th {
  font-weight: 400;
}

th.item {
  width: 180px;
  height: 40px;
}

th.title {
  width: 350px;
  height: 40px;
}

td {
  height: 50px;
  padding-bottom: 15px;
  padding-top: 5px;
  text-align: center;
}
</style>