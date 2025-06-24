<template>
  <div class="edit-content">
    <el-divider />
    <el-container>
      <el-aside width="450px">
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
                <template v-for="(item, index) in prizeLocation">
                  <li :class="{ 'lottery-item-start': index === 4 }">
                    <el-image v-if="item.coverUrl" :src="item.coverUrl" fit="fill" style="height: 90px; width: 90px"> </el-image>
                    <span v-if="!item.coverUrl && index !== 4">
                      {{ index + 1 }}
                    </span>
                  </li>
                </template>
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
            <el-form v-show="step === 0" :model="formData" ref="firstDataRef" :rules="firstRules" label-width="140" label-position="right" v-loading="loading" :disabled="disabled">
              <el-form-item label="活动名称" prop="title">
                <el-input v-model="formData.title" show-word-limit maxlength="8" />
              </el-form-item>
              <el-form-item prop="storeId" label="使用店铺">
                <StoreAllSelect v-model:store-ids="formData.storeId" v-model:store-list="storeList"></StoreAllSelect><QuestionTip content="不选默认所有店铺生效"></QuestionTip>
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
              <el-form-item label="banner图" prop="bannerUrl">
                <UploadImage v-model:img-url="formData.bannerUrl"></UploadImage>
              </el-form-item>
              <el-form-item label="背景图" prop="coverUrl">
                <UploadImage v-model:img-url="formData.coverUrl"></UploadImage>
              </el-form-item>
              <el-form-item label="抽奖标题" prop="subTitle">
                <el-input v-model="formData.subTitle" show-word-limit maxlength="10" />
              </el-form-item>
              <el-form-item label="抽奖规则" prop="rule">
                <el-input type="textarea" placeholder="最少10个字符" :autosize="{ minRows: 6, maxRows: 8 }" v-model="formData.rule" maxlength="1000" show-word-limit />
              </el-form-item>
            </el-form>
            <el-form v-show="step === 1" :model="formData" ref="nextDataRef" :rules="nextRules" label-width="140" label-position="right" v-loading="loading" :disabled="disabled">
              <el-form-item label="奖品配置" prop="prizeList">
                <el-table :data="formData.prizeList" border style="width: 650px" stripe show-overflow-tooltip>
                  <el-table-column label="奖品名称" prop="prizeName" min-width="120" align="center" />
                  <el-table-column label="奖品类型" prop="prizeType" width="90" :formatter="formatter" />
                  <el-table-column label="中奖发放数量" prop="num" width="110" align="center" />
                  <el-table-column label="奖品总数量" prop="totalNum" width="100" align="center" />
                  <el-table-column label="奖品图片" width="90" align="center">
                    <template #default="scope">
                      <div style="display: flex; align-items: center; justify-content: center">
                        <el-image fit="cover" :src="scope.row?.coverUrl" style="width: 30px; height: 30px" preview-teleported hide-on-click-modal />
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" fixed="right" width="90" align="center">
                    <template #header>
                      <span>操作</span>
                      <CreateButton v-show="formData.prizeList.length < 8 && !disabled" title="新增奖品信息" @click="handleCreatePrize"></CreateButton>
                    </template>
                    <template #default="scope">
                      <el-button v-show="scope.$index !== 0" v-if="!disabled" type="danger" :icon="Delete" @click="handleDeletePrize(scope.$index)" link title="删除"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="轮盘配置" prop="configList">
                <el-table :data="formData.configList" border style="width: 650px" stripe show-overflow-tooltip>
                  <el-table-column label="转盘位置" prop="location" width="100" align="center" />
                  <el-table-column prop="prizeIndex" min-width="150" align="center">
                    <template #header>
                      <span>奖品名称<QuestionTip content="为了防止奖品数量不足导致中奖后发放失败, 因此必须包含一个谢谢参与的奖项, 中奖概率可以设置为0"></QuestionTip></span>
                    </template>
                    <template #default="scope">
                      <el-form-item
                        :prop="`configList[${scope.$index}].prizeIndex`"
                        :rules="[ { required: true, message: '请选择抽奖商品', trigger: 'change' }]"
                      >
                        <el-select v-model="scope.row.prizeIndex" class="w200" :disabled="scope.$index === 7" @change="handleChangePrize($event, scope.$index)">
                          <el-option v-for="(item, index) in formData.prizeList" :key="index" :value="index" :label="item.prizeName" />
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="奖品图片" width="100" align="center">
                    <template #default="scope">
                      <div style="display: flex; align-items: center; justify-content: center">
                        <el-image fit="cover" v-show="scope.row.coverUrl !== undefined" :src="scope.row?.coverUrl" style="width: 30px; height: 30px" preview-teleported hide-on-click-modal />
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column width="110" align="center">
                    <template #header>
                      <span><span class="item-required">*</span>中奖概率(%)</span>
                    </template>
                    <template #default="scope">
                      <el-form-item
                        :prop="`configList[${scope.$index}].weight`"
                        :rules="[
                          { required: true, message: '中奖概率不能为空', trigger: 'blur' },
                          { validator: checkValidator, trigger: 'blur' }
                        ]"
                      >
                        <el-input v-model="scope.row.weight" class="w80" maxlength="5" @keyup="scope.row.weight = numberValidator(scope.row.weight)" :disabled="scope.$index === 7"></el-input>
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
        <el-button @click="goBack($router)">取消</el-button>
        <el-button v-if="step === 1" @click="step = 0">上一步</el-button>
        <el-button v-if="step === 0" type="primary" @click="handleNext">下一步</el-button>
        <el-button v-if="step === 1" type="primary" @click="handleSave">保存</el-button>
      </div>
      <div class="edit-button-footer" v-else>
        <el-button @click="goBack($router)">返回</el-button>
        <el-button v-if="step === 1" @click="step = 0">上一步</el-button>
        <el-button v-if="step === 0" @click="step = 1">下一步<QuestionTip content="注意：进行中或已结束的抽奖活动不支持编辑" v-if="stateDisabled"/></el-button>
      </div>
    </div>
  </div>
  <template v-if="!disabled">
    <PrizeForm ref="prizeRef" @reload="addPrize" ></PrizeForm>
  </template>
</template>

<script setup>
import { createApi, selectApi, updateApi } from '@/api/marketing/lottery';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import StoreAllSelect from '@/components/StoreAllSelect.vue';
import { storeApi } from '@/api/product/index.js';
import QuestionTip from '@/components/QuestionTip.vue';
import UploadImage from '@/components/UploadImage.vue';
import { Delete } from '@element-plus/icons-vue';
import CreateButton from '@/components/CreateButton.vue';
import PrizeForm from '@/views/marketing/lottery/PrizeForm.vue';
import { goBack, numberValidator } from '@/utils/common.js';
import Big from 'big.js';

const prizeRef = ref();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const firstDataRef = ref();
const nextDataRef = ref();
const disabled = ref(false);
const stateDisabled = ref(false);
const storeList = ref([]);
const prizeLocation = ref([{}, {}, {}, {}, {}, {}, {}, {}, {}]);

const firstRules = reactive({
  title: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
  coverUrl: [{ required: true, message: '封面图不能为空', trigger: 'change' }],
  bannerUrl: [{ required: true, message: 'banner图不能为空', trigger: 'change' }],
  lotteryDay: [{ required: true, message: '单日抽奖次数不能为空', trigger: 'blur' }],
  lotteryTotal: [{ required: true, message: '总抽奖次数不能为空', trigger: 'blur' }],
  winNum: [{ required: true, message: '中奖次数不能为空', trigger: 'blur' }],
  subTitle: [{ required: true, message: '抽奖标题不能为空', trigger: 'blur' }],
  rule: [
    { required: true, message: '抽奖规则不能为空', trigger: 'blur' },
    {
      min: 10,
      max: 1000,
      message: '抽奖规则10~1000字符',
      trigger: 'blur'
    }
  ],
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
  bannerUrl: null,
  coverUrl: null,
  subTitle: null,
  rule: null,
  timeList: [],
  prizeList: [
    {
      prizeName: '谢谢参与',
      prizeType: 0,
      num: null,
      totalNum: null,
      coverUrl: null
    }
  ],
  configList: []
});

const step = ref(0);

const checkValidator = (rule, value, callback) => {
  // 总中奖概率不能大于100, 剩余概率不能小于0, 且默认8号位置为剩余概率
  const total = formData.value.configList
    .filter((item, index) => index !== 7)
    .map((item) => item.weight)
    .reduce((pre, cur) => {
      if (cur) {
        return pre.plus(cur);
      } else {
        return pre;
      }
    }, new Big(0));
  const sub = new Big(100).minus(total).toNumber();
  if (sub < 0) {
    callback(new Error('总中奖概率不能大于100'));
  } else {
    formData.value.configList[7].weight = sub;
    callback();
  }
};

const handleChangePrize = (index, location) => {
  const coverUrl = formData.value.prizeList[index].coverUrl;
  formData.value.configList[location].coverUrl = coverUrl;
  handleLocationUrl(location, coverUrl);
};

const handleLocationUrl = (index, coverUrl) => {
  prizeLocation.value.forEach((item, idx) => {
    if ((idx <= 3 && idx === index) || (idx >= 5 && idx === index + 1)) {
      item.coverUrl = coverUrl;
    }
  });
};

const handleSave = () => {
  nextDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      formData.value.startTime = formData.value.timeList[0];
      formData.value.endTime = formData.value.timeList[1];
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('抽奖活动更新成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('抽奖活动添加成功');
            goBack(router);
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
  formData.value.configList.forEach((item) => {
    if (item.prizeIndex === index) {
      item.prizeIndex = null;
      item.coverUrl = null;
      item.weight = null;
    }
  });
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

const formatter = (_row, _column, cellValue) => {
  if (cellValue === 0) {
    return '谢谢参与';
  }
  if (cellValue === 3) {
    return '商品';
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
        if (res.data.state === 1 || res.data.state === 2) {
          disabled.value = true;
          stateDisabled.value = true;
        }
        formData.value.configList.forEach((item) => {
          handleLocationUrl(item.location - 1, item.coverUrl);
        });
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    for (let i = 1; i < 9; i++) {
      formData.value.configList.push({
        location: i,
        prizeIndex: i === 8 ? 0 : null
      });
    }
  }
});
</script>
<style lang="scss" scoped>
.step-tip {
  margin-bottom: 20px;
  padding-left: 120px;
}

.lottery-show {
  width: 400px;
  padding: 10px;

  .lottery-page {
    border: 1px solid #ebeef5;
    background: url('@/assets/images/lottery-bg.jpg') 0 0 / 374px 812px;
    height: 812px;
    width: 374px;
    position: relative;
    border-radius: 10px;

    .lottery-top {
      height: 135px;
      background: url('@/assets/images/lottery-top.png') 0 0 / 374px 135px;
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
          background: url('@/assets/images/lottery-start.svg') no-repeat 13px 13px;
        }
      }
    }
  }
}
</style>