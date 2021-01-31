<template>
  <el-container>
    <el-header height="auto">
      <Information />
    </el-header>
    <el-container>
      <el-aside>
        <Catalog @function-click="onFunctionClick"/>
      </el-aside>
      <el-main>
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

  onFunctionClick (id) {
    this.funId = id
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
