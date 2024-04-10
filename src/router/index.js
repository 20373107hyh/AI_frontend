import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const teacherRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/image',
    name: '管理',
    meta: { title: '管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'image',
        name: 'Image',
        component: () => import('@/views/table/index'),
        meta: { title: '镜像管理', icon: 'table' }
      },
      {
        path: 'course',
        name: 'Course',
        component: () => import('@/views/table/course'),
        meta: { title: '课程管理', icon: 'table' }
      },
      {
        path: 'course_detail',
        name: 'Course_detail',
        component: () => import('@/views/table/course_detail')
      },
    ]
  },
  {
    path: '/experiment',
    name: 'Experiment',
    component: () => import('@/views/table/experiment')
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'course_add',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '课程添加', icon: 'form' }
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]


export const studentRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/experiment_list',
    component: Layout,
    redirect: '/experiment_list/experiment_list',
    name: '实验列表',
    meta: { title: '实验列表', icon: 'form' },
    children: [
      {
        path: 'experiment_list',
        name: 'Form',
        component: () => import('@/views/student/experiment_list'),
        meta: { title: '实验列表', icon: 'form' }
      },
      {
        path: 'experiment_detail',
        name: 'Form',
        component: () => import('@/views/student/experiment_detail'),
      }
    ]
  },
  

  {
    path: '/experiment',
    name: 'Experiment',
    component: () => import('@/views/table/experiment')
  },



  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]


const getRoutesByUserType = (router) => {
  const usertype = localStorage.getItem('status')
  console.log(usertype)
  if (usertype === 'teacher') {
    return teacherRoutes
  }
  else {
    return studentRoutes
  }
}


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: getRoutesByUserType()
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
