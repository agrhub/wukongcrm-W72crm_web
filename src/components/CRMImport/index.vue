<template>
  <el-dialog
    :visible="show"
    :title="'Nhập dữ liệu '+crmTypeName"
    :append-to-body="true"
    :close-on-click-modal="false"
    width="750px"
    @close="closeView">
    <div class="dialog-body">
      <el-steps
        :active="stepsActive"
        simple>
        <el-step
          v-for="(item, index) in stepList"
          :key="index"
          :title="item.title"
          :icon="item.icon"
          :status="item.status" />
      </el-steps>

      <div v-if="stepsActive == 1" class="step-section">
        <div class="sections">
          <div class="sections__title">1. Hãy chuẩn bị dữ liệu cần nhập theo định dạng của mẫu dữ liệu.<span
            class="download"
            @click="download">Tải về 《{{ crmTypeName }} tập tin mẫu》</span></div>
          <div class="sections__tips">Tập tin nhập không được vượt quá 2MB (khoảng 10.000 dòng dữ liệu)</div>
        </div>
        <div v-if="config.repeatHandleShow" class="sections">
          <div class="sections__title">2. Vui lòng chọn phương pháp xử lý khi dữ liệu bị lặp lại {{ config.repeatRuleShow ? `（Quy tắc kiểm tra trùng lặp： 【${ fieldUniqueInfo }】）` : '' }}</div>
          <div v-if="config.repeatRuleShow" class="sections__tips">Quy tắc kiểm tra trùng lặp là: Thêm {{ crmTypeName }} tất cả các trường duy nhất cần được điền vào，trường duy nhất hiện được đặt là：{{ fieldUniqueInfo }}</div>
          <div class="content">
            <el-select
              v-model="repeatHandling"
              placeholder="Xin vui lòng chọn">
              <el-option
                v-for="(item, index) in [{name: 'Ghi đè dữ liệu gốc của hệ thống',value: 1},{name: 'Bỏ qua',value: 2}]"
                :key="index"
                :label="item.name"
                :value="item.value"/>
            </el-select>
          </div>
        </div>
        <div class="sections">
          <div class="sections__title">{{ config.repeatHandleShow ? '3' : '2' }}、Vui lòng chọn tập tin để nhập</div>
          <div class="content">
            <flexbox class="file-select">
              <el-input
                v-model="file.name"
                :disabled="true"/>
              <el-button
                type="primary"
                @click="selectFile">Chọn file</el-button>
            </flexbox>
          </div>
        </div>
        <div v-if="config.ownerSelectShow" class="sections">
          <div class="sections__title">4. Vui lòng chọn người phụ trách (người phụ trách là trường bắt buộc, nếu không điền thì quá trình nhập sẽ không thành công)</div>
          <div class="content">
            <div class="user-cell">
              <xh-user-cell
                :value="user"
                @value-change="userSelect"/>
            </div>
          </div>
        </div>

        <div v-if="config.poolSelectShow" class="sections">
          <div class="sections__title">4. Hãy chọn nơi chứa dữ liệu</div>
          <div class="content">
            <div class="user-cell">
              <el-select v-model="poolId" placeholder="Vui lòng chọn">
                <el-option
                  v-for="item in poolList"
                  :key="item.poolId"
                  :label="item.poolName"
                  :value="item.poolId"/>
              </el-select>
            </div>
          </div>
        </div>
      </div>

      <div
        v-loading="loading"
        v-else-if="stepsActive == 2"
        :element-loading-text="importLoadingText"
        element-loading-spinner="el-icon-loading"
        class="step-section">
        <div class="step-section__tips">Dữ liệu hiện tại đang được nhập, bạn có thể nhấp vào [Thu nhỏ] để ẩn trang này và việc nhập dữ liệu sẽ không bị ảnh hưởng.</div>
      </div>

      <div
        v-loading="loading"
        v-else-if="stepsActive == 3"
        class="step-section">
        <div class="result-info">
          <i class="wk wk-success result-info__icon" />
          <p class="result-info__des">Nhập dữ liệu hoàn tất</p>
          <p v-if="resultData" class="result-info__detail">Tổng dữ liệu đã nhập<span class="result-info__detail--all">{{ resultData.totalSize }}</span> dòng，<template v-if="resultData.updateSize">Tổng<span class="result-info__detail--suc">{{ resultData.updateSize }}</span> dòng，</template>Thành công<span class="result-info__detail--suc">{{ resultData.totalSize - resultData.errSize }}</span> dòng，Lỗi<span class="result-info__detail--err">{{ resultData.errSize }}</span>dòng</p>
          <el-button
            v-if="resultData && resultData.errSize > 0"
            class="result-info__btn--err"
            type="text"
            @click="downloadErrData">Tải về dữ liệu lỗi</el-button>
        </div>
      </div>

      <input
        id="importInputFile"
        type="file"
        @change="uploadFile">
    </div>
    <span
      slot="footer"
      class="dialog-footer">
      <el-popover
        v-model="historyPopoverShow"
        placement="top"
        width="800"
        popper-class="no-padding-popover"
        trigger="click">
        <c-r-m-import-history
          :show="historyPopoverShow"
          :crm-type="crmType"
          :props="props"
          @close="historyPopoverShow = false" />
        <el-button
          slot="reference"
          class="history-btn"
          type="text">Xem lịch sử nhập dữ liệu</el-button>
      </el-popover>



      <el-button
        :class="{ 'is-hidden': !showCancel }"
        @click="closeView">Đóng</el-button>
      <el-button
        v-if="sureTitle"
        type="primary"
        @click="sureClick">{{ sureTitle }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  crmQueryImportNumAPI,
  crmQueryImportInfoAPI,
  crmDownImportErrorAPI,
  filedGetFieldAPI
} from '@/api/crm/common'
import {
  crmCustomerExcelImportAPI,
  crmCustomerDownloadExcelAPI,
  crmCustomerPoolNameListAPI,
  crmCustomerPoolExcelImportAPI
} from '@/api/crm/customer'
import {
  crmLeadsExcelImportAPI,
  crmLeadsDownloadExcelAPI
} from '@/api/crm/leads'
import {
  crmContactsExcelImportAPI,
  crmContactsDownloadExcelAPI
} from '@/api/crm/contacts'
import {
  crmProductExcelImportAPI,
  crmProductDownloadExcelAPI
} from '@/api/crm/product'

import { XhUserCell } from '@/components/CreateCom'
import CRMImportHistory from './CRMImportHistory'

import { mapGetters } from 'vuex'
import crmTypeModel from '@/views/crm/model/crmTypeModel'
import { downloadExcelWithResData, verifyFileTypeWithFileName } from '@/utils'
import Lockr from 'lockr'
import merge from '@/utils/merge'

const DefaultProps = {
  typeName: '', // 模块名称
  ownerSelectShow: true,
  poolSelectShow: false,
  repeatHandleShow: true,
  repeatRuleShow: true, // 步骤二的重复规则是否展示
  importRequest: null, // 导入请求
  templateRequest: null // 模板请求
}

export default {
  name: 'CRMImport', // 文件导入
  components: {
    XhUserCell,
    CRMImportHistory
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    // CRM类型
    crmType: {
      type: String,
      default: ''
    },
    props: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是有缓存的信息展示的页面 是否完成状态
    cacheShow: {
      type: Boolean,
      default: false
    },
    cacheDone: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      fieldList: [],
      repeatHandling: 1, // 	1 覆盖，2跳过
      file: { name: '' },
      user: [],

      // 公海数据
      poolId: '',
      poolList: [],

      stepsActive: 1,
      stepList: [
        {
          icon: 'wk wk-upload',
          title: 'Tải lên',
          status: 'wait'
        },
        {
          icon: 'wk wk-data-import',
          title: 'Nhập dữ liệu',
          status: 'wait'
        },
        {
          icon: 'wk wk-success',
          title: 'Nhập xong',
          status: 'wait'
        }
      ],
      resultData: null,
      processData: {
        count: 0,
        status: ''
      },
      messageId: null,
      intervalTimer: null,

      historyPopoverShow: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),

    crmTypeName() {
      if (this.props && this.props.typeName) {
        return this.props.typeName
      }

      return (
        {
          customer: 'Khách hàng chính thức',
          leads: 'Khách hàng tiềm năng',
          contacts: 'Thông tin liên hệ',
          product: 'Sản phẩm'
        }[this.crmType] || ''
      )
    },

    importLoadingText() {
      if (this.processData.count) {
        return `Đã nhập dữ liệu （đã nhập ${this.processData.count} dòng）`
      }

      return 'Đang nhập'
    },

    sureTitle() {
      return {
        1: 'Nhập ngay bây giờ',
        2: 'Thu nhỏ',
        3: 'Hoàn tất'
      }[this.stepsActive]
    },

    showCancel() {
      return this.stepsActive != 2
    },

    fieldUniqueInfo() {
      const uniqueList = this.fieldList.filter(item => item.isUnique == 1)

      return uniqueList.map(item => item.name).join('/') || '0'
    },

    config() {
      return merge({ ...DefaultProps }, this.props || {})
    }
  },
  watch: {
    cacheShow: {
      handler(val) {
        // 展示缓存
        if (val) {
          this.$emit('update:cacheShow', false)
          const beforeImportInfo = Lockr.get('crmImportInfo')
          if (beforeImportInfo && beforeImportInfo.messageId) {
            this.loading = true
            this.messageId = beforeImportInfo.messageId
            this.stepList[0].status = 'finish'

            if (this.cacheDone) {
              this.stepList[1].status = 'finish'
              this.stepsActive = 3
              this.thirdQueryResult()
            } else {
              this.stepsActive = 2
              this.stepList[1].status = 'process'
            }

            this.loopSecondQueryNum()
          }
        }
      },
      immediate: true
    },

    show: function(val) {
      if (val) {
        // 阶段一展示 需要获取的信息
        if (this.stepsActive == 1) {
          if (this.userInfo) {
            this.user = [this.userInfo]
          }

          if (this.config.poolSelectShow) {
            this.getPoolList()
          }

          if (this.config.repeatRuleShow && this.config.repeatHandleShow) {
            this.getField()
          }
        }
      } else {
        if (this.stepsActive == 3) {
          this.resetData()
        }

        this.fieldList = []
      }
    },

    stepsActive() {
      this.$emit('status', {
        1: 'wait',
        2: 'process',
        3: 'finish'
      }[this.stepsActive])
    }

    // file() {
    //   this.getFirstStepStatus()
    // },

    // user() {
    //   this.getFirstStepStatus()
    // }

  },
  created() {},
  methods: {
    sureClick() {
      if (this.stepsActive == 1) {
        if (this.stepList[0].status == 'finish') {
          this.stepList[1].status = 'process'
          this.stepsActive = 2
          this.firstUpdateFile(res => {
            this.messageId = res.data

            // 写入本次缓存
            Lockr.set('crmImportInfo', {
              messageId: this.messageId,
              crmProps: this.config,
              crmType: this.crmType
            })

            this.loopSecondQueryNum()
          })
        } else {
          if (!this.file.name) {
            this.$message.error('Vui lòng chọn tệp nhập')
          } else if (
            this.config.ownerSelectShow &&
            (!this.user || this.user.length == 0)
          ) {
            this.$message.error('Vui lòng chọn người phụ trách')
          }
        }
      } else {
        this.closeView()
      }
    },


    /**
     * 第一步上传
     */
    firstUpdateFile(result) {
      const params = {}
      params.repeatHandling = this.repeatHandling
      params.file = this.file
      params.ownerUserId = this.user.length > 0 ? this.user[0].userId : ''
      if (this.config.poolSelectShow) {
        params.poolId = this.poolId
      }

      const request = this.config.importRequest || {
        customer: this.config.poolSelectShow ? crmCustomerPoolExcelImportAPI : crmCustomerExcelImportAPI,
        leads: crmLeadsExcelImportAPI,
        contacts: crmContactsExcelImportAPI,
        product: crmProductExcelImportAPI
      }[this.crmType]
      this.loading = true
      request(params)
        .then(res => {
          if (result) {
            result(res)
          }
        })
        .catch(() => {
          if (result) {
            result(false)
          }
          this.loading = false
        })
    },

    /**
     * 第二步查询数量
     */
    loopSecondQueryNum() {
      this.secondQueryNum()
      this.intervalTimer = setInterval(() => {
        if (this.processData.status == 'end') {
          clearInterval(this.intervalTimer)
          this.intervalTimer = null
          this.thirdQueryResult()
        } else {
          this.secondQueryNum()
        }
      }, 2000)
    },

    secondQueryNum() {
      crmQueryImportNumAPI({ messageId: this.messageId })
        .then(res => {
          if (res.data === null) {
            this.processData.status = 'end'
          } else {
            this.processData.status = ''
            this.processData.count = res.data
          }
        })
        .catch(() => {
          // this.processData.status = 'err'
        })
    },

    /**
     * 第三部 查询结果
     */
    thirdQueryResult() {
      crmQueryImportInfoAPI({ messageId: this.messageId })
        .then(res => {
          this.loading = false
          this.stepList[1].status = 'finish'
          this.stepsActive = 3
          this.$emit('status', 'finish')
          if (res) {
            this.resultData = res.data
            if (res.data.errSize > 0) {
              this.stepList[2].status = 'error'
            } else {
              this.stepList[2].status = 'finish'
            }
          }
        })
        .catch(() => {})
    },

    /**
     * 下载错误模板
     */
    downloadErrData() {
      this.loading = true
      crmDownImportErrorAPI({ messageId: this.messageId })
        .then(res => {
          downloadExcelWithResData(res)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    // 下载模板操作
    download() {
      const request = this.config.templateRequest || {
        customer: crmCustomerDownloadExcelAPI,
        leads: crmLeadsDownloadExcelAPI,
        contacts: crmContactsDownloadExcelAPI,
        product: crmProductDownloadExcelAPI
      }[this.crmType]
      request()
        .then(res => {
          downloadExcelWithResData(res)
        })
        .catch(() => {})
    },
    // 选择文件
    selectFile() {
      document.getElementById('importInputFile').click()
    },
    /** 图片选择出发 */
    uploadFile(event) {
      var files = event.target.files
      const file = files[0]
      if (verifyFileTypeWithFileName(file.name)) {
        this.file = file
        // 阶段一状态
        this.getFirstStepStatus()
      }
      event.target.value = ''
    },
    // 用户选择
    userSelect(data) {
      if (data.value && data.value.length > 0) {
        this.user = data.value
      } else {
        this.user = []
      }

      // 阶段一状态
      this.getFirstStepStatus()
    },

    getFirstStepStatus() {
      // 阶段一状态
      const hasFile = this.file && this.file.size
      const hasUser = this.user && this.user.length > 0

      if (this.config.ownerSelectShow) {
        this.stepList[0].status = hasFile && hasUser ? 'finish' : 'wait'
      } else {
        this.stepList[0].status = hasFile ? 'finish' : 'wait'
      }
    },

    /**
     * 公海数据
     */
    getPoolList() {
      crmCustomerPoolNameListAPI()
        .then(res => {
          this.poolList = res.data || []
          this.poolId = this.poolList.length > 0 ? this.poolList[0].poolId : ''
        })
        .catch(() => {
        })
    },

    // 关闭操作
    closeView() {
      this.$emit('update:show', false)
      if (this.stepsActive == 3) {
        this.$bus.emit('import-crm-done-bus', this.crmType)
        Lockr.rm('crmImportInfo')
      }
      this.$emit('close', this.stepsActive == 3 ? 'finish' : '')
    },

    /**
     * 重置页面数据
     */
    resetData() {
      this.repeatHandling = 1
      this.file = { name: '' }
      this.user = []

      this.stepsActive = 1
      this.stepList = [
        {
          icon: 'wk wk-upload',
          title: 'Tải lên',
          status: 'wait'
        },
        {
          icon: 'wk wk-data-import',
          title: 'Nhập dữ liệu',
          status: 'wait'
        },
        {
          icon: 'wk wk-success',
          title: 'Đã nhập xong',
          status: 'wait'
        }
      ]
      this.resultData = null
      this.processData = {
        count: 0,
        status: ''
      }
      this.messageId = null
    },

    /**
     * 获取验证字段
     */
    getField() {
      var params = {
        label: crmTypeModel[this.crmType]
      }

      filedGetFieldAPI(params)
        .then(res => {
          this.fieldList = res.data
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style scoped lang="scss">
.el-steps {
  margin-bottom: 15px;

  /deep/ .el-step__title {
    font-size: 14px;
  }

  /deep/ .el-step.is-simple .el-step__arrow::before,
  /deep/ .el-step.is-simple .el-step__arrow::after {
    height: 10px;
    width: 2px;
  }

  /deep/ .el-step.is-simple .el-step__arrow::after {
    transform: rotate(45deg) translateY(3px);
  }
  /deep/ .el-step.is-simple .el-step__arrow::before {
    transform: rotate(-45deg) translateY(-2px);
  }
}

.step-section {
  min-height: 300px;
  position: relative;

  /deep/ .el-loading-spinner {
    top: 45%;
    .el-icon-loading {
      font-size: 40px;
      color: #999;
    }

    .el-loading-text {
      color: #333;
      margin: 8px 0;
    }
  }

  &__tips {
    color: #999;
    font-size: 12px;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: center;
    z-index: 3000;
  }
}

.sections {
  font-size: 14px;
  color: #333;

  &__title {
    font-weight: 600;
  }

  &__tips {
    padding-left: 30px;
    margin: 8px 0 15px;
    color: #999;
    font-size: 12px;
    line-height: 1.4;
  }

  .download {
    cursor: pointer;
    color: #2362FB;
  }

}

.sections__tips + .content {
  padding-top: 0;
}

.content {
  padding: 10px 10px 10px 30px;
  .el-select {
    width: 400px;
  }
  .user-cell {
    width: 400px;
  }
}

#importInputFile {
  display: none;
}

.file-select {
  .el-input {
    width: 400px;
  }
  button {
    margin-left: 20px;
  }
}

.is-hidden {
  visibility: hidden;
}

.history-btn {
  float: left;
  margin-left: 15px;
}


// 结果信息
.result-info {
  text-align: center;
  padding-top: 80px;

  &__icon {
    font-size: 40px;
    color: $xr-color-primary;
  }

  &__des {
    margin-top: 15px;
    color: #333;
    font-size: 14px;
  }

  &__detail {
    margin-top: 15px;
    font-size: 12px;
    color: #666;
    &--all {
      color: #333;
      font-weight: 600;
    }

    &--suc {
      color: $xr-color-primary;
      font-weight: 600;
    }

    &--err {
      color: #f94e4e;
      font-weight: 600;
    }
  }

  &__btn--err {
    margin-top: 10px;
  }
}
</style>
