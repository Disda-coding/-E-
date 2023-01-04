//不是vue组件，因此不能直接用this.调用

import {getRequest} from "@/utils/api";


// 菜单请求工具类
// router.$addRoutes = (params) => {
//     router.matcher = new Router({ mode: 'history' }).matcher
//     router.addRoutes(params)
// }
// router 路由； store Vuex
// 添加了async和await使得不会出现异步操作带来的取不到state.routes的情况，造成重复添加routes, 还是会有其他新bug
async function refreshMenu(router, store) {
    await getRequest('/system/cfg/menu').then(resp => {
        // 如果数据存在 格式化路由
        if (resp.data) {
            // 格式化好路由
            let fmtRoutes = formatRoutes(resp.data)
            // 添加到 router
            router.addRoutes(fmtRoutes)
            // 将数据存入 Vuex
            store.commit('initRoutes', fmtRoutes)
            // 连接 WebSocket
            store.dispatch('connect')
        }
    })
}


export const initMenu = async (router, store) => {
    //如果有数据，不做操作
    //有bug就是store取不到routes，异步执行有关系
    //  let times = await new Promise((resolve, reject)=>{
    //      resolve(store.state.routes.length)
    //  })
    // alert(times)
    if (store.state.routes.length > 0) {
        return;
    }
   refreshMenu(router, store)

}

export const formatRoutes = (routes) => {
    let fmtRoutes = []
    routes.forEach(router => {
        // 赋值属性给router
        let {
            path,
            component,
            name,
            iconCls,
            children
        } = router;
        // 如果有 children 并且类型是数组
        if (children && children instanceof Array) {
            // 递归
            children = formatRoutes(children)
        }
        // 单独对某一个路由格式化 component
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            component(resolve) {
                // 判断组件以什么开头，到对应的目录去找
                // 把字符串转为组件
                if (component.startsWith('Home')) {
                    require(['@/views/' + component + '.vue'], resolve);
                } else if (component.startsWith('Emp')) {
                    require(['@/views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith('Per')) {
                    require(['@/views/per/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sal')) {
                    require(['@/views/sal/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sta')) {
                    require(['@/views/sta/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sys')) {
                    require(['@/views/sys/' + component + '.vue'], resolve);
                }
            }
        }
        fmtRoutes.push(fmRouter)
    })
    return fmtRoutes
}
