/**
 * Created by W-Q on 2017/9/21.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// 导入vuex其他组件
import actions from './actions'
import mutations from './mutations'

export default new Vuex.Store({
    actions,
    modules : {
        mutations
    }
})