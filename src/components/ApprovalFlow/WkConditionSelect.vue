<template>
  <el-dialog
    :visible="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    title="Tiêu chí lựa chọn"
    width="600px"
    custom-class="no-padding-dialog"
    @close="handleCancel">
    <div style="padding: 20px;">
      <div>Vui lòng chọn trường điều kiện để phân biệt quá trình phê duyệt</div>
      <div style="margin-top: 10px;">
        <el-checkbox
          v-for="(item, index) in list"
          :key="index"
          v-model="item.checked"
          :label="item.name"/>
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click.native="handleCancel">Hủy</el-button>
      <el-button
        v-debounce="handleConfirm"
        type="primary">Lưu</el-button>
    </span>
  </el-dialog>

</template>
<script>
import { getSendObj } from './conditioModel'
import { objDeepCopy } from '@/utils'

export default {
  name: 'WkConditionSelect',
  components: {
  },
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    checks: Array,
    props: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
  },
  watch: {
    visible(val) {
      if (val) {
        this.getList()
      }
    }
  },
  methods: {
    /**
     * 提交按钮
     */
    handleConfirm() {
      this.$emit('confirm', this.list.filter(item => item.checked))
      this.handleCancel()
    },

    /**
     * 获取数据
     */
    getList() {
      const { conditionSelectRequest, conditionSelectParams, conditionSelectList } = this.props
      if (conditionSelectList) {
        this.handleList(objDeepCopy(conditionSelectList))
      } else {
        conditionSelectRequest(conditionSelectParams).then(res => {
          const list = res.data || []
          this.handleList(list)
        }).catch(() => {

        })
      }
    },

    /**
     * 处理list
     */
    handleList(list) {
      const fieldNames = []
      let sendItem = null
      if (this.checks) {
        this.checks.forEach(item => {
          if (item.fieldName) {
            fieldNames.push(item.fieldName)
          } else if (item.conditionType === 8) {
            sendItem = item
          }
        })
      }
      const changIndexs = []
      list.forEach((item, index) => {
        if (fieldNames.includes(item.fieldName)) {
          changIndexs.push(index)
          this.$set(item, 'checked', true)
        } else {
          this.$set(item, 'checked', false)
        }
      })

      changIndexs.forEach(index => {
        const item = list[index]
        const checkItem = this.checks.find(checkItem => checkItem.fieldName === item.fieldName)
        this.$set(checkItem, 'checked', true)
        list.splice(index, 1, checkItem)
      })
      if (sendItem) {
        this.$set(sendItem, 'checked', true)
        list.splice(0, 0, sendItem)
        this.list = list
      } else {
        list.splice(0, 0, objDeepCopy(getSendObj(false)))
        this.list = list
      }
    },

    /**
     * 取消选择
     */
    handleCancel() {
      this.$emit('update:visible', false)
    }

  }
}
</script>

<style scoped lang="scss">
</style>

