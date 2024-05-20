<template>
  <el-dialog title="编辑" v-model="showDialog" width="30%">
    <el-form :model="formData" ref="formDataRef" rules="formRules">
      <el-form-item label="参数名称">
        <el-input v-model="formData.title" disabled />
      </el-form-item>
      <el-form-item label="标示符">
        <el-input v-model="formData.nid" disabled />
      </el-form-item>
      <el-form-item label="配置信息" prop="content">
        <el-input v-model="formData.content" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click=" showDialog = false">取消</el-button>
        <el-button type="primary" @click="">确认</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { ref, reactive } from 'vue';

const formRules = reactive({
  reactive: [
    { required: true, message: '配置信息不能为空', trigger: 'blur' },
    { max: 400, message: '配置信息最多400个字符', trigger: 'blur' }
  ],
  remark: [{
    max: 200, message: '备注信息最多200个字符', trigger: 'blur'
  }]
})

const formData = ref({});
const formDataRef = ref({});

const showDialog = ref(false);

</script>

<style lang="scss" scoped></style>
