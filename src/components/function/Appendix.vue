<template>
  <el-container>
    <el-aside width="200px">
      <div class="title">{{selected.label}}</div>
      <div class="border-value">
        <el-tree :data="items" empty-text=" "
                 :highlight-current="true"
                 :default-expand-all="true"
                 @node-click="onNodeClick">
          <template slot-scope="{ node, data }">
            <div class="value">
              <span>{{data.value}}</span>
              <span>{{data.note}}</span>
            </div>
          </template>
        </el-tree>
      </div>
    </el-aside>
    <el-main>
      <div>
        <div class="line">
          <span>名称: {{selected.name}}</span>
          <span v-show="selected.value > 0" style="margin-left: 5px">- [ {{selected.value}} ]</span>
        </div>
        <div class="line">说明: {{selected.note}}</div>
      </div>
      <el-row>
        <el-col :span="12">
          <div class="model">
            <div class="title">结构</div>
            <div class="border" style="padding-left: 5px;">
              <Model :data="selected.model" />
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="example">
            <div class="title">示例</div>
            <div style="padding-left: 1px">
              <Example :data="selected.example"/>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import Model from './Model'
import Example from './Example'

@Component({
  components: {
    Model,
    Example
  },
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  watch: {
    value: {
      handler: 'onValueChanged'
    }
  }
})
class Appendix extends VueBase {
  items = []
  selected = {
    label: '',
    name: '',
    note: '',
    value: 0,
    example: null,
    model: []
  }

  onValueChanged (v) {
    if (v) {
      this.items = v.items
      this.selected.label = v.label
    } else {
      this.items = []
      this.selected.label = ''
    }
    this.selected.name = ''
    this.selected.note = ''
    this.selected.value = 0
    this.selected.example = null
    this.selected.model = []
  }

  onNodeClick (data) {
    if (data) {
      this.selected.name = data.name
      this.selected.note = data.note
      this.selected.value = data.value
      this.selected.example = data.example
      this.selected.model = data.model
    } else {
      this.selected.name = ''
      this.selected.note = ''
      this.selected.value = 0
      this.selected.example = null
      this.selected.model = []
    }
  }

  mounted () {
    this.onValueChanged(this.value)
  }
}

export default Appendix
</script>

<style scoped>
  .el-main {
    padding: 0 0 0 10px;
  }

  .el-row {
    padding: 0;
  }

  .line {
    height: 25px;
    padding-left: 3px;
    background-color: #F2F6FC;
  }

  .title {
    height: 23px;
    padding-left: 3px;
    background-color: #DCDFE6;
  }

  .model {
    padding-right: 10px;
  }

  .example {
  }

  .border {
    height: 200px;
    min-height: 200px;
    max-height: 200px;
    overflow: auto;

    border-color: #DCDFE6;
    border-style: solid;
    border-width: 0 1px 1px 1px;
  }

  .border-value {
    height: 250px;
    min-height: 250px;
    max-height: 250px;
    overflow: auto;

    border-color: #DCDFE6;
    border-style: solid;
    border-width: 0 1px 1px 1px;
  }

  .value {
    width: 100%;
    margin-right: 5px;
  }
  .value :last-child {
    position: absolute;
    right: 2px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #C0C4CC;
    font-weight: lighter;
  }
</style>
