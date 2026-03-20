<template>
  <div>
    <div :style="{ border: '1px solid #ccc', width: props.width + 'px' }">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" mode="simple" />
      <Editor v-model="safeHtmlValue" :style="{ 'overflow-y': 'hidden', height: props.height + 'px' }" mode="simple" :defaultConfig="editorConfig" @onCreated="handleCreated" @onChange="setTextValue" />
    </div>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import useUserStore from '@/store/user';
import { defaultImgType } from '@/utils/image';
import { errorMsg } from '@/utils/message.js';

const editorRef = shallowRef();
const userStore = useUserStore();
const uploadUrl = import.meta.env.VITE_API_PREFIX + '/manage/file/upload';

/**
 * 用于接受编辑器内容, 为什么有get set方法, 是因为在父组件中对编辑器进行赋值操作时,如果值为空,在绑定时Editor内部会使用htmlValue中的值进行处理,导致空指针
 * htmlValue
 * @type {ModelRef<unknown | undefined, string>}
 */
const htmlValue = defineModel('htmlValue', {
  type: String,
  default: ''
});

const safeHtmlValue = computed({
  get() {
    return htmlValue.value ?? '';
  },
  set(value) {
    htmlValue.value = typeof value === 'string' ? value : '';
  }
});

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
    if (res.code === 200) {
      insertFn(res.data.host + res.data.path, '', '');
    } else {
      errorMsg(res.msg);
      if (res.code === 8848) {
        userStore.logout();
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
  // 同步 HTML 内容到父组件，确保图片等内容能正确保存
  const html = editor.getHtml();
  if (html && html !== '<p><br></p>') {
    htmlValue.value = html;
  } else if (html === '<p><br></p>') {
    // 编辑器内容为空时，同步空值而非默认占位符
    htmlValue.value = '';
  }
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
  // 初始化：如果父组件传入空值，设置编辑器显示空内容
  if (!htmlValue.value) {
    editor.clear();
  }
};
</script>
