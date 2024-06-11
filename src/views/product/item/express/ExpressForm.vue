<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
             v-loading="loading" :disabled="disabled">
      <el-form-item label="模板名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20"/>
      </el-form-item>
      <el-form-item label="计费方式" prop="chargeMode">
        <el-radio-group v-model="formData.chargeMode" >
          <el-radio :value="1" >按件数</el-radio>
          <el-radio :value="2" >按重量</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="配送区域" prop="regionList">
        <div style="width: 1100px;">
          <table>
            <tr>
              <th class="title">配送区域</th>
              <th class="item">首件或首重</th>
              <th class="item">首件或首重的价格(元)</th>
              <th class="item">续重或续件</th>
              <th class="item">续重或续件的单价(元)</th>
            </tr>
            <tr v-for="(item, index) in formData.regionList" :key="item.regionId">
              <td>
                <el-text truncated>{{item.regionName}}</el-text>
              </td>
              <td>
                <div style="display: flex; justify-content: center; align-items: center">
                  <el-form-item :prop="`regionList[${index}].firstPart`" :rules="{required: true, message: '该项不能为空', trigger: 'blur'}">
                    <el-input v-model="item.firstPart"  onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 100px;"/>
                  </el-form-item>
                </div>
              </td>
              <td>
                <div style="display: flex; justify-content: center; align-items: center">
                  <el-form-item :prop="`regionList[${index}].firstPrice`" :rules="{required: true, message: '该项不能为空', trigger: 'blur'}">
                    <el-input v-model="item.firstPrice"  @keyup="item.firstPrice=numberValidator(item.firstPrice);" style="width: 100px;"/>
                  </el-form-item>
                </div>
              </td>
              <td>
                <div style="display: flex; justify-content: center; align-items: center">
                  <el-form-item :prop="`regionList[${index}].nextPart`" :rules="{required: true, message: '该项不能为空', trigger: 'blur'}">
                    <el-input v-model="item.nextPart"  onkeyup="this.value=this.value.replace(/\D/g,'')" style="width: 100px;"/>
                  </el-form-item>
                </div>
              </td>
              <td>
                <div style="display: flex; justify-content: center; align-items: center">
                  <el-form-item :prop="`regionList[${index}].nextUnitPrice`" :rules="{required: true, message: '该项不能为空', trigger: 'blur'}">
                    <el-input v-model="item.nextUnitPrice"  @keyup="item.nextUnitPrice=numberValidator(item.nextUnitPrice);" style="width: 100px;"/>
                  </el-form-item>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </el-form-item>
      <div style="margin-left: 80px;">
        <el-button type="primary" @click="handleAddRegion">添加区域</el-button>
      </div>
    </el-form>
    <AreaTree ref="areaRef"></AreaTree>
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
import {createApi, selectApi, updateApi, scenicListApi} from '@/api/product/ticket';
import {reactive, ref} from 'vue';
import {useRoute, useRouter} from "vue-router";
import {successMsg} from "@/utils/message.js";
import {numberValidator} from "@/utils/common.js";
import AreaTree from "@/components/AreaTree.vue";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const areaRef = ref();
const showDialog = ref(false);
const disabled = ref(false);
const scenicList = ref([]);

const formRules = reactive({
  title: [
    {required: true, message: "模板名称不能为空", trigger: 'blur'}
  ],
  chargeMode: [
    {required: true, message: "请选择计费方式", trigger: 'change'}
  ],
})

const formData = ref({
  id: null,
  title: null,
  chargeMode: 1,
  regionList: []
});

const handleAddRegion = () => {
  areaRef.value.openDialog();
}

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      formData.value.startDate = formData.value.dueDate[0];
      formData.value.endDate = formData.value.dueDate[1];
      if (formData.value.id) {
        updateApi(formData.value).then(() => {
          successMsg("门票信息更新成功");
          showDialog.value = false;
          router.go(-1);
        }).finally(() => {
          loading.value = false;
        })
      } else {
        createApi(formData.value).then(() => {
          successMsg("门票添加成功");
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
  scenicListApi().then(res => {
    scenicList.value = res.data;
  }).then(() => {
    const params = route.params;
    if (params.id !== undefined) {
      loading.value = true;
      // 详情页面进来不可点击
      disabled.value = route.fullPath.startsWith("/product/ticket/detail");
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
table, td, th {
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
  padding-bottom: 20px;
  padding-top: 10px;
  text-align: center;
}
</style>