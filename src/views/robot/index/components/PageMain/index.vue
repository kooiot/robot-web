<template>
  <div class="d2-p-0">
    <el-row :gutter="20">
      <el-col :span="14">
        <div class="cs-card">
          <i class="el-icon-collection-tag d2-pb">
            <span class="d2-pl-5">服务器状态</span>
            <span class="d2-pl-5 cs-card-sub ">更新日期：{{updateTime}}</span>
          </i>

          <i class="el-icon-refresh cs-card-sub d2-fr link">
            <span class="d2-pl-5" @click="handleRefresh">刷新</span>
          </i>

          <div flex="cross:center main:center">
            <div
              v-for="(item, key) in serverStatus"
              :key="key"
              flex-box="1">
              <div class="cs-order d2-tc link" @click="handleOpen('order-admin-list')">
                <cs-count-up class="cs-order__number" :end="item"/>
                <span class="cs-order__desc">{{serverMap[key]}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="cs-card">
          <el-table
            :data="onlineClients"
            :header-cell-style="{padding: '8px 0'}"
            class="table-card">
            <el-table-column
              prop="id"
              label="ID"
              width="120">
            </el-table-column>

            <el-table-column
              label="Client ID"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  @click="handleView(scope.row.id)"
                  class="goods-link">{{scope.row.info.client_id}}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="online"
              label="登入时间"
              width="200">
            </el-table-column>

            <el-table-column
              prop="count"
              label="状态"
              width="100">
            </el-table-column>
          </el-table>
        </div>

        <div class="cs-card">
          <i class="el-icon-collection-tag d2-pb">
            <span class="d2-pl-5">今日测试量</span>
          </i>

          <ve-line
            :data="runToday"
            :colors="colors"
            :settings="{labelMap: {success: '成功量合计', fail: '失败量合计'}}"
            :data-empty="!runToday.rows.length"/>
        </div>

<!--
        <div class="cs-card">
          <i class="el-icon-collection-tag d2-pb">
            <span class="d2-pl-5">今日活跃会员</span>
          </i>

          <ve-line
            :data="clientActive"
            :colors="colors"
            :settings="{labelMap: {count: '活跃数合计'}}"
            :data-empty="!clientActive.rows.length"/>
        </div> -->

        <el-table
          :data="errorTop"
          :header-cell-style="{padding: '8px 0'}"
          class="table-card">
          <el-table-column
            type="index"
            label="排行"
            width="56">
          </el-table-column>

          <el-table-column
            label="名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                @click="handleView(scope.row.name)"
                class="goods-link">{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="count"
            label="数量"
            align="center"
            width="100">
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="10">
        <div class="cs-card">
          <i class="el-icon-collection-tag d2-pb">
            <span class="d2-pl-5">快捷入口</span>
          </i>

          <div flex="cross:center main:center" style="overflow: hidden;">
            <el-button
              v-for="(item, key) in linkData"
              :key="key"
              flex-box="1"
              size="mini"
              :plain="true"
              @click="$open(item.url)">{{item.name}}</el-button>
          </div>

          <div class="kooiot d2-tc d2-pt-10">
            <span>KooIoT 版权所有</span>
          </div>
        </div>

        <div class="cs-card">
          <i class="el-icon-collection-tag d2-pb">
            <span class="d2-pl-5">结果统计</span>
          </i>

          <table class="cs-sales">
            <tbody>
            <tr><td rowspan="3" class="cs-sales__title">今日测试量</td></tr>
            <tr>
              <td>
                <span>成功数量</span>
                <cs-count-up
                  class="cs-sales__number"
                  :end="testStatus.today.success"/>
              </td>
            </tr>
            <tr>
              <td>
                <span>失败数量</span>
                <cs-count-up
                  class="cs-sales__number"
                  :end="testStatus.today.fail"
                  :decimals="0"/>
              </td>
            </tr>

            <tr style="height: 20px;"></tr>

            <tr><td rowspan="3" class="cs-sales__title">总测试量</td></tr>
            <tr>
              <td>
                <span>成功数量</span>
                <cs-count-up
                  class="cs-sales__number"
                  :end="testStatus.total.success"/>
              </td>
            </tr>
            <tr>
              <td>
                <span>失败数量</span>
                <cs-count-up
                  class="cs-sales__number"
                  :end="testStatus.total.fail"
                  :decimals="0"/>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="cs-card">
          <i class="el-icon-collection-tag d2-pb">
            <span class="d2-pl-5">错误统计</span>
          </i>
          <ve-pie
            :data="errorStats"
            :data-empty="!errorStats.rows.length"
            :colors="colors"/>
        </div>

      <!--
        <div class="cs-card">
          <i class="el-icon-collection-tag d2-pb">
            <span class="d2-pl-5">会员等级</span>
          </i>

          <ve-ring
            :data="clientLevel"
            :data-empty="!clientLevel.rows.length"
            :colors="colors"/>
        </div> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '@/api'
import colors from '@/plugin/d2admin/charts'
import 'v-charts/lib/style.css'

export default {
  components: {
    VeLine: () => import('v-charts/lib/line.common'),
    VePie: () => import('v-charts/lib/pie.common')
    // VeRing: () => import('v-charts/lib/ring.common')
  },
  data () {
    return {
      timer: null,
      colors,
      updateTime: '',
      runToday: {
        columns: ['hour', 'success', 'fail'],
        rows: []
      },
      clientActive: {
        columns: ['hour', 'count'],
        rows: []
      },
      errorStats: {
        columns: ['name', 'count'],
        rows: []
      },
      clientLevel: {
        columns: ['name', 'count'],
        rows: []
      },
      onlineClients: [],
      errorTop: [],
      testStatus: {
        today: {},
        total: {}
      },
      serverMap: {
        online: '在线',
        running: '运行中',
        total: '总数',
        success: '成功',
        failed: '失败'
      },
      serverStatus: {},
      linkData: [
        { name: '官方主页', url: 'www.kooiot.cn' },
        { name: '开发文档', url: 'doc.kooiot.cn' }
      ]
    }
  },
  mounted () {
    this.handleSubmit()
    // this.timer = setInterval(() => { this.handleSubmit() }, 2000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    handleSubmit () {
      api.ROBOT_STATS({ type: 'index' })
        .then(res => {
          const data = res
          if (data) {
            this.updateTime = data.update_time
            this.runToday.rows = data.run_today ? data.run_today : []
            this.clientActive.rows = data.client_active ? data.client_active : []
            this.errorStats.rows = data.error_stats ? data.error_stats : []
            this.clientLevel.rows = data.client_level ? data.client_level : []
            this.errorTop = data.error_top ? data.error_top.slice(0, 6) : []
            this.onlineClients = data.clients ? data.clients : []
            this.testStatus = data.test_status
            this.serverStatus = data.server_status
          }
        })
    },
    handleOpen (name) {
      this.$router.push({ name })
    },
    handleView (clientId) {
      this.$router.push({
        name: 'robot-detail',
        params: { client_id: clientId }
      })
    },
    handleRefresh () {
      this.$router.push({ name: 'refresh' })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-card {
  border: 1px solid $color-border-1;
  border-bottom: none;

  ::v-deep td {
    padding: 10px;
  }
}

.link:hover {
  cursor: pointer;
  color: $color-primary !important;
}

.goods-link:hover {
  cursor: pointer;
  color: $color-primary;
  text-decoration: underline;
}

.cs-card {
  color: $color-text-main;
  border: 1px solid $color-border-1;
  background: #FFF;
  font-size: 14px;
  position: relative;
  margin-bottom: 20px;
  padding: 20px;
}

.cs-card-sub {
  font-size: 12px;
  color: $color-info;
}

.cs-today {
  display: inline-flex;

  .cs-today__icon i {
    font-size: 40px;
    color: $color-info;
  }

  .cs-today__info {
    line-height: 24px;

    .cs-today__number {
      display: block;
      font-size: 24px;
    }

    .cs-today__desc {
      color: $color-info;
    }
  }
}

.cs-order {
  span {
    display: block;
  }

  .cs-order__number {
    font-size: 24px;
  }

  .cs-order__desc {
    color: $color-info;
  }
}

.cs-sales {
  color: $color-info;
  border-collapse: collapse;
  border: none;
  width: 100%;

  tr td {
    padding: 14px 0;
    border: solid $color-border-1 1px;
  }

  span {
    padding-left: 10px;
  }

  .cs-sales__title {
    text-align: center;
    background: #F5F7FA;
    width: 30%;
  }

  .cs-sales__number {
    color: $color-text-main;
    font-size: 18px;
  }
}

.kooiot {
  font-size: 13px;
  color: $color-primary;
  line-height: 19px;
  margin-bottom: -10px;
}
</style>
