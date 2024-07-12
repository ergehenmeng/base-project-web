<template>
  <div class="edit-content">
    <el-divider />
    <el-container>
      <el-aside width="500px">
        <div class="lottery-show">
          <div class="lottery-page">
            <div class="lottery-top"></div>
            <div class="lottery-title">
              <div>{{ formData.title }}</div>
            </div>
            <div class="lottery-sub-title">
              <div>{{ formData.subTitle }}</div>
            </div>
            <div class="lottery-content">
              <ul class="lottery-item">
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
                <li class="lottery-item-start"></li>
                <li>5</li>
                <li>6</li>
                <li>7</li>
                <li>8</li>
              </ul>
            </div>
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-header class="step-tip">
          <el-steps style="max-width: 1000px" :space="1000" :active="step" finish-status="success">
            <el-step title="基础配置" />
            <el-step title="奖品设置" />
          </el-steps>
        </el-header>
        <el-main>
          <div style="width: 800px">
            <el-form v-show="step === 1" :model="formData" ref="firstDataRef" :rules="firstRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
              <el-form-item label="活动名称" prop="title">
                <el-input v-model="formData.title" show-word-limit maxlength="8" />
              </el-form-item>
              <el-form-item prop="storeId">
                <template #label>
                  <span>使用店铺<QuestionTip content="不选默认所有店铺生效"></QuestionTip></span>
                </template>
                <StoreAllSelect v-model:store-ids="formData.storeId" v-model:store-list="storeList"></StoreAllSelect>
              </el-form-item>
              <el-form-item label="活动时间" prop="timeList">
                <div style="width: 350px">
                  <el-date-picker type="datetimerange" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" time-format="HH:mm" v-model="formData.timeList" style="width: 350px"></el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="单日抽奖次数限制" prop="lotteryDay">
                <el-input v-model="formData.lotteryDay" show-word-limit maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
              </el-form-item>
              <el-form-item label="总抽奖次数限制" prop="lotteryTotal">
                <el-input v-model="formData.lotteryTotal" show-word-limit maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
              </el-form-item>
              <el-form-item label="中奖次数限制" prop="winNum">
                <el-input v-model="formData.winNum" show-word-limit maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" />
              </el-form-item>
              <el-form-item label="封面图" prop="coverUrl">
                <UploadImage v-model="formData.coverUrl"></UploadImage>
              </el-form-item>
              <el-form-item label="抽奖标题" prop="subTitle">
                <el-input v-model="formData.subTitle" show-word-limit maxlength="10" />
              </el-form-item>
              <el-form-item label="抽奖规则" prop="rule">
                <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 8 }" v-model="formData.rule" autosize maxlength="1000" show-word-limit />
              </el-form-item>
            </el-form>
            <el-form v-show="step === 0" :model="formData" ref="nextDataRef" :rules="nextRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
              <el-form-item label="奖品配置" prop="prizeList">
                <el-table :data="formData.prizeList" border style="width: 650px" stripe show-overflow-tooltip>
                  <el-table-column label="奖品名称" prop="prizeName" width="120" align="center" />
                  <el-table-column label="奖品类型" prop="prizeType" width="90" :formatter="formatter" />
                  <el-table-column label="单次中奖发放数量" prop="num" width="150" align="center" />
                  <el-table-column label="奖品总数量" prop="totalNum" width="100" align="center" />
                  <el-table-column label="奖品图片" width="90" align="center">
                    <template #default="scope">
                      <div style="display: flex; align-items: center">
                        <el-image fit="contain" :src="scope.row?.coverUrl" style="width: 50px; height: 50px" preview-teleported hide-on-click-modal />
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" fixed="right" width="100" align="center">
                    <template #header>
                      <span style="margin-right: 5px">操作</span>
                      <CreateButton v-show="formData.prizeList.length < 8" title="新增奖品信息" @click="handleCreatePrize"></CreateButton>
                    </template>
                    <template #default="scope">
                      <el-button v-has-perm="'b1i0'" type="danger" :icon="Delete" @click="handleDeletePrize(scope.$index)" link title="删除"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="轮盘配置" prop="configList">
                <el-table :data="formData.configList" border style="width: 650px" stripe show-overflow-tooltip>
                  <el-table-column label="转盘位置" prop="location" width="150" align="center" />
                  <el-table-column label="奖品信息" prop="prizeIndex" min-width="150" align="center" >
                    <template #default="scope">
                      <el-select v-model="scope.row.prizeIndex" >
                        <el-option v-for="(item, index) in formData.prizeList" :key="index" :value="index" :label="item.prizeName" />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="奖品图片" width="100" align="center">
                    <template #default="scope">
                      <div style="display: flex; align-items: center">
                        <el-image fit="contain" v-show="scope.row.coverUrl !== undefined" :src="scope.row?.coverUrl" style="width: 30px; height: 30px" preview-teleported hide-on-click-modal />
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ratio" width="150" align="center">
                    <template #header>
                      <span><span class="item-required">*</span>中奖概率</span>
                    </template>
                    <template #default="scope">
                      <el-form-item
                        :prop="`configList[${scope.$index}].ratio`"
                        :rules="[
                          { required: true, message: '中奖概率不能为空', trigger: 'blur' },
                          {
                            validator(rule, value, callback) {
                              const ratio = parseFloat(value);
                              if (ratio > 100) {
                                callback(new Error('中奖概率不能大于100'));
                              } else if (ratio < 0) {
                                callback(new Error('中奖概率不能小于0'));
                              } else {
                                callback();
                              }
                            }
                          }
                        ]"
                      >
                        <el-input v-model="scope.row.ratio" class="w120" maxlength="5" @keyup="scope.row.ratio = numberValidator(scope.row.ratio)">
                          <template #append>
                            <span style="color: #999; width: 10px">%</span>
                          </template>
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <div>
      <div class="edit-button-footer" v-if="!disabled">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button v-if="step === 1" @click="step = 0">上一步</el-button>
        <el-button v-if="step === 0" type="primary" @click="handleNext">下一步</el-button>
        <el-button v-if="step === 1" type="primary" @click="handleSave">保存</el-button>
      </div>
      <div class="edit-button-footer" v-else>
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
  </div>
  <PrizeForm ref="prizeRef" @reload="addPrize"></PrizeForm>
</template>

<script setup>
import { createApi, selectApi, updateApi } from '@/api/marketing/lottery';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import StoreAllSelect from '@/components/StoreAllSelect.vue';
import { storeApi } from '@/api/product/index.js';
import QuestionTip from '@/components/QuestionTip.vue';
import UploadImage from '@/components/UploadImage.vue';
import { Delete } from '@element-plus/icons-vue';
import CreateButton from '@/components/CreateButton.vue';
import PrizeForm from '@/views/marketing/lottery/PrizeForm.vue';
import { numberValidator } from '@/utils/common.js';

const prizeRef = ref();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const firstDataRef = ref();
const nextDataRef = ref();
const disabled = ref(false);
const storeList = ref([]);

const firstRules = reactive({
  title: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
  coverUrl: [{ required: true, message: '封面图不能为空', trigger: 'change' }],
  lotteryDay: [{ required: true, message: '单日抽奖次数不能为空', trigger: 'blur' }],
  lotteryTotal: [{ required: true, message: '总抽奖次数不能为空', trigger: 'blur' }],
  winNum: [{ required: true, message: '中奖次数不能为空', trigger: 'blur' }],
  subTitle: [{ required: true, message: '抽奖标题不能为空', trigger: 'blur' }],
  rule: [{ required: true, message: '抽奖规则不能为空', trigger: 'blur' }],
  timeList: [{ required: true, message: '活动时间不能为空', trigger: 'blur', type: 'array' }]
});

const nextRules = reactive({
  prizeList: [{ required: true, message: '奖品信息不能为空', trigger: 'change', type: 'array' }],
  configList: [{ required: true, message: '奖品配置不能为空', trigger: 'change', type: 'array' }]
});

const formData = ref({
  id: null,
  title: null,
  storeId: null,
  lotteryDay: 1,
  lotteryTotal: 1,
  winNum: 1,
  coverUrl: null,
  subTitle: null,
  rule: null,
  timeList: [],
  prizeList: [],
  configList: []
});

const step = ref(0);

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('拼团活动更新成功');
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('拼团活动添加成功');
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

const handleCreatePrize = () => {
  prizeRef.value.openDialog();
};

const handleDeletePrize = (index) => {
  formData.value.prizeList.splice(index, 1);
  formData.value.configList.forEach(item => {
    if (item.prizeIndex === index) {
        item.prizeIndex = null;
        item.coverUrl = null;
    }
  })
};

const addPrize = (data) => {
  formData.value.prizeList.push({ ...data });
};

const loadStore = () => {
  if (storeList.value.length === 0) {
    storeApi().then((res) => {
      storeList.value = res.data;
    });
  }
};

const formatter = (row, column, cellValue) => {
  if (cellValue === 0) {
    return '谢谢参与';
  }
  return cellValue === 1 ? '优惠券' : '积分';
};

const handleNext = () => {
  if (step.value === 0) {
    firstDataRef.value.validate((valid) => {
      if (valid) {
        step.value = 1;
      }
    });
  }
};

onMounted(() => {
  loadStore();
  const params = route.params;
  if (params.id !== undefined) {
    loading.value = true;
    disabled.value = route.fullPath.startsWith('/marketing/lottery/detail');
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        formData.value.timeList = [res.data.startTime, res.data.endTime];
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    for (let i = 1; i < 9; i++) {
      formData.value.configList.push({
        location: i
      });
    }
  }
});
</script>
<style lang="scss" scoped>
.step-tip {
  margin-bottom: 20px;
  padding-left: 160px;
}

.lottery-show {
  width: 500px;
  padding: 10px;

  .lottery-page {
    border: 1px solid #ebeef5;
    // background: url('@/assets/images/lottery-bg.jpg') 0 0 / 374px 812px;
    height: 812px;
    width: 374px;
    position: relative;
    border-radius: 10px;

    .lottery-top {
      height: 135px;
      // background: url('@/assets/images/lottery-top.png') 0 0 / 374px 135px;
    }

    .lottery-title {
      position: absolute;
      top: 95px;
      width: 320px;
      padding: 0 10px;

      div {
        width: 100%;
        text-align: center;
        font-size: 35px;
        color: #ff5151;
        text-shadow: 2px 2px 0 #ffffff;
        font-family: 'ShuHeiTi', serif;
      }
    }

    .lottery-sub-title {
      position: absolute;
      top: 150px;
      width: 374px;
      padding: 0 10px 0 30px;

      div {
        width: 100%;
        text-align: center;
        font-size: 28px;
        color: #ff5151;
        text-shadow: 2px 2px 0 #ffffff;
        font-family: 'ShuHeiTi', serif;
      }
    }

    .lottery-content {
      position: absolute;
      top: 255px;
      width: 374px;
      padding: 12px;

      .lottery-item {
        width: 100%;
        height: 100%;
        padding: 25px;
        display: flex;
        flex-wrap: wrap;

        li {
          width: 90px;
          height: 90px;
          margin: 5px;
          border-radius: 3px;
          list-style: none;
          text-align: center;
          line-height: 100px;
          background-color: #fdf4de;
          color: #d3d4dc;
          font-weight: bolder;
          font-size: 30px;
        }

        .lottery-item-start {
          background: url('@/assets/images/start.svg') no-repeat 13px 13px;
        }
      }
    }
  }
}
</style>