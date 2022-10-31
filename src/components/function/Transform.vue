<template>
  <el-tabs>
    <el-tab-pane label="Golang">
      <editor v-model="info.golang.content"
              :lang="info.golang.lang"
              :key="info.golang.lang"
              :height="200"
              :read-only="true" />
    </el-tab-pane>
    <el-tab-pane label="C#">
      <editor v-model="info.csharp.content"
              :lang="info.csharp.lang"
              :key="info.csharp.lang"
              :height="200"
              :read-only="true" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import Editor from '@/components/Editor'

@Component({
  components: {
    editor: Editor
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  watch: {
    data: {
      handler: 'onDataChanged'
    }
  }
})
class Transform extends VueBase {
  info = {
    golang: {
      lang: 'golang',
      content: ''
    },
    csharp: {
      lang: 'csharp',
      content: ''
    }
  }

  toTitleName (v) {
    if (!v) {
      return v
    }

    if (v.length < 2) {
      return v.toUpperCase()
    }

    return v[0].toUpperCase() + v.substr(1)
  }

  toGolanStructName (v) {
    v = this.toTitleName(v)
    if (!v) {
      return v
    }

    v = v.split('.').join('')
    v = v.split('[').join('')
    v = v.split(']').join('')

    return v[0].toUpperCase() + v.substr(1)
  }

  toCSharpClassName (v) {
    v = this.toTitleName(v)
    if (!v) {
      return v
    }

    v = v.split('.').join('')
    v = v.split('[').join('')
    v = v.split(']').join('')

    return v[0].toUpperCase() + v.substr(1)
  }

  toGolangType (v) {
    let isSpace = false
    if (v.indexOf('.') > -1) {
      isSpace = true
    }
    let isPoint = false
    if (v.indexOf('*') > -1) {
      isPoint = true
    }
    let isArray = false
    if (v.indexOf('[') > -1) {
      isArray = true
    }
    v = v.split('.').join('')
    v = v.split('*').join('')
    v = v.split('[').join('')
    v = v.split(']').join('')

    if (isSpace) {
      v = this.toTitleName(v)
    }
    if (isPoint) {
      v = '*' + v
    }
    if (isArray) {
      v = '[]' + v
    }

    return v
  }

  toCSharpType (v) {
    if (v === 'string' || v === '*string') {
      return 'string'
    } else if (v === 'bool') {
      return 'bool'
    } else if (v === '*bool') {
      return 'bool?'
    } else if (v === 'int' || v === 'int32' || v === 'uint32') {
      return 'int'
    } else if (v === '*int' || v === '*int32' || v === '*uint' || v === '*uint32') {
      return 'int?'
    } else if (v === 'int64' || v === 'uint64') {
      return 'long'
    } else if (v === '*int64' || v === '*uint64') {
      return 'long?'
    } else if (v === 'Date' || v === 'gtype.Date' || v === 'DateTime' || v === 'gtype.DateTime') {
      return 'DateTime'
    } else if (v === '*Date' || v === '*gtype.Date' || v === '*DateTime' || v === '*gtype.DateTime') {
      return 'DateTime?'
    } else {
      v = v.split('.').join('')
      v = v.split('*').join('')
      v = this.toTitleName(v)
    }

    return v
  }

  buildGolang (name, fields) {
    if (name.indexOf('[]') > -1) {
      return
    }

    let run = 'type ' + this.toGolanStructName(name) + ' struct {\r\n'
    if (fields) {
      const c = fields.length
      for (let i = 0; i < c; i++) {
        const field = fields[i]
        run += '\t' + this.toTitleName(field.name) + ' \t' + this.toGolangType(field.type) + ' \t`json:"' + field.name + '" note:"' + field.note + '"`\r\n'
      }
    }
    run += '}\r\n\r\n'

    this.info.golang.content += run
  }

  buildCSharp (name, fields) {
    if (name.indexOf('[]') > -1) {
      return
    }

    let run = 'public class ' + this.toCSharpClassName(name) + '\r\n{\r\n'
    if (fields) {
      const c = fields.length
      for (let i = 0; i < c; i++) {
        const field = fields[i]
        if (i > 0) {
          run += '\r\n'
        }
        run += '\t/// <summary>\r\n'
        run += '\t/// ' + field.note + '\r\n'
        run += '\t/// </summary>\r\n'
        run += '\t[JsonProperty("' + field.name + '")]\r\n'
        run += '\tpublic ' + this.toCSharpType(field.type) + ' ' + this.toTitleName(field.name) + ';\r\n'
      }
    }
    run += '}\r\n\r\n'

    this.info.csharp.content += run
  }

  onDataChanged (v) {
    this.info.golang.content = ''
    this.info.csharp.content = ''

    if (!v) {
      return
    }
    const c = v.length
    for (let i = 0; i < c; i++) {
      const model = v[i]
      if (!model) {
        continue
      }

      const name = model.name
      const fields = model.fields
      this.buildGolang(name, fields)
      this.buildCSharp(name, fields)
    }
  }

  mounted () {
    this.onDataChanged(this.data)
  }
}

export default Transform
</script>

<style scoped>

</style>
