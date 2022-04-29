import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }
/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: { ...meta },
        component: _import('system/index')
      },
      {
        path: 'robot/dashboard',
        name: 'robot-dashboard',
        meta: { ...meta, cache: true, title: '任务自动化' },
        component: _import('robot/index')
      },
      {
        path: 'robot/detail/:client_id',
        name: 'robot-detail',
        meta: { ...meta, cache: true, title: '客户端详情' },
        component: _import('robot/detail/index')
      },
      {
        path: 'page2',
        name: 'page2',
        meta: { ...meta, title: '页面 2' },
        component: _import('demo/page2')
      },
      // 演示页面
      {
        path: 'page1',
        name: 'page1',
        meta: { ...meta, title: '页面 1' },
        component: _import('demo/page1')
      },
      {
        path: 'page2',
        name: 'page2',
        meta: { ...meta, title: '页面 2' },
        component: _import('demo/page2')
      },
      {
        path: 'page3',
        name: 'page3',
        meta: { ...meta, title: '页面 3' },
        component: _import('demo/page3')
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: { ...meta, title: '前端日志' },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
