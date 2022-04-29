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
        width="90">
        <template slot-scope="scope">
          {{indexMap[scope.row.detail.result]}}
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
      client_id: 0,
      table: [],
      loading: false,
      info: {},
      tasks: [],
      clientData: null,
      indexMap: {
        true: '成功',
        false: '失败'
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
  filters: {
    getAttrValue (value) {
      if (value && typeof value === 'object') {
        return JSON.stringify(value)
      }

      return value
    },
    getStatusValue (value) {
      var statusMap = {
        0: 'New',
        1: 'Run',
        2: 'Failed',
        4: 'Done',
        8: 'Spawn'
      }
      if ((value & 8) === 8) {
        return 'Spawned'
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
            if (this.clientData == null) {
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
            console.log(data.info)
          }
        })
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
