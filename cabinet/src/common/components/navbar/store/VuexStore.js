import Vue from 'vue'
import axios from 'axios'
import vuex from 'vuex'
Vue.use(vuex, axios);

export default new vuex.Store({
    state: {
        ParamsAffiliate: '',
    },
    mutations:{
        setParams(state, payload){
            state.ParamsAffiliate = payload;
        }
    },
    actions: {
        async getParams({commit}){
            let response = await axios.get('/information/userbar/account');
            if (response.status === 200) {
                commit('setParams', response.data);
            }
        }
    }
});
