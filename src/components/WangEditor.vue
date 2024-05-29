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

const route = useRoute();
const userStore = useUserStore();
const uploadUrl = import.meta.env.VITE_API_URL + "/manage/file/upload";

const htmlValue = defineModel('htmlValue')
const textValue = defineModel("textValue")

const props = defineProps({
  placeholder: {
    type: String,
    default: '请输入内容...'
  }
})

const editorRef = shallowRef();
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
    token: userStore.user.token
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
  }
}

const setTextValue = (editor) => {
  textValue.value = editor.getText();
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  editor?.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor
}



</script>

<style lang="scss" scoped>

</style>