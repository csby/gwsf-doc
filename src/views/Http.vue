<template>
  <div class="container">
    <div class="summary-header content">
      <span class="name">{{name}}</span>
    </div>
    <div class="content">
      <el-input v-model="url" placeholder="">
        <template slot="prepend">{{method}}</template>
        <el-dropdown slot="append" @click="send" :disabled="isSending" :split-button="true" trigger="click">
          <div style="width: 65px; text-align: center;">
                        <span v-if="isSending">
                            <i class="el-icon-loading"></i>
                            <span>发送中-</span>
                        </span>
            <span v-else class="btn-send">发 送</span>
          </div>

          <el-dropdown-menu slot="dropdown">
            <div class="timeout">
              <span>超时时间</span>
              <el-input-number  v-model="timeout" size="small" :min="1" controls-position="right"/>
              <span>秒</span>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </el-input>
    </div>
    <div class="content"
         v-loading="isSending"
         element-loading-text="发送中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.5)">
      <div>
        <div class="param-header">
          <span>输入参数</span>
        </div>
        <el-tabs v-model="inputTab" tabPosition="top">
          <el-tab-pane label="body" name="tpInputBody">
            <div v-if="isForm">
              <div class="input-row" v-for="(form, index) in inputForms" :key="index">
                <file-input v-if="form.valueKind === 1"
                            v-model="form.value"
                            :name="form.key"
                            :required="form.required"
                            :note="form.note">
                </file-input>
                <el-input v-else size="small"
                          class="txt-input"
                          :placeholder="form.note"
                          v-model="form.value"
                          :clearable="true">
                  <template slot="prepend">
                    <span v-if="form.required" class="model-key query-label query-required">{{form.key}}</span>
                    <span v-else class="model-key query-label query-optional">{{form.key}}</span>
                  </template>
                </el-input>
              </div>
            </div>
            <div v-else>
              <vueJsonEditor v-if="isJsonInput" v-model="inputBodyJson"  class="input-body-json"
                             :showBtns="false"
                             :mode="defaultMode"
                             :modes="defaultModes"
                             :lang="defaultLang">
              </vueJsonEditor>
              <el-input v-else v-model="inputBody" type="textarea"
                        :autosize="{ minRows: 4, maxRows: 12}"  placeholder="" class="input-body">
              </el-input>
            </div>
          </el-tab-pane>
          <el-tab-pane label="header" name="tpInputHeader" :disabled="inputHeaders.length === 0">
                    <span slot="label">
                        <span>header</span>
                        <el-badge slot="label" :value="inputHeaders.length" :hidden="inputHeaders.length === 0" class="item"/>
                    </span>
            <div class="input-row" v-for="(header, index) in inputHeaders" :key="index">
              <el-input size="small" :class="header.token ? '': 'txt-input'"
                        :placeholder="header.note"
                        v-model="header.defaultValue"
                        :clearable="true">
                <template slot="prepend">
                  <span v-if="header.required" class="model-key query-label query-required">{{header.name}}</span>
                  <span v-else class="model-key query-label query-optional">{{header.name}}</span>
                </template>
                <el-button class="btn-append" slot="append" v-if="header.token" @click="showTokenDialog('header', header.name)" >
                  <span class="btn-send">去创建一个凭证</span>
                </el-button>
              </el-input>
            </div>
          </el-tab-pane>
          <el-tab-pane label="query" name="tpInputQuery" :disabled="inputQueries.length === 0">
                    <span slot="label">
                        <span>query</span>
                        <el-badge slot="label" :value="inputQueries.length" :hidden="inputQueries.length === 0" class="item"/>
                    </span>
            <div class="input-row" v-for="(query, index) in inputQueries" :key="index">
              <el-input size="small"
                        :class="query.token ? '': 'txt-input'"
                        :placeholder="query.note"
                        v-model="query.defaultValue"
                        :clearable="true">
                <template slot="prepend">
                  <span v-if="query.required" class="model-key query-label query-required">{{query.name}}</span>
                  <span v-else class="model-key query-label query-optional">{{query.name}}</span>
                </template>
                <el-button class="btn-append" slot="append" v-if="query.token" @click="showTokenDialog('query', query.name)">
                  <span class="btn-send">去创建一个凭证</span>
                </el-button>
              </el-input>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div >
        <div class="param-header">
          <span>输出参数</span>
        </div>
        <el-tabs value="tpOutputBody" tabPosition="top">
          <el-tab-pane label="body" name="tpOutputBody">
           <div>
             <el-tooltip content="复制" placement="right" style="position: absolute; right: 25px;">
               <el-button type="text" icon="el-icon-document-copy" @click="doCopy('outputBody')"/>
             </el-tooltip>
             <pre ref="outputBody"></pre>
           </div>
          </el-tab-pane>
          <el-tab-pane label="header" name="tpOutputHeader">
                    <span slot="label">
                        <span>header</span>
                        <el-badge slot="label" :value="outputHeaders.length" :hidden="outputHeaders.length === 0" class="item"/>
                    </span>
            <div v-for="(header, index) in outputHeaders" :key="index">
              <span class="header-label">{{header.name}}</span>
              <span>&nbsp;→&nbsp;</span>
              <span >{{header.value}}</span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-show="isImageVisible">
        <div class="param-header">
          <span>图片信息</span>
        </div>
        <div>
          <el-image :src="imageSource"></el-image>
        </div>
      </div>
    </div>

    <tokenDialog v-model="tokenDialogVisible" :id="id" :place="tokenPlace" :name="tokenName" @created="onCreateToken"/>
  </div>
</template>

<script>
import VueBase from '@/components/VueBase'
import Component from 'vue-class-component'
import VueJsonEditor from 'vue-json-editor'
import axios from 'axios'
import vkbeautify from 'vkbeautify'
import TokenDialog from '@/components/tryit/Token'
import FileInput from '@/components/tryit/FileInput'

@Component({
  components: {
    vueJsonEditor: VueJsonEditor,
    tokenDialog: TokenDialog,
    fileInput: FileInput
  },
  props: {
    funId: {
      type: String,
      default: ''
    }
  }
})
class Http extends VueBase {
  defaultMode = 'code'
  defaultModes = ['tree', 'code', 'text']
  defaultLang = 'en'
  isSending = false
  isJsonInput = false
  id = ''
  name = ''
  url = ''
  method = ''
  inputTab = 'tpInputBody'
  inputBody = ''
  inputBodyJson = {}
  inputQueries = []
  inputHeaders = []
  inputForms = []
  inputFormat = 1
  outputHeaders = []
  outputFormat = 1
  isForm = false

  tokenDialogVisible = false
  tokenPlace = ''
  tokenName = ''
  timeout = 30

  isImageVisible = false
  imageSource = ''

  doCopy (ref) {
    const pre = this.$refs[ref]
    if (pre) {
      this.$copyText(pre.innerText)
    }
  }

  showTokenDialog (place, name) {
    this.tokenPlace = place
    this.tokenName = name
    this.tokenDialogVisible = true
  }

  onCreateToken (place, name, token) {
    let items = []
    if (place === 'header') {
      items = this.inputHeaders
    } else if (place === 'query') {
      items = this.inputQueries
    }

    const count = items.length
    for (let i = 0; i < count; i++) {
      if (items[i].name === name) {
        items[i].defaultValue = token
        break
      }
    }
    this.tokenDialogVisible = false
  }

  showImage (data) {
    this.isImageVisible = false
    if (!data) {
      return
    }
    if (data.code !== 0) {
      return
    }
    if (!data.data) {
      return
    }
    if (!data.data.value) {
      return
    }

    this.imageSource = data.data.value
    this.isImageVisible = true
  }

  onSendSuccess (response) {
    this.isSending = false
    let isJson = false
    const headers = []
    if (response.headers) {
      for (const k in response.headers) {
        const v = response.headers[k]
        headers.push({ name: k, value: v })
        if (k === 'content-type') {
          if (this.isNotNullOrEmpty(v)) {
            if (v.indexOf('application/json') !== -1) {
              isJson = true
            }
          }
        }
      }
    }
    this.outputHeaders = headers

    if (isJson) {
      this.$refs.outputBody.innerHTML = this.syntaxHighlight(response.data)
      this.showImage(response.data)
    } else {
      if (this.outputFormat === 2) {
        this.$refs.outputBody.innerHTML = this.syntaxXmlHighlight(vkbeautify.xml(response.data))
      } else {
        this.$refs.outputBody.innerHTML = response.data
      }
    }
  }

  onSendFail (err) {
    this.isSending = false
    this.$refs.outputBody.innerHTML = err.message
  }

  send () {
    this.showImage(null)
    let isJson = false
    const headers = {}
    if (this.inputHeaders) {
      const count = this.inputHeaders.length
      for (let i = 0; i < count; i++) {
        const header = this.inputHeaders[i]
        if (header.required) {
          if (this.isNullOrEmpty(header.defaultValue)) {
            this.error("header -> '" + header.name + "' 必填")
            this.inputTab = 'tpInputHeader'
            return
          }
        }
        headers[header.name] = header.defaultValue

        if (header.name.toLowerCase() === 'content-type') {
          if (this.isNotNullOrEmpty(header.defaultValue)) {
            if (header.defaultValue.toLowerCase().indexOf('json') !== -1) {
              isJson = true
            }
          }
        }
      }
    }

    const params = {}
    if (this.inputQueries) {
      const count = this.inputQueries.length
      for (let i = 0; i < count; i++) {
        const query = this.inputQueries[i]
        if (query.required) {
          if (this.isNullOrEmpty(query.defaultValue)) {
            this.error("query -> '" + query.name + "' 必填")
            this.inputTab = 'tpInputQuery'
            return
          }
        }
        params[query.name] = query.defaultValue
      }
    }

    const forms = new FormData()
    if (this.inputForms && this.isForm) {
      const count = this.inputForms.length
      for (let i = 0; i < count; i++) {
        const form = this.inputForms[i]
        if (form.required) {
          if (this.isNullOrEmpty(form.value)) {
            this.error("body -> '" + form.key + "' 必填")
            this.inputTab = 'tpInputBody'
            return
          }
        }
        forms.append(form.key, form.value)
      }
    }

    let data
    try {
      if (this.isForm) {
        data = forms
      } else if (isJson) {
        data = this.inputBodyJson
      } else {
        data = this.inputBody
      }
    } catch (e) {
      this.error(e.message)
      this.inputTab = 'tpInputBody'
      return
    }

    const config = {
      timeout: 1000 * this.timeout,
      method: this.method,
      url: this.url,
      headers: headers,
      params: params,
      data: data
    }

    this.isSending = true
    axios.request(config).then(this.onSendSuccess).catch(this.onSendFail)
  }

  onGetFunction (code, err, data) {
    if (code === 0) {
      this.id = data.id
      this.name = data.name
      this.url = data.fullPath
      this.method = data.method
      this.outputFormat = data.output.format
      this.inputFormat = data.input.format
      if (data.input.example) {
        if (data.output.format === 1) {
          this.inputBodyJson = data.input.example
        } else if (data.output.format === 2) {
          this.inputBody = vkbeautify.xml(data.input.example)
        } else {
          this.inputBody = data.input.example
        }
      }
      this.inputQueries = data.input.queries
      this.inputHeaders = data.input.headers
      this.inputForms = data.input.forms
      this.isJsonInput = false
      this.isForm = false
      if (this.inputHeaders) {
        const count = this.inputHeaders.length
        for (let i = 0; i < count; i++) {
          const header = this.inputHeaders[i]
          if (header.name.toLowerCase() === 'content-type') {
            if (this.isNotNullOrEmpty(header.defaultValue)) {
              if (header.defaultValue.toLowerCase().indexOf('json') !== -1) {
                this.isJsonInput = true
              }
              if (header.defaultValue.toLowerCase().indexOf('form') !== -1) {
                this.isForm = true
              }
            }
          }
        }
      }
    } else {
      this.apiError(err)
    }
  }

  getFunction (id) {
    const uri = this.uris.getFunction + id
    this.post(uri, null, this.onGetFunction)
  }

  mounted () {
    this.getFunction(this.funId)
  }
}

export default Http
</script>

<style scoped>
.container {
  padding: 0;
}

.content {
  padding: 1px 5px;
}
.summary-header {
  background-color: darkblue;
  color: white;
  margin-bottom: 5px;
}

.param-header {
  margin-top: 10px;
  background-color: lightgray;
}

.input-row {
  margin-bottom: 5px;
}
.input-body {
  margin-top: 2px;
}
.input-body-json {
  margin-top: 0;
}
.header-label {
  font-weight: bold;
}

.query-required {
  color: red;
}
.query-label {
  display: inline-block;
  width: 120px;
  align-content: end;
  text-align: right;
}
.btn-append {
  width: 135px;
}
.txt-input {
  width: calc(100% - 135px);
}
.btn-send,
.query-optional {
  color: #000;
}
.timeout {
  padding: 1px 10px;
}
pre {
  padding: 1px 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
  border: solid 1px lightgray;
  border-radius: 4px;
  min-height: 100px;
  max-height: 360px;
  overflow: auto;
}
</style>
