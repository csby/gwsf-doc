<template>
  <pre ref="example" v-show="data !== null"></pre>
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
}

export default Example
</script>

<style scoped>
pre {
  outline: 1px solid #ccc;
  padding: 5px;
  margin: 2px;
  max-height: 300px;
  overflow: auto;
}
</style>
