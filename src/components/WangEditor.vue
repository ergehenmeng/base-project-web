<template>
  <div>
    <div :style="{ border: '1px solid #ccc', width: props.width + 'px' }">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" mode="simple" />
      <Editor v-model="htmlValue" :style="{ 'overflow-y': 'hidden', height: props.height + 'px' }" mode="simple" :defaultConfig="editorConfig" @onCreated="handleCreated" @onChange="setTextValue" />
      <textarea v-model="textValue" style="display: none"></textarea>
    </div>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { shallowRef } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import useUserStore from '@/store/user';
import { defaultImgType } from '@/utils/image';
import { errorMsg } from '@/utils/message.js';
import { useRoute } from 'vue-router';

const editorRef = shallowRef();
const route = useRoute();
const userStore = useUserStore();
const uploadUrl = import.meta.env.VITE_API_URL + '/manage/file/upload';

/**
 * 用于接受编辑器内容, 为什么有get set方法, 是因为在父组件中对编辑器进行赋值操作时,如果值为空,在绑定时Editor内部会使用htmlValue中的值进行处理,导致空指针
 * htmlValue
 * @type {ModelRef<unknown | undefined, string>}
 */
const htmlValue = defineModel('htmlValue', {
  get(val) {
    if (val) {
      return val;
    }
    return '<p><br></p>';
  },
  set(val) {
    if (val) {
      return val;
    }
    return '<p><br></p>';
  }
});

const textValue = defineModel('textValue');

const props = defineProps({
  placeholder: {
    type: String,
    default: '请输入内容...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: 800
  },
  height: {
    type: Number,
    default: 400
  }
});

const editorConfig = {
  placeholder: props.placeholder,
  MENU_CONF: {}
};

editorConfig.MENU_CONF['uploadImage'] = {
  server: uploadUrl,
  fieldName: 'file',
  maxFileSize: 2 * 1024 * 1024,
  maxNumberOfFiles: 9,
  allowedFileTypes: defaultImgType,
  headers: {
    token: userStore.user?.token
  },
  timeout: 10000,
  customInsert: (res, insertFn) => {
    console.log(res);
    if (res.code === 200) {
      insertFn(res.data.address + res.data.path, '', '');
    } else {
      errorMsg(res.msg);
      if (res.code === 8848) {
        userStore.logout(route.fullPath);
      }
    }
  },
  onFailed: (file, res) => {
    console.log(`${file.name} 上传失败`, res);
  },
  onError: (file, err, res) => {
    if (err.message.indexOf('maximum allowed') !== -1) {
      errorMsg('图片大小不能超过2MB');
    } else {
      console.error('富文本上传图异常', err, res);
    }
  }
};

const setTextValue = (editor) => {
  textValue.value = editor.getText();
};

onBeforeUnmount(() => {
  const editor = editorRef.value;
  editor?.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor;
  if (props.disabled) {
    editorRef.value?.disable();
  }
};
</script>