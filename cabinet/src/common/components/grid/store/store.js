import Vue from 'vue'
import  Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
        fields: {},
        gridData: [],
    },
    getters:{
        getFields: state => state.fields,

        getData: state => state.gridData
    },
    mutations:{
        putField: (state, info) => {
            Vue.set(state.fields, info.fieldName, info.fieldObject)
        },

        setFieldState: (state, info) => {
            Vue.set(state.fields, info.fieldName, info.state)
        },

        removeDataRow: (state, id) => state.gridData.splice(id, 1),

        clearData: (state) => state.gridData.splice(0),

        addRow: (state, row) => state.gridData.push(row)

    }
})