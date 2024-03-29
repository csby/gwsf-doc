<template>
  <div class="container">
    <div class="summary-header content">
      <span>{{name}}</span>
    </div>
    <div class="content">
      <el-input v-model="url" placeholder="">
        <template slot="prepend">{{method}}</template>
        <el-button slot="append" @click="openWebSocket" style="width: 135px;" :disabled="status === statuses.opening || status === statuses.closing">
          <span v-if="status === statuses.closed" class="btn-send">打 开</span>
          <span v-else class="btn-send">关 闭</span>
        </el-button>
      </el-input>
      <div class="status">
        <span style="padding-right: 5px;">状态:</span>
        <div style="font-weight: bold">
          <span :style="{color: statusColor[status]}">{{statusTxt[status]}}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div>
        <div class="param-header">
          <span>输入参数</span>
        </div>
        <el-tabs v-model="inputTab" tabPosition="top">
          <el-tab-pane label="body" name="tpInputBody">
            <editor v-model="inputBody"
                    lang="json"
                    :height="210" />
            <div style="padding-top: 5px;">
              <el-button type="primary" :disabled="status !== statuses.opened" @click="send">
                <span>发 送</span>
              </el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="query" name="tpInputQuery" :disabled="inputQueries.length === 0">
                    <span slot="label">
                        <span>query</span>
                        <el-badge slot="label" :value="inputQueries.length" :hidden="inputQueries.length === 0" class="item"/>
                    </span>
            <div v-for="(query, index) in inputQueries" :key="index">
              <el-input size="small" :placeholder="query.note" v-model="query.defaultValue" :clearable="true">
                <template slot="prepend">
                  <span v-if="query.required" class="model-key query-label query-required">{{query.name}}</span>
                  <span v-else class="model-key query-label query-optional">{{query.name}}</span>
                </template>
                <el-button slot="append" v-if="query.token" @click="showTokenDialog('query', query.name)" style="width: 135px;">
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
          <div style="flex: 1; text-align: right;">
            <span>最大显示记录:</span>
            <el-input-number v-model="outputMaxNumber" size="mini" :min="1" :max="1000" style="margin: 0px 5px;"/>
            <el-button type="danger" icon="el-icon-delete" style="padding: 4px 5px;" @click="clear">清 空</el-button>
          </div>
        </div>
        <div ref="outputBody" class="output-body"></div>
      </div>
    </div>

    <tokenDialog v-model="tokenDialogVisible" :id="id" :place="tokenPlace" :name="tokenName" @created="onCreateToken"/>
  </div>
</template>

<script>
import VueBase from '@/components/VueBase'
import Component from 'vue-class-component'
import Editor from '@/components/Editor'
import TokenDialog from '@/components/tryit/Token'

@Component({
  components: {
    editor: Editor,
    tokenDialog: TokenDialog
  },
  props: {
    funId: {
      type: String,
      default: ''
    }
  }
})
class Socket extends VueBase {
  ws = null
  status = 0
  statuses = {
    closed: 0,
    opening: 1,
    opened: 2,
    closing: 3
  }

  statusTxt = [
    '已关闭',
    '打开中...',
    '已打开',
    '关闭中...'
  ]

  statusColor = [
    'gray',
    'blue',
    'green',
    'blue'
  ]

  isJsonInput = false
  id = ''
  name = ''
  url = ''
  method = ''
  inputTab = 'tpInputBody'
  inputBody = ''
  inputQueries = []
  outputMaxNumber = 10

  tokenDialogVisible = false
  tokenPlace = ''
  tokenName = ''

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

  onWebSocketOpened () {
    this.status = this.statuses.opened
    this.inputTab = 'tpInputBody'
  }

  onWebSocketClosed () {
    this.status = this.statuses.closed
    this.ws = null
  }

  onWebSocketMessage (evt) {
    if (!evt.data) {
      return
    }
    const txt = document.createTextNode(evt.data)
    const msg = document.createElement('pre')
    msg.appendChild(txt)

    const msgBox = this.$refs.outputBody
    msgBox.appendChild(msg)

    while (msgBox.childNodes.length > this.outputMaxNumber) {
      msgBox.removeChild(msgBox.firstChild)
    }
    msgBox.scrollTop = msgBox.scrollHeight
  }

  onWebSocketError (evt) {
    this.error(evt.type)
  }

  openWebSocket () {
    if (this.status === this.statuses.opened) {
      if (this.ws) {
        this.status = this.statuses.closing
        this.ws.close()
      }
    } else if (this.status === this.statuses.closed) {
      let params = ''
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
          if (i > 0) {
            params = params + '&' + query.name + '=' + query.defaultValue
          } else {
            params = '?' + query.name + '=' + query.defaultValue
          }
        }
      }

      const url = this.url + params
      this.ws = new WebSocket(url)
      this.ws.onopen = this.onWebSocketOpened
      this.ws.onclose = this.onWebSocketClosed
      this.ws.onmessage = this.onWebSocketMessage
      this.ws.onerror = this.onWebSocketError

      this.status = this.statuses.opening
    }
  }

  send () {
    if (!this.ws) {
      return
    }

    let data
    try {
      data = this.inputBody
    } catch (e) {
      this.error(e.message)
      this.inputTab = 'tpInputBody'
      return
    }

    if (typeof data !== 'string') {
      data = JSON.stringify(data, undefined, 4)
    }

    this.ws.send(data)
  }

  clear () {
    const msgBox = this.$refs.outputBody
    msgBox.innerHTML = ''
  }

  onGetFunction (code, err, data) {
    if (code === 0) {
      this.id = data.id
      this.name = data.name
      this.url = data.fullPath
      this.method = data.method
      if (data.input.example) {
        this.inputBody = this.formatJson(data.input.example)
      }
      this.inputQueries = data.input.queries
      this.isJsonInput = true
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

export default Socket
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
  margin-bottom: 3px;
}

.param-header {
  margin-top: 10px;
  padding: 0px 2px;
  display: flex;
  align-items: center;
  background-color: lightgray;
}

.input-body {
  margin-top: 2px;
}
.input-body-json {
  margin-top: 0;
}

.query-label {
  display: inline-block;
  width: 120px;
  align-content: end;
  text-align: right;
}
.btn-send,
.query-optional {
  color: #000;
}
pre {
  padding: 0px 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.status {
  display: flex;
  align-items: center;
  padding-top: 5px;
}
.output-body {
  overflow-x: auto;
  width: calc(100% - 12px);
  min-height: 200px;
  max-height: 350px;
  margin-top: 5px;
  padding: 0px 5px;
  border: lightgray 1px solid;
}
</style>
