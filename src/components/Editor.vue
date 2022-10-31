<template>
  <div>
    <div class="editor">
      <aceEditor :value="content"
                 :lang="lang"
                 :theme='theme'
                 :style="{width: '100%', height: height + 'px'}"
                 @init="onInit"
                 @input="handleInput"/>
    </div>
    <div style=" position: absolute; right: 25px; top: 2px;">
      <el-tooltip content="复制" placement="right">
        <el-button type="text" icon="el-icon-document-copy" @click="doCopy"/>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import AceEditor from 'vue2-ace-editor'
import 'brace/ext/emmet'
import 'brace/ext/language_tools'
import 'brace/mode/text'
import 'brace/mode/xml'
import 'brace/mode/json'
import 'brace/mode/golang'
import 'brace/mode/csharp'
import 'brace/theme/xcode'
import 'brace/theme/chrome'
import 'brace/theme/terminal'

@Component({
  components: {
    aceEditor: AceEditor
  },
  props: {
    value: {
      required: true
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 100
    },
    lang: {
      type: String,
      default: 'xml'
    },
    theme: {
      type: String,
      default: 'xcode'
    }
  },
  watch: {
    value: {
      handler: 'onValueChanged'
    },
    readOnly: {
      handler: 'onReadOnlyChanged'
    },
    height: {
      handler: 'onHeightChanged'
    }
  }
})
class Editor extends VueBase {
  editor = null
  content = '<root />'

  handleInput (val) {
    this.content = val
    this.$emit('input', val)
  }

  onValueChanged (val) {
    this.content = val
  }

  onReadOnlyChanged (val) {
    if (this.editor) {
      this.editor.setReadOnly(val)
    }
  }

  onHeightChanged (val) {
    if (this.editor) {
      this.$nextTick(function () {
        this.editor.resize()
      })
    }
  }

  onInit (editor) {
    if (editor) {
      editor.setShowPrintMargin(false)
      editor.setReadOnly(this.readOnly)
      this.content = this.value
    }

    this.editor = editor
  }

  doCopy () {
    this.$copyText(this.content)
  }
}

export default Editor
</script>

<style scoped>
  .editor {
    outline: 1px solid #ccc;
    margin: 1px;
  }
</style>
