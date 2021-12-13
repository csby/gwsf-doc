<template>
  <div class="root" v-show="data !== null">
    <editor v-model="content"
            :lang="lang"
            :height="200"
            :read-only="true" />
  </div>
</template>

<script>
import VueBase from '@/components/VueBase'
import Component from 'vue-class-component'
import Editor from '@/components/Editor'

@Component({
  components: {
    editor: Editor
  },
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
    format: {
      handler: 'onFormatChanged'
    },
    data: {
      handler: 'onDataChanged'
    }
  }
})
class Example extends VueBase {
  lang = 'json'
  content = ''

  onFormatChanged (newVal, oldVue) {
    if (newVal === 1) {
      this.lang = 'json'
    } else if (newVal === 2) {
      this.lang = 'xml'
    } else {
      this.lang = 'text'
    }
  }

  onDataChanged (newVal, oldVue) {
    if (newVal) {
      if (this.format === 1) {
        this.content = this.formatJson(newVal)
      } else if (this.format === 2) {
        this.content = this.formatXml(newVal)
      } else {
        this.content = newVal
      }
    } else {
      this.content = ''
    }
  }
}

export default Example
</script>

<style scoped>
  .root {
    outline: 1px solid #ccc;
  }
</style>
