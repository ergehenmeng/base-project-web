<template>
  <!-- 外层div -->
  <div class="arrbox" @click="onclick">
    <!-- 标签 -->
    <div v-for="(item,index) in tagsArr" :key="index" class="spanbox">
      <span class="tagspan">{{item}}</span>
      <i class="spanclose" @click="removeTag(index,item)"></i>
    </div>
    <!-- 输入框 -->
    <input
      :placeholder="placeholder"
      v-model="currentval"
      @keyup.enter="addTags"
      :style="inputStyle"
      class="inputTag"
      ref="inputTag"
      type="text"
    />
  </div>
</template>

<script>
export default {
  name: 'inputTags',
  props: {
    parentArr: {
      type: Array,
      default () {
        return []
      }
    },
    limit: { // 最多生成标签数
      type: Number,
      default: 3
    },
    placeholder: {
      type: String,
      default: '请输入'
    }
  },
  data () {
    return {
      currentval: '',
      tagsArr: [],
      inputLength: '',
    }
  },
  watch: {
    tagsArr () {
      this.$emit('on-change', this.tagsArr)
    },
    currentval (val) {
      // 实时改变input输入框宽度，防止输入内容超出input默认宽度显示不全
      this.inputLength = this.$refs.inputTag.value.length * 12 + 20;
      // 输入逗号，生成标签
      // if (val.indexOf(',') > -1) {
      //     this.currentval = this.currentval.split(',')[0];
      //     this.addTags();
      // }
    },
    parentArr () {
      this.tagsArr = this.parentArr.length ? this.parentArr : []
    }
  },
  computed: {
    inputStyle () {
      let style = {};
      style.width = `${this.inputLength}px`;
      return style;
    },
  },
  mounted() {
    this.tagsArr = this.parentArr;
  },
  methods: {
    removeTag (index, item) {
      this.tagsArr.splice(index, 1)
    },
    addTags () {
      if (this.tagsArr.length === this.limit) {
        this.$emit('on-limit', true);
        return;
      }
      if (this.tagsArr.indexOf(this.currentval) > -1) {
        this.$emit('on-repeat', true);
        return;
      }
      // 格式校验
      let reg = /^[1-9]+[0-9]*$/
      if (!reg.test(this.currentval)) {
        alert('格式不正确！');
        this.currentval = '';
        return;
      }
      this.tagsArr.push(this.currentval);
      this.currentval = '';
    },
    onclick() {
      this.$nextTick(()=>{
        this.$refs.inputTag.focus();
      })
    }
  }
}
</script>

<style>
/* 外层div */
.arrbox {
  width: 300px;
  box-sizing:border-box;
  background-color: white;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  font-size: 12px;
  text-align: left;
  padding-left: 5px;
  word-wrap: break-word;
  overflow: hidden;
}
/* 标签 */
.spanbox {
  display: inline-block;
  font-size: 14px;
  margin: 3px 4px 3px 0;
  background-color: #f7f7f7;
  border: 1px solid #e8eaec;
  border-radius: 3px;
}
.tagspan {
  height: 24px;
  line-height: 22px;
  max-width: 99%;
  position: relative;
  display: inline-block;
  padding-left: 8px;
  color: #495060;
  font-size: 12px;
  cursor: pointer;
  opacity: 1;
  vertical-align: middle;
  overflow: hidden;
  transition: 0.25s linear;
}
.spanclose {
  padding: 0 10px 5px 0;
  opacity: 1;
  -webkit-filter: none;
  filter: none;
}
.spanclose:after {
  content: "x";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 27px;
}
/* input */
.inputTag {
  font-size: 12px;
  border: none;
  box-shadow: none;
  outline: none;
  background-color: transparent;
  padding: 0;
  width: auto;
  min-width: 150px;
  vertical-align: top;
  height: 32px;
  color: #495060;
  line-height: 32px;
}
</style>