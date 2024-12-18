<template>
  <div class="layer-main-header">
    <ul class="">
      <li>
        <span class="main-header-title" title="按ALT+L可以锁屏哟~">欢迎您: {{ nickName }}</span>
      </li>
      <li>
        <el-icon title="个人中心" @click="handleUser">
          <User color="#FFFFFF"/>
        </el-icon>
      </li>
      <li>
        <el-icon title="解绑微信" @click="handleUnbind" v-if="userStore.user?.bindWechat">
          <Unbind color="#FFFFFF"/>
        </el-icon>
        <el-icon v-else title="绑定微信" @click="handleBind">
          <Bind color="#FFFFFF"/>
        </el-icon>
      </li>
      <li>
        <el-icon title="修改密码" @click="handleChangePwd">
          <Password color="#FFFFFF"/>
        </el-icon>
      </li>
      <li>
        <el-icon title="退出系统" @click="handleLogout">
          <Logout color="#FFFFFF"/>
        </el-icon>
      </li>
    </ul>
    <ChangePwd ref="changePwdRef"/>
  </div>
</template>
<script setup>
import useUserStore from '@/store/user';
import ChangePwd from '@/views/ChangePwd.vue';
import { confirmMsg, errorMsg, successMsg, warningMsg } from '@/utils/message'
import { unbindApi } from '@/api/system/user';
import Logout from '@/components/icon/Logout.vue';
import Password from '@/components/icon/Password.vue';
import User from '@/components/icon/User.vue';
import useDictStore from '@/store/dict.js'
import useAreaStore from '@/store/area.js'
import { Client } from '@stomp/stompjs';
import { renderMsg } from '@/utils/common.js'
import { ElLink } from 'element-plus'
import { useRouter } from 'vue-router'
import Unbind from '@/components/icon/Unbind.vue'
import Bind from '@/components/icon/Bind.vue'

const router = useRouter();
const userStore = useUserStore();
const changePwdRef = ref();
const nickName = userStore.user?.nickName;

const handleLogout = () => {
  confirmMsg('确定要退出系统吗?', () => {
    userStore.logout();
  });
};

const handleUnbind = () => {
  confirmMsg('确定要解绑微信吗?', () => {
    unbindApi().then(() => {
      userStore.setBindWechat(false);
      successMsg('解绑成功');
    });
  });
};

const handleBind = () => {
  successMsg('在登陆界面进行扫码并登录, 登录成功自动绑定微信');
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
    brokerURL: import.meta.env.VITE_WEBSOCKET_URL + "?token=" + userStore.user?.token.split(' ')[1],
    onConnect: () => {
      subscribe();
    },
    reconnectDelay: 10000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000
  });
  client.activate()
  return client;
}

let client;
onMounted(() => {
  // 只有零售商户才开启websocket用来接收订单消息
  if ((userStore.user?.userType === 2 || userStore.user?.userType === 3) && (userStore.user?.merchantType & 8) === 8) {
    client = initWebSocket();
  }
  const init = userStore.user?.init;
  if (init) {
    warningMsg('您的密码为初始化密码，请及时修改密码');
    // 每次登录只提示一次
    userStore.setInit(false);
    // 防止刷新后提示90天提醒
    userStore.setExpire(false);
    return;
  }
  const expire = userStore.user?.expire;
  if (expire) {
    errorMsg('密码已超过90天未修改，请及时修改保证账户安全');
    // 每次登录只提示一次
    userStore.setExpire(false);
  }
})

const subscribe = () => {
  client.subscribe('/websocket/order/broadcast/' + userStore.user?.merchantId, (frame) => {
    showNotice(JSON.parse(frame.body));
  })
}

const handleUser = () => {
  console.log("待补全逻辑")
};

const handleChangePwd = () => {
  changePwdRef.value.openDialog();
};

const showNotice = ({ type, data }) => {
  let content;
  if (type === 'DELIVERY') {
    content = resultMsg('BRD0', renderMsg(['你有', () => data.length, '笔订单待发货, 请及时处理']), () => {
      router.push('/order/item')
    })
  } else {
    content = resultMsg('WRD0', renderMsg(['你有', () => data.length, '笔订单待退款审核, 请及时处理']), () => {
      router.push('service/refund')
    })
  }

  ElNotification({
    title: '提醒',
    message: content,
    type: 'warning',
    position: 'bottom-right'
  })
}

/**
 * 判断是否有权限, 如果有则可以点击,否则不可点击
 * @param auth 权限
 * @param msg 要请点击的消息
 * @param clickFunc 点击后的回调
 * @returns {VNode|*}
 */
const resultMsg = (auth, msg, clickFunc) => {
  const selectAuth = userStore.hasAuth(auth);
  if (selectAuth) {
    return h(ElLink, {
      style: {
        cursor: 'pointer'
      },
      onClick: clickFunc
    }, () => msg)
  }
  return msg;
}

/**
 * 订阅消息,并进行消息展示 /ws前缀用来区分普通请求和websocket订阅请求
 */
onUnmounted(() => {
  client?.deactivate();
})

</script>
<style lang="scss" scoped>
@import '@/styles/index.scss';

.layer-main-header {
  height: 60px;
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
