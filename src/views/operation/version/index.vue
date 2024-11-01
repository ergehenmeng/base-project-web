<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="更新信息" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="客户端">
          <el-select v-model="queryParams.channel" clearable>
            <el-option label="IOS" value="IOS" />
            <el-option label="ANDROID" value="ANDROID" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="待上架" :value="false" />
            <el-option label="已上架" :value="true" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="channel" label="客户端" width="100" />
        <el-table-column prop="version" label="版本号" width="100" />
        <el-table-column prop="state" label="状态" width="100" >
          <template #default="scope">
            <el-switch v-model="scope.row.state" inline-prompt active-text="已发布" inactive-text="未发布" disabled style="--el-switch-off-color: #ff4949" />
          </template>
        </el-table-column>
        <el-table-column prop="forceUpdate" label="是否强更" :formatter="formatter" width="100" />
        <el-table-column prop="url" label="下载地址" width="350" />
        <el-table-column prop="remark" label="更新信息" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="150">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'QkU0'" title="新增版本" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'VkU0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'UJU0'" v-if="!scope.row.state" type="success" :icon="Top" @click="handleState(scope.row.id, true, scope.row.version)" link title="上架"></el-button>
            <el-button v-has-perm="'UJU0'" v-if="scope.row.state" type="warning" :icon="Bottom" @click="handleState(scope.row.id, false, scope.row.version)" link title="下架"></el-button>
            <el-button @click="showQrcode(scope.row.url, scope.row.channel, scope.row.version)" link title="生成二维码"><QrCode/></el-button>
            <el-button v-has-perm="'tkU0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="->, total, sizes, prev, pager, next"
        :total="total"
        @change="getPage"
      />
    </div>
  </div>
  <VersionForm ref="formRef" @reload="getPage"></VersionForm>
  <QRCodeForm ref="qrCodeRef" tips="请使用微信扫码绑定手机号" :file-name="versionName"></QRCodeForm>
</template>
<script setup>
import { deleteApi, listPageApi, stateApi } from '@/api/operation/version';
import { Bottom, Delete, Edit, Top } from '@element-plus/icons-vue'
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import useDictStore from '@/store/dict.js';
import { useRouter } from 'vue-router';
import VersionForm from './VersionForm.vue';
import CreateButton from '@/components/CreateButton.vue';
import { renderMsg } from '@/utils/common.js'
import QrCode from '@/components/icon/QrCode.vue'
import QRCodeForm from '@/views/common/QRCodeForm.vue'

const router = useRouter();
const userStore = useUserStore();
const dictStore = useDictStore();
const dictList = dictStore.getDict('notice_type');
const qrCodeRef = ref();

const loading = ref(false);
const total = ref(0);
const formRef = ref();
const pageData = ref([]);
const selectAuth = userStore.hasAuth('zkU0');
const versionName = ref('');

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  noticeType: null
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      const { data } = await listPageApi(queryParams);
      pageData.value = data.rows;
      total.value = data.total;
    }
  } finally {
    loading.value = false;
  }
};

const search = () => {
  queryParams.page = 1;
  getPage();
};

onMounted(() => {
  getPage();
});

const handleDelete = (row) => {
  confirmMsg('确定要删除该版本信息吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('版本信息删除成功');
      getPage();
    });
  });
};

const handleState = (id, state, version) => {
  const type = state ? '上架' : '下架';
  const msg = renderMsg([`确定要${type} `, () => `V${version}`, " 版本吗?"])
  confirmMsg(msg, () => {
    stateApi({ id: id, state: state }).then(() => {
      getPage();
    });
    successMsg(`版本${type}成功`);
  });
};

const showQrcode = (url, channel, version) => {
  versionName.value = channel + "版本V" + version;
  qrCodeRef.value.openDialog({ text: url, remark: '软件版本号:' + version});
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'forceUpdate') {
    return cellValue === true ? '是' : '否';
  } else if (column.property === 'state') {
    return cellValue ? h('span', { style: { color: 'green' } }, '已上架') : '待上架';
  } else {
    return cellValue;
  }
};
const handleCreate = () => {
  formRef.value.openDialog({});
};

const handleEdit = (row) => {
  formRef.value.openDialog(row);
};
</script>
