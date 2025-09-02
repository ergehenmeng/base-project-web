<template>
  <el-dialog v-model="showDialog" width="770px" draggable align-center :close-on-click-modal="false">
    <template #header>
      <span>添加配置<QuestionTip content="当顾客在店内扫码点餐时，可以在此配置必点的餐品。例如：餐具、纸巾、赠送的菜品等"/></span>
    </template>
    <el-form :model="formData" ref="formDataRef" label-position="right" label-width="0px" v-loading="loading">
      <el-table :data="formData.configList">
        <el-table-column prop="voucherId" label="商品" min-width="350">
          <template #default="scope">
            <el-form-item :prop="`configList[${scope.$index}].voucherId`" :rules="{ required: true, message: '请选择商品', trigger: 'change' }">
              <el-select v-model="scope.row.voucherId" placeholder="请选择商品" class="w300" filterable>
                <el-option v-for="item in vList" :key="item.id" :value="item.id" :label="item.title" :disabled="item.state === 2 || item.title === null">
                  <span style="float: left; width: 200px">{{ item.title === null ? '未命名' : item.title }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.state === 0 ? '未上架' : item.state === 2 ? '强制下架' : '已上架' }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="数量" width="120">
          <template #default="scope">
            <el-form-item :prop="`configList[${scope.$index}].num`" :rules="{ required: true, message: '请选择数量', trigger: 'blur' }">
              <el-input v-model="scope.row.num" maxlength="1" class="w80" onkeyup="this.value=this.value.replace(/\D/g,'')" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="matchType" label="匹配方式" min-width="150">
          <template #default="scope">
            <el-form-item :prop="`configList[${scope.$index}].matchType`" :rules="{ required: true, message: '请选择匹配方式', trigger: 'change' }">
              <el-select v-model="scope.row.matchType" class="w120">
                <el-option :value="1" label="按人数计算"></el-option>
                <el-option :value="2" label="按桌计算"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="100" align="center">
          <template #header>
            <span>操作</span>
            <CreateButton title="新增配置" @click="handleAdd"></CreateButton>
          </template>
          <template #default="scope">
            <el-form-item>
              <el-button type="danger" :icon="Delete" @click="handleDelete(scope.$index)" link title="删除"></el-button>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { saveConfigApi, getConfigApi } from '@/api/product/restaurant';
import CreateButton from '@/components/CreateButton.vue'
import { Delete } from '@element-plus/icons-vue'
import { successMsg } from '@/utils/message.js'
import QuestionTip from '@/components/QuestionTip.vue'

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);

const formData = ref({
  restaurantId: null,
  configList: []
});

const vList = ref([]);

const openDialog = (row) => {
  formData.value.configList = [];
  getConfigApi({ id: row.id }).then(({data: {voucherList, configList}}) => {
    vList.value = voucherList;
    formData.value.configList = configList;
    formData.value.restaurantId = row.id;
    showDialog.value = true;
    formDataRef.value?.resetFields();
  });
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      saveConfigApi(formData.value).then(() => {
        successMsg('配置保存成功');
        showDialog.value = false;
      }).finally(() => loading.value = false)
    }
  });
};

const handleAdd = () => {
  formData.value.configList.push({
    voucherId: null,
    num: 1,
    matchType: 1
  });
};

const handleDelete = (index) => {
  formData.value.configList.splice(index, 1);
};

defineExpose({
  openDialog
});
</script>
<style lang="scss" scoped>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>