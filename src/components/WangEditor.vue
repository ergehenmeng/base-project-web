<template>
  <div>
    <div style="border: 1px solid #ccc; width: 800px; ">
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          mode="simple"
      />
      <Editor
          style="height: 400px; overflow-y: hidden;"
          v-model="htmlValue"
          :defaultConfig="editorConfig"
          mode="simple"
          @onCreated="handleCreated"
          @onChange="setTextValue"
      />
      <textarea v-model="textValue" style="display: none"></textarea>
    </div>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import {shallowRef} from "vue";
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import useUserStore from '@/store/user';
import {defaultImgType} from '@/utils/image';
import {errorMsg} from "@/utils/message.js";
import {useRoute} from "vue-router";

const editorRef = shallowRef();
const route = useRoute();
const userStore = useUserStore();
const uploadUrl = import.meta.env.VITE_API_URL + "/manage/file/upload";

const htmlValue = defineModel('htmlValue', {
  default: () => '',
  type: String,
  required: false
})
const textValue = defineModel("textValue", {
  default: () => '',
  type: String,
  required: false
})

const props = defineProps({
  placeholder: {
    type: String,
    default: '请输入内容...'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const toolbarConfig = {};
const editorConfig = {
  placeholder: props.placeholder,
  MENU_CONF: {}
}

editorConfig.MENU_CONF['uploadImage'] = {
  server: uploadUrl,
  fieldName: "file",
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
      insertFn(res.data.address + res.data.path, "", "")
    } else {
      errorMsg(res.msg);
      if (res.code === 8848) {
        userStore.logout(route.fullPath);
      }
    }
  },
  onFailed: (file, res) => {
    console.log(`${file.name} 上传失败`, res)
  },
  onError: (file, err, res) => {
    if (err.message.indexOf("maximum allowed") !== -1) {
      errorMsg("图片大小不能超过2MB")
    } else {
      console.error("富文本上传图异常", err, res)
    }
  }
}

const setTextValue = async (editor) => {
  textValue.value = editor.getText();
  await nextTick();
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  editor?.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor;
  if (props.disabled) {
    editorRef.value?.disable();
  }
}

</script>