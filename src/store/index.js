import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        routes: []
    },
    mutations: { // 与 state 同步执行；可以改变 state 对应的值的方法
        // 初始化路由 菜单
        initRoutes(state, data) {
            state.routes = data
        }
    }
})


// // 导入 Vuex
// const store = new Vuex.Store({
//     state: {
//         routes: [],
//     },
//     mutations: { // 与 state 同步执行；可以改变 state 对应的值的方法
//         // 初始化路由 菜单
//         initRoutes(state, data) {
//             state.routes = data
//         }
//     }
// })
//
//
// export default store;
