<template>
  <el-collapse v-model="activeItems">
    <Summary name="summary" :data="data" />
    <el-collapse-item name="input">
      <template slot="title">
        <span class="pnl-title">输入参数</span>
      </template>
      <el-tabs value="tpInputBody" tabPosition="left">
        <el-tab-pane label="header" name="tpInputHeader" :disabled="inputHeaders.length < 1">
          <Header :data="inputHeaders" :optional="true" />
        </el-tab-pane>
        <el-tab-pane label="query" name="tpInputQuery" :disabled="inputQueries.length < 1">
          <Header :data="inputQueries" :optional="true" />
        </el-tab-pane>
        <el-tab-pane label="body" name="tpInputBody">
          <Form v-if="isForm" :data="inputForms" />
          <el-tabs v-else value="tpInputExample" tabPosition="right">
            <el-tab-pane label="结构" name="tpInputModel">
              <Model :data="inputModels" :optional="true"/>
            </el-tab-pane>
            <el-tab-pane label="示例" name="tpInputExample">
              <Example :format="inputFormat" :data="inputExample" />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </el-collapse-item>

    <el-collapse-item name="output">
      <template slot="title">
        <span class="pnl-title">输出参数</span>
      </template>
      <el-tabs value="tpOutputBody" tabPosition="left">
        <el-tab-pane label="header" name="tpOutputHeader" :disabled="outputHeaders.length < 1">
          <Header :data="outputHeaders" />
        </el-tab-pane>
        <el-tab-pane label="body" name="tpOutputBody">
          <el-tabs value="tpOutputExample" tabPosition="right">
            <el-tab-pane label="结构" name="tpOutputModel">
              <Model :data="outputModels" />
            </el-tab-pane>
            <el-tab-pane label="示例" name="tpOutputExample">
              <Example :format="outputFormat" :data="outputExample" />
            </el-tab-pane>
            <el-tab-pane label="代码" name="tpOutputError" v-if="outputErrors.length > 0">
              <Code :data="outputErrors" />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import VueBase from '@/components/VueBase'
import Component from 'vue-class-component'
import Summary from './Summary'

import Model from './Model'
import Example from './Example'
import Header from './Header'
import Form from './Form'
import Code from './Code'

  @Component({
    components: {
      Summary,
      Model,
      Example,
      Header,
      Form,
      Code
    },
    props: {
      id: {
        type: String,
        default: ''
      }
    },
    watch: {
      id: {
        handler: 'onIdChanged'
      }
    }
  })
class Function extends VueBase {
    activeItems = ['summary', 'output', 'input']
    data = null
    outputFormat = 1
    outputExample = null
    outputModels = []
    outputHeaders = []
    outputErrors = []
    inputFormat = 1
    inputExample = null
    inputModels = []
    inputHeaders = []
    inputQueries = []
    inputForms = []
    isForm = false

    onIdChanged (newVal, oldVal) {
      if (newVal === oldVal) {
        return
      }
      this.getFunction(newVal)
    }

    onGetFunction (code, err, data) {
      if (code === 0) {
        this.data = data

        // output
        this.outputFormat = data.output.format
        if (data.output.model) {
          this.outputModels = data.output.model
        } else {
          this.outputModels = []
        }
        this.outputHeaders = data.output.headers
        this.outputExample = data.output.example
        if (data.output.errors) {
          this.outputErrors = data.output.errors
        }

        // input
        this.inputFormat = data.input.format
        if (data.input.model) {
          this.inputModels = data.input.model
        } else {
          this.inputModels = []
        }
        this.inputHeaders = data.input.headers
        this.inputQueries = data.input.queries
        this.inputForms = data.input.forms
        this.inputExample = data.input.example
        this.isForm = false
        const inputHeaderCount = data.input.headers.length
        for (let i = 0; i < inputHeaderCount; i++) {
          const header = data.input.headers[i]
          if (header.name.toLowerCase() === 'content-type') {
            const v = header.defaultValue
            if (this.isNotNullOrEmpty(v)) {
              if (v.indexOf('form') !== -1) {
                this.isForm = true
              }
            }
          }
        }
      } else {
        this.apiError(err)
      }
    }

    getFunction (id) {
      const uri = this.network.uris.getFunction + id
      this.post(uri, null, this.onGetFunction)
    }
  }

export default Function
</script>
