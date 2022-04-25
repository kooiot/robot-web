<template>
  <div class="title">
    <span>Robot 自动化测试管理系统</span>
    <el-divider direction="vertical"></el-divider>
    <span>版本号：{{$version}}</span>
    <el-divider direction="vertical"></el-divider>
    <span>Build：{{$buildTime}}</span>

    <div class="contact">
      <span @click="$open('192.168.1.139')">Robot服务器管理</span>
      <span @click="$open('cloud.thingsroot.com')">冬笋云平台</span>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.title {
  font-size: 13px;
  color: #909399;
}

.contact {
  display: inline;
  float: right;
}

.contact span {
  color: #606266;
  padding-left: 10px;
}

.contact span:hover {
  color: #409EFF;
  cursor: pointer;
}
</style>
