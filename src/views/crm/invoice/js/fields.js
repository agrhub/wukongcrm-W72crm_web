export const invoiceHeaderFields = [{
  label: '发票申请编号',
  width: '120px',
  prop: 'invoiceApplyNumber'
}, {
  label: '客户名称',
  width: '120px',
  prop: 'customerName'
}, {
  label: '合同编号',
  width: '120px',
  prop: 'contractNum'
}, {
  label: '合同金额',
  width: '90px',
  prop: 'contractMoney'
}, {
  label: '开票金额（元）',
  width: '120px',
  prop: 'invoiceMoney'
}, {
  label: '开票日期',
  width: '120px',
  prop: 'invoiceDate'
}, {
  label: '实际开票日期',
  width: '120px',
  prop: 'realInvoiceDate'
}, {
  label: '开票类型',
  width: '120px',
  prop: 'invoiceType'
}, {
  label: '发票号码',
  width: '90px',
  prop: 'invoiceNumber'
}, {
  label: '物流单号',
  width: '90px',
  prop: 'logisticsNumber'
}, {
  label: '负责人',
  width: '90px',
  prop: 'ownerUserName'
}, {
  label: '审核状态',
  width: '90px',
  prop: 'checkStatus'
}]

// 筛选字段
export const invoiceFilterFields = [{
  formType: 'text',
  fieldName: 'invoiceNumber',
  name: '发票号码'
}, {
  formType: 'date',
  fieldName: 'realInvoiceDate',
  name: '实际开票日期'
}, {
  formType: 'text',
  fieldName: 'customerName',
  name: '客户名称'
}, {
  formType: 'text',
  fieldName: 'logisticsNumber',
  name: '物流单号'
}, {
  formType: 'checkStatus',
  fieldName: 'invoiceStatus',
  name: '开票状态',
  setting: [{
    name: '未开票',
    value: 0
  }, {
    name: '已开票',
    value: 1
  }]
}, {
  formType: 'checkStatus',
  fieldName: 'checkStatus',
  name: '审核状态',
  setting: [
    {
      name: '待审核',
      value: 0
    }, {
      name: '通过',
      value: 1
    }, {
      name: '拒绝',
      value: 2
    }, {
      name: '审核中',
      value: 3
    }, {
      name: '撤回',
      value: 4
    }
  ]
}, {
  formType: 'user',
  fieldName: 'ownerUserId',
  name: '负责人'
}]
