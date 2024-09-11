<template>
  <div class="main-header">
    <ul class="">
      <li>
        <span class="main-header-title">欢迎您: {{ nickName }}</span>
      </li>
      <li>
        <el-icon title="个人中心" @click="handleUser">
          <User color="#FFFFFF"></User>
        </el-icon>
      </li>
      <li>
        <el-icon title="修改密码" @click="handleChangePwd">
          <Password color="#FFFFFF"></Password>
        </el-icon>
      </li>
      <li>
        <el-icon title="退出系统" @click="handleLogout">
          <Logout color="#FFFFFF"></Logout>
        </el-icon>
      </li>
    </ul>
    <ChangePwd ref="changePwdRef"></ChangePwd>
  </div>
</template>
<script setup>
import useUserStore from '@/store/user';
import ChangePwd from '@/views/ChangePwd.vue';
import { confirmMsg, errorMsg, successMsg, warningMsg } from '@/utils/message'
import Logout from '@/components/icon/Logout.vue';
import Password from '@/components/icon/Password.vue';
import User from '@/components/icon/User.vue';
import useDictStore from '@/store/dict.js'
import useAreaStore from '@/store/area.js'
import { Client } from '@stomp/stompjs'

const userStore = useUserStore();
const changePwdRef = ref();
const nickName = userStore.user?.nickName;

const handleLogout = () => {
  confirmMsg('确定要退出系统吗?', () => {
    userStore.logout();
  });
};
// 初始化地区字典
const areaStore = useAreaStore();
areaStore.initArea();
// 初始化数据字典
const dictStore = useDictStore();

dictStore.initDict('image_type', 'help_type', 'feedback_type',
  'banner_type', 'notice_type', 'scenic_tag',
  'homestay_tag', 'key_service', 'hot_institution',
  'bathroom', 'children', 'media', 'appliance',
  'landscape');

const initWebSocket = () => {

  const client = new Client({
    // 后缀ws用来建立连接
    brokerURL: import.meta.env.VITE_IOS_DOWNLOAD_URL,
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000
  })

  client.onConnect = frame => {
    console.log('连接成功', frame)
  }

  client.onStompError = frame => {
    console.log('连接错误', frame)
  }

  client.activate();
  return client;
}

const client = initWebSocket();

onMounted(() => {
  const init = userStore.user?.init;
  if (init) {
    warningMsg('您的密码为初始化密码，请及时修改密码');
    userStore.setInit(false);
    return;
  }
  const expire = userStore.user?.expire;
  if (expire) {
    errorMsg('密码已超过90天未修改，请及时修改保证账户安全');
  }
})

const handleUser = () => {
  console.log('待补全功能')
};

const handleChangePwd = () => {
  changePwdRef.value.openDialog();
};

/**
 * 订阅消息,并进行消息展示 /ws前缀用来区分普通请求和websocket订阅请求
 */
const subscription = client.subscribe('/ws/order/broadcast/' + userStore.user?.token, msg => {
  const data = JSON.parse(msg.body);
  if (data.type === 'order') {
    successMsg('您有新的订单待处理');
  } else if (data.type === 'message') {
    successMsg('您有新的消息待处理');
  }
})

onUnmounted(() => {
  subscription.unsubscribe();
  client.deactivate();
})

</script>
<style lang="scss" scoped>
@import '@/styles/index.scss';

.main-header {
  height: 60px;
  background:
    url($main-header-logo-url) no-repeat 50px 5px,
    $main-header-color;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 30px;

  ul {
    list-style: none;
    display: inline-flex;
    li {
      color: white;
      margin: auto 5px;
      i {
        margin-top: 5px;
        cursor: pointer;
        font-size: 15px;
      }
    }
  }

  .main-header-title {
    font-size: 15px;
    font-weight: bold;
  }
}
</style>
