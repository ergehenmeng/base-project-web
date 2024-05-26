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
import {imageCheck} from '@/utils/image';
import {errorMsg} from "@/utils/message.js";

const userStore = useUserStore();
const uploadUrl = import.meta.env.VITE_API_URL + "/manage/file/upload";
const headers = {
  'token': userStore.user.token
}

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
const editorConfig = {placeholder: props.placeholder}

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

const handleImageSuccess = (res) => {
  if (res.code !== 200) {
    errorMsg(res.msg);
    return;
  }
  const {data} = res;
  formData.value.path = data.address + data.path
  formData.value.size = Number.parseInt(data.size);
}

const beforeImageUpload = (rawFile) => {
  return imageCheck(rawFile);
}

</script>

<style lang="scss" scoped>

</style>