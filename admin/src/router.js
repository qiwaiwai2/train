import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path:'/user',
      // component:{render:h => h("router-view")},
      component: () => import(/* webpackChunkName: "layout" */ './layouts/UserLayout.vue'),
      children: [
        {
          path:"/user",
          redirect:'/user/login'
        },
        {
          path: "/user/login",
          name: "login",
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/User/Login")
        },
        {
          path: "/user/register",
          name: "register",
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/User/Register")
        },
        
      ]
    },
    {
      path:'/',
      redirect:'/home',
      component: () => import(/* webpackChunkName: "layout" */ "./layouts/BasicLayout"),
      meta:['赛事管理'],
      children:[
        {
          path:'/home',//首页
          component: () => import(/* webpackChunkName: "home" */ "./views/Home/home"),
          meta:['首页'],
        },
        {
          path:'/game',//赛事
          component: () => import(/* webpackChunkName: "game" */ "./views/Game/Game"),
          meta:['赛事管理'],
        },
        {//赛事设置
          path:'/game/gameSet',
          component: () => import(/* webpackChunkName: "game" */ "./views/Game/gameSet/gameSet"),
          meta:[],
          redirect:'/game/gameSet/gameItem',
          children:[
            {
              path:'/game/gameSet/gameItem',//赛项
              component: () => import(/* webpackChunkName: "game" */ "./views/Game/gameSet/gameItem/gameItem"),
              meta:[]
            },
            {
              path:'/game/gameSet/group',//组别
              component: () => import(/* webpackChunkName: "game" */ "./views/Game/gameSet/group/group"),
              meta:[]
            },
            {
              path:'/game/gameSet/bind',//绑定
              component: () => import(/* webpackChunkName: "game" */ "./views/Game/gameSet/bind/bind"),
              meta:[]
            },
            {
              path:'/game/gameSet/collocation',//配置
              component: () => import(/* webpackChunkName: "game" */ "./views/Game/gameSet/collocation/collocation"),
              meta:[]
            },
          ]
        },
        {
          path:'/drawLoats',//抽签
          component: () => import(/* webpackChunkName: "drawLoats" */ "./views/drawLoats/drawLoats"),
          meta:['抽签']
        },
        // {
        //   path:'/equipDistribute',//设备分配
        //   component: () => import(/* webpackChunkName: "equipDistribute" */ "./views/equipDistribute/equipDistribute"),
        //   meta:['设备分配']
        // },
        {
          path:'/equipDistribute',//设备分配
          component: () => import(/* webpackChunkName: "equipDistribute" */ "./views/equipDistribute/equipDistribute"),
          redirect:'/equipDistribute/equipManage',
          meta:['设备分配'],
          children:[
            {
              path:'/equipDistribute/equipManage',
              component: () => import(/* webpackChunkName: "equipDistribute" */ "./views/equipDistribute/equipManage/equipManage"),
              meta:['设备分配'],
            },
            {
              path:'/equipDistribute/gps',
              component: () => import(/* webpackChunkName: "equipDistribute" */ "./views/equipDistribute/gps/gps"),
              meta:['GPS分配'],
            }
          ]
        },
        {
          path:'/bib',//路线信息
          component: () => import(/* webpackChunkName: "bib" */ "./views/bib/bib"),
          meta:['号码布分配']
        },
        {
          path:'/routeInfo',//路线信息
          component: () => import(/* webpackChunkName: "routeInfo" */ "./views/routeInfo/routeInfo"),
          meta:['路线信息']
        },
        {
          path:'/defend',//设备维护
          component: () => import(/* webpackChunkName: "defend" */ "./views/defend/defend"),
          meta:['设备维护'],
          // redirect:'/defend/fingerCard',
          // children:[
          //   {
          //     path:'/defend/gps',
          //     component: () => import(/* webpackChunkName: "defend" */ "./views/defend/gps/gps"),
          //     meta:['设备维护']
          //   },
          //   {
          //     path:'/defend/fingerCard',
          //     component: () => import(/* webpackChunkName: "defend" */ "./views/defend/fingerCard/fingerCard"),
          //     meta:['设备维护']
          //   }
          // ]
        },
        {
          path:'/nationality',//单位信息
          component: () => import(/* webpackChunkName: "nationality" */ "./views/nationality/nationality"),
          meta:['单位信息']
        },
        {
          path:'/mapmanage',//地图管理
          component: () => import(/* webpackChunkName: "mapmanage" */ "./views/MapManage/MapManage"),
          meta:['地图管理']
        },
      ]
    }
  ]
})

router.beforeEach((to,from,next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router