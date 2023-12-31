// 审批流状态 和 阶段审核状态
export default {
  methods: {
    // /**
    //  * 合同回款的审核状态
    //  * @param {*} status
    //  */
    // getCRMStatusColor(status) {
    //   if (status == 0) {
    //     return '#ffc539'
    //   } else if (status == 1) {
    //     return '#398dff'
    //   } else if (status == 2) {
    //     return '#20b559'
    //   } else if (status == 3) {
    //     return '#f95a5a'
    //   } else if (status == 4) {
    //     return '#dee8ff'
    //   } else if (status == 5) {
    //     return '#d9d9d9'
    //   }
    // },

    // /**
    //  * 合同回款的审核状态
    //  * @param {*} status
    //  */
    // getCRMStatusName(status) {
    //   if (status == 0) {
    //     return '待审核'
    //   } else if (status == 1) {
    //     return '审核中'
    //   } else if (status == 2) {
    //     return '通过'
    //   } else if (status == 3) {
    //     return '拒绝'
    //   } else if (status == 4) {
    //     return '撤回'
    //   } else if (status == 5) {
    //     return '未提交'
    //   }
    //   return ''
    // },

    /**
     * 审核颜色
     * @param {*} status
     */
    getStatusColor(status) {
      if (status == 0) {
        return '#ffc539'
      } else if (status == 1) {
        return '#20b559'
      } else if (status == 2) {
        return '#f95a5a'
      } else if (status == 3) {
        return '#398dff'
      } else if (status == 4) {
        return '#999'
      } else if (status == 5) {
        return '#d9d9d9'
      } else if (status == 6) {
        return '#2362FB'
      } else if (status == 8) {
        return '#bfbfbf'
      }
    },

    /**
     * 审核名称
     * @param {*} status
     */
    getStatusName(status) {
      if (status == 0) {
        return 'Đang chờ duyệt'
      } else if (status == 1) {
        return 'Đã duyệt'
      } else if (status == 2) {
        return 'Từ chối'
      } else if (status == 3) {
        return 'Đang xem xét'
      } else if (status == 4) {
        return 'Trả về'
      } else if (status == 5) {
        return 'Chưa gửi'
      } else if (status == 6) {
        return 'Tạo mới'
      } else if (status == 8) {
        return 'Bị xóa'
      }
      return ''
    },

    /**
     * 审核图标
     */
    getStatusIcon(status) {
      if (status == 0) {
        return 'wk wk-time'
      } else if (status == 1) {
        return 'wk wk-success'
      } else if (status == 2) {
        return 'wk wk-close'
      } else if (status == 3) {
        return 'wk wk-time'
      } else if (status == 4) {
        return 'wk wk-reset'
      } else if (status == 5) {
        return 'wk wk-time'
      } else if (status == 6) {
        return 'wk wk-l-plus'
      } else if (status == 8) {
        return 'wk wk-invalid'
      }
      return ''
    },

    /**
     * 审核图标
     */
    getXhStatusList() {
      return [
        {
          label: 'Đang chờ xử lý',
          value: 0
        }, {
          label: 'Đã duyệt',
          value: 1
        }, {
          label: 'Từ chối',
          value: 2
        }, {
          label: 'Đang xem xét',
          value: 3
        }, {
          label: 'Trả về',
          value: 4
        }
      ]
    },

    /**
     * 图片标示
     */
    getStatusImageIcon(status) {
      if (status == 0 || status == 3 || status == 5) {
        return require('@/assets/img/check_wait.png')
      } else if (status == 1) {
        return require('@/assets/img/check_suc.png')
      } else if (status == 2) {
        return require('@/assets/img/check_fail.png')
      } else if (status == 4) {
        return require('@/assets/img/check_revoke.png')
      } else if (status == 6) {
        return require('@/assets/img/check_create.png')
      }
      return ''
    }
  }
}
