<template>
  <div class="info">
    <img class="img" alt="api logo" src="../assets/logo.png">
    <span>{{backName}}</span>
    <span>接口文档 {{backVersion}}</span>
    <div class="front">
      <el-tooltip effect="light" content="前端版本" placement="left">
      <span>{{frontVersion}}</span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import VueBase from '@/components/VueBase'
import Component from 'vue-class-component'
import Version from '@/version'

@Component
class Information extends VueBase {
  frontVersion = Version.version
  backVersion = ''
  backName = ''

  onGetInfo (code, err, data) {
    if (code === 0) {
      this.backName = data.name
      this.backVersion = data.version
    } else {
      this.apiError(err)
    }
  }

  getInfo () {
    this.post(this.uris.getServerInfo, null, this.onGetInfo)
  }

  mounted () {
    this.getInfo()
  }
}

export default Information
</script>

<style scoped>
.info {
  display: flex;
  align-items: center;
  padding-bottom: 5px;
  font-size: medium;
}

.img {
  width: 25px;
  height: 25px;
  padding-right: 5px;
}

.front {
  flex: 1;
  text-align: right;
  color: darkgray;
  padding-top: 5px;
}
</style>
