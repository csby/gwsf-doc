<template>
  <el-container>
    <el-header height="auto" ref="top">
      <Information />
    </el-header>
    <el-container>
      <el-aside :style="mainStyle">
        <Catalog @function-click="onFunctionClick"/>
      </el-aside>
      <el-main :style="mainStyle">
        <div class="function" v-show="funId !== ''">
          <FunIndex :id="funId" />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import Component from 'vue-class-component'
import Information from '@/components/Information'
import Catalog from '@/components/Catalog'
import FunIndex from '@/components/function/Index.vue'

@Component({
  components: {
    Information,
    Catalog,
    FunIndex
  }
})
class Home extends Vue {
  funId = ''
  mainHeight = 0

  onFunctionClick (id) {
    this.funId = id
  }

  get mainStyle () {
    const minHeight = this.mainHeight + 'px'
    return {
      'min-height': minHeight,
      'max-height': minHeight
    }
  }

  onSizeChanged () {
    const top = this.$refs.top
    if (!top) {
      return
    }

    const clientHeight = window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight

    let topHeight = top.offsetHeight
    if (top.$el) {
      topHeight = top.$el.offsetHeight
    }
    const marginHeight = 0
    const paddingHeight = 1
    this.mainHeight = clientHeight - topHeight - marginHeight - paddingHeight
  }

  mounted () {
    window.addEventListener('resize', this.onSizeChanged)
    this.onSizeChanged()
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.onSizeChanged)
  }
}

export default Home
</script>

<style scoped>
.el-header {
  background-color: darkblue;
  color: white;
  padding: 2px 5px;
}

.el-aside {
  padding: 2px 5px;
}

.el-main {
  padding: 0px 5px;
}
</style>
