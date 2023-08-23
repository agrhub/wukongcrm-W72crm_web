/** 系统管理路由 */
import Layout from '@/views/layout/AdminLayout'

const layout = function(meta = {}, path = '/manage', requiresAuth = true) {
  return {
    path: path,
    component: Layout,
    meta: {
      requiresAuth: requiresAuth,
      ...meta
    }
  }
}

export default [
  {
    ...layout({
      permissions: ['manage', 'system', 'read']
    }),
    children: [{
      name: 'systemconfig',
      path: 'systemconfig', // 企业首页
      component: () => import('@/views/admin/config'),
      meta: {
        title: 'Danh nghiệp',
        icon: 'enterprise'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage']
    }),
    children: [{
      path: 'update', // 升级
      component: () => import('@/views/admin/update'),
      meta: {
        title: 'Cập nhật trực tuyến',
        icon: 'data-import'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'configSet', 'read']
    }),
    children: [{
      name: 'application',
      path: 'application', // 应用管理
      component: () => import('@/views/admin/application'),
      meta: {
        title: 'Ứng dụng',
        icon: 'all'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'users', 'read']
    }),
    children: [{
      name: 'employee-dep',
      path: 'employee-dep', // 员工与部门管理
      component: () => import('@/views/admin/employeeDep'),
      meta: {
        title: 'Phòng ban & Nhân sự',
        icon: 's-seas'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'permission'],
      title: 'Quyền người dùng',
      icon: 'user'
    }, '/manage/role-auth'),
    alwaysShow: true,
    name: 'manage-role-auth',
    children: [{
      name: 'role-auth',
      path: 'role-auth/:pid/:title',
      hidden: true,
      component: () => import('@/views/admin/roleAuth/index'),
      meta: {}
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'examineFlow']
    }),
    children: [{
      name: 'system-examine',
      path: 'system-examine', // 业务审批流
      component: () => import('@/views/admin/examine'),
      meta: {
        title: 'Quy trình kinh doanh',
        icon: 'approve'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'oa']
    }),
    children: [{
      name: 'system-workbench',
      path: 'system-workbench', // 办公审批流
      component: () => import('@/views/admin/oa'),
      meta: {
        title: 'Quy trình nghiệp vụ',
        icon: 'approve'
      }
    }, {
      name: 'workbenchHandlefield',
      path: 'workbench-custom-field/:type/:id/:label',
      component: () => import('@/views/admin/crm/HandleField'),
      hidden: true,
      meta: {
        activeMenu: '/manage/system-workbench'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'work']
    }),
    children: [{
      name: 'system-project',
      path: 'system-project', // 项目管理
      component: () => import('@/views/admin/project'),
      meta: {
        title: 'Dự án',
        icon: 'project'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'crm'],
      title: 'Cài đặt kinh doanh',
      icon: 'customer'
    }, '/manage/customer'),
    alwaysShow: true,
    children: [{
      path: 'custom-field',
      component: () => import('@/views/admin/crm/customField'),
      meta: {
        title: 'Cài đặt trường thông tin',
        requiresAuth: true,
        permissions: ['manage', 'crm', 'field']
      }
    }, {
      path: 'customer',
      component: () => import('@/views/admin/crm/customer'),
      meta: {
        title: 'Phân loại khách hàng',
        requiresAuth: true,
        permissions: ['manage', 'crm', 'pool']
      }
    }, {
      path: 'print-templates',
      component: () => import('@/views/admin/crm/printTemplates'),
      meta: {
        title: 'Mẫu hóa đơn',
        requiresAuth: true,
        permissions: ['manage', 'crm', 'print']
      }
    }, {
      path: 'print-detail',
      name: 'crmPrintDetail',
      component: () => import('@/views/admin/crm/printTemplates/PrintTemplateDetail'),
      hidden: true,
      meta: {
        activeMenu: '/manage/customer/print-templates',
        title: 'Mẫu hóa đơn',
        requiresAuth: true,
        permissions: ['manage', 'crm', 'print']
      }
    }, {
      path: 'biz-param',
      component: () => import('@/views/admin/crm/bizParam'),
      meta: {
        title: 'Thông số kinh doanh',
        requiresAuth: true,
        permissions: ['manage', 'crm', 'setting']
      }
    }, {
      name: 'crmBizGoals',
      path: 'biz-goals',
      component: () => import('@/views/admin/crm/bizGoals'),
      meta: {
        title: 'Mục tiêu kinh doanh KPI',
        requiresAuth: true,
        permissions: ['manage', 'crm', 'achievement']
      }
    }, {
      name: 'handlefield',
      path: 'custom-field/:type/:id/:label',
      component: () => import('@/views/admin/crm/HandleField'),
      hidden: true,
      meta: {
        activeMenu: '/manage/customer/custom-field',
        requiresAuth: true,
        permissionList: [['manage', 'crm', 'field'], ['manage', 'crm', 'activityForm']]
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'adminLog'],
      title: 'Nhật ký hệ thống',
      icon: 'record'
    }, '/manage/log/'),
    alwaysShow: true,
    children: [{
      path: 'handle',
      component: () => import('@/views/admin/log/DataHandleLog'),
      meta: {
        title: 'Nhật ký dữ liệu',
        requiresAuth: true,
        permissions: ['manage', 'adminLog', 'actionRecord']
      }
    }, {
      path: 'sys',
      component: () => import('@/views/admin/log/SysHandleLog'),
      meta: {
        title: 'Nhật ký vận hành',
        requiresAuth: true,
        permissions: ['manage', 'adminLog', 'systemLog']
      }
    }, {
      path: 'login',
      component: () => import('@/views/admin/log/LoginLog'),
      meta: {
        title: 'Nhật ký đăng nhập',
        requiresAuth: true,
        permissions: ['manage', 'adminLog', 'loginLog']
      }
    }]
  },
  {
    ...layout({}, '/manage', false),
    children: [{
      name: 'system-other',
      path: 'system-other', // 其他配置
      component: () => import('@/views/admin/other'),
      meta: {
        title: 'Cài đặt khác',
        icon: 'manage'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'init', 'initData']
    }, '/manage', false),
    children: [{
      path: 'init', // 初始化数据
      component: () => import('@/views/admin/init/Set'),
      meta: {
        title: 'Khởi tạo dữ liệu',
        icon: 'results-solid'
      }
    }]
  }
]
