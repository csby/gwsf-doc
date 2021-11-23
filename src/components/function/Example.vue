<template>
  <div v-show="data !== null">
    <el-tooltip content="复制" placement="right" style="position: absolute; right: 25px;">
      <el-button type="text" icon="el-icon-document-copy" @click="doCopy"/>
    </el-tooltip>
    <pre ref="example"></pre>
  </div>
</template>

<script>
import VueBase from '@/components/VueBase'
import Component from 'vue-class-component'
import vkbeautify from 'vkbeautify'

@Component({
  props: {
    format: {
      type: Number,
      default: 1
    },
    data: {
      type: [Object, String],
      default: null
    }
  },
  watch: {
    data: {
      handler: 'onDataChanged'
    }
  }
})
class Example extends VueBase {
  onDataChanged (newVal, oldVue) {
    if (newVal) {
      if (this.format === 1) {
        this.$refs.example.innerHTML = this.syntaxHighlight(newVal)
      } else if (this.format === 2) {
        this.$refs.example.innerHTML = this.syntaxXmlHighlight(vkbeautify.xml(newVal))
      } else {
        this.$refs.example.innerHTML = newVal
      }
    } else {
      this.$refs.example.innerHTML = ''
    }
  }

  doCopy () {
    const pre = this.$refs.example
    if (pre) {
      this.$copyText(pre.innerText)
    }
  }
}

export default Example
</script>

<style scoped>
pre {
  outline: 1px solid #ccc;
  padding: 5px;
  margin: 2px;
  min-height: 50px;
  max-height: 300px;
  overflow: auto;
}
</style>
