<template>
  <d2-container>
    <div class="cs-card">
      <i class="el-icon-collection-tag d2-pb">
        <span class="d2-pl-5">设备信息</span>
      </i>
      <el-descriptions>
          <el-descriptions-item label="设备序列号">{{info.client_id}}</el-descriptions-item>
          <el-descriptions-item label="系统">{{clientData.system}}</el-descriptions-item>
          <el-descriptions-item label="主机名">{{clientData.hostname}}</el-descriptions-item>
          <el-descriptions-item label="客户端 ID">{{info.id}} </el-descriptions-item>
          <el-descriptions-item label="硬件">{{clientData.hardware}}</el-descriptions-item>
      </el-descriptions>
    </div>

    <el-table
      :data="tasks"
      :highlight-current-row="true"
      row-key="uuid"
      :tree-props="{children: 'get_attribute'}"
      :row-class-name="tableRowClassName"
      >

      <el-table-column
        label="编号"
        prop="task.id"
        width="200">
        <template slot-scope="scope">
          <span>{{scope.row.task.id}}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="60">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.icon"
            width="150"
            placement="top"
            trigger="hover">
            <div class="popover-image">
              <el-image
                :src="scope.row.icon | getPreviewUrl"
                @click.stop="$preview(scope.row.icon)"
                fit="fill"/>
            </div>
            <i class="el-icon-picture cs-mr-5" slot="reference"/>
          </el-popover>

          <i v-if="scope.row.is_important" class="attribute-important el-icon-s-flag"/>
        </template>
      </el-table-column>

      <el-table-column
        label="名称"
        prop="task.task"
        width="160">
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.task.description"
            :content="`描述：${scope.row.task.description}`"
            placement="top">
            <span>
              {{scope.row.task.task}}
            </span>
          </el-tooltip>

          <span v-else>
            {{scope.row.task.task}}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="状态"
        prop="task.status"
        :show-overflow-tooltip="true"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row.task.status | getStatusValue}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="结果"
        width="120">
        <template slot-scope="scope">
          <div v-if="!scope.row.detail.result">
            <el-button v-if="isRunning(scope.row.task.status)" size="mini" type="primary" :loading="true">运行中</el-button>
            <div v-else>
              <el-button v-if="isError(scope.row.task.status)" size="mini" type="warning">错误</el-button>
              <el-button v-else size="mini" icon="el-icon-document">新建</el-button>
            </div>
          </div>
          <div v-else>
            <el-button v-if="isError(scope.row.task.status)" size="mini" type="warning">错误</el-button>
            <el-button v-else size="mini" type="success" icon="el-icon-check">已完成</el-button>
          </div>
          </template>
      </el-table-column>

      <el-table-column
        label="结果信息"
        min-width="90">
        <template slot-scope="scope">
          {{scope.row.detail.info}}
        </template>
      </el-table-column>

      <el-table-column
        label="结果json"
        :show-overflow-tooltip="true"
        min-width="160">
        <template slot-scope="scope">
          {{scope.row.detail.detail | getAttrValue}}
        </template>
      </el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import api from '@/api'

export default {
  name: 'robot-view',
  components: {
  },
  data () {
    return {
      timer: undefined,
      client_id: 0,
      table: [],
      loading: false,
      info: {},
      tasks: [],
      clientData: {},
      hasClientData: false,
      indexMap: {
        true: '已完成',
        false: '未完成'
      }
    }
  },
  mounted () {
    this.handleSubmit(this.client_id)
    this.timer = setInterval(() => { this.handleSubmit(this.client_id) }, 2000)
  },
  created () {
    this.client_id = parseInt(this.$route.params.client_id)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  filters: {
    getAttrValue (value) {
      if (value && typeof value === 'object') {
        return JSON.stringify(value)
      }

      return value
    },
    getStatusValue (value) {
      var statusMap = {
        0: '新建',
        1: '运行',
        2: '失败',
        4: '完成',
        8: '等待子任务'
      }
      if ((value & 8) === 8) {
        return '等待子任务'
      }
      var val = value & 7
      return statusMap[val]
    }
  },
  methods: {
    // 提交查询请求
    handleSubmit (clientId) {
      this.loading = true
      // TODO: api
      api.ROBOT_DETAIL({ id: clientId })
        .then(res => {
          const data = res
          if (data) {
            this.info = data
            this.tasks = data.tasks
            if (!this.hasClientData) {
              this.queryDeviceInfo(this.info.client_id)
            }
          }
        })
    },
    queryDeviceInfo (clientId) {
      this.loading = true
      // TODO: api
      api.ROBOT_INFO({ client_id: clientId })
        .then(res => {
          const data = res
          console.log(data, this.client_id)
          if (data && (data.id === this.client_id)) {
            this.clientData = data.info
            this.hasClientData = true
            console.log(data.info)
          }
        })
    },
    tableRowClassName ({ row, rowIndex }) {
      var val = row.task.status
      if (val <= 1) {
        return ''
      }
      if ((row.task.status & 7) === 2) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    isError (value) {
      var val = value & 7
      if (val === 2) {
        return true
      }
      return false
    },
    isRunning (value) {
      if ((value & 8) === 8) {
        return true
      }
      return (value & 7) === 1
    }
  }
}
</script>

<style lang="scss" scoped>

.cs-card {
  color: $color-text-main;
  border: 1px solid $color-border-1;
  background: #FFF;
  font-size: 14px;
  position: relative;
  margin-bottom: 20px;
  padding: 20px;
}

</style>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
