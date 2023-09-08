import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {isDuplicateRow, updateRenderData} from '../helpers/RenderData';

Vue.use(Vuex);

const state = {
    id: null,
    operation_id: null,
    processing: false,
    rawData: [],
    renderData: [],
    urlRender: '',
    gridInstanceName: '',
    createdDate: new Date().toLocaleDateString('ru-RU'),
    accountingDate: new Date().toLocaleDateString('ru-RU'),
    comment: '',
};

const getters = {
    ID: state => {
        return state.id;
    },
    OPERATION_ID: state => {
        return state.operation_id;
    },
    GET_PROCESSING: state => {
        return state.processing;
    },
    RAW_DATA: state => {
        return state.rawData;
    },
    RENDER_DATA: state => {
        return state.renderData;
    },
    GRID_INSTANCE_NAME: state => {
        return state.gridInstanceName;
    },
    CREATED_DATE: state => {
        return state.createdDate;
    },
    ACCOUNTING_DATE: state => {
        return state.accountingDate;
    },
    COMMENT: state => {
        return state.comment;
    },
};
const mutations = {
    SET_ID: (state, id) => {
        state.id = id;
    },
    SET_OPERATION_ID: (state, operation_id) => {
        state.operation_id = operation_id;
    },
    PUT_RAW_DATA: (state, rawData) => {
        state.rawData.push(...rawData);
    },
    CLEAR_RAW_DATA: (state) => {
        state.rawData = [];
    },
    PUT_RENDER_DATA_ITEM: (state, renderData) => {
        state.renderData.push(renderData);
    },
    CLEAR_RENDER_DATA: (state) => {
        state.renderData = [];
    },
    REMOVE_ITEM_RENDER_DATA: (state, index) => {
        state.renderData.splice(index, 1);
    },
    REMOVE_ITEM_RAW_DATA: (state, index) => {
        state.rawData.splice(index, 1);
    },
    CHANGE_ITEM_RAW_DATA: (state, row) => {
        Vue.set(state.rawData, row.index, row.item)
    },
    CHANGE_RENDER_DATA_ITEM: (state, row) => {
        Vue.set(state.renderData, row.index, row.item)
    },
    SET_URL_RENDER: (state, urlRender) => {
        state.urlRender = urlRender;
    },
    SET_GRID_INSTANCE_NAME: (state, gridInstanceName) => {
        state.gridInstanceName = gridInstanceName;
    },
    SET_CREATED_DATE: (state, createdDate) => {
        state.createdDate = createdDate;
    },
    SET_ACCOUNTING_DATE: (state, accountingDate) => {
        state.accountingDate = accountingDate;
    },
    SET_COMMENT: (state, comment) => {
        state.comment = comment;
    },
    SET_PROCESSING: (state, flag) => {
        state.processing = flag;
    },
};

const actions = {
    CLEAR_RAW_DATA: (context) => {
        context.commit('CLEAR_RAW_DATA');
        context.commit('CLEAR_RENDER_DATA');
    },
    REMOVE_ITEM_RAW_DATA: (context, index) => {
        context.commit('REMOVE_ITEM_RAW_DATA', index);
        context.commit('REMOVE_ITEM_RENDER_DATA', index);
    },
    CHANGE_ITEM_RAW_DATA: (context, row) => {
        context.commit('CHANGE_ITEM_RAW_DATA', row);

        updateRenderData(state.urlRender, row.item, state.gridInstanceName)
            .then((dataRenderItem) => {
                context.commit('CHANGE_RENDER_DATA_ITEM', {index: row.index, item: dataRenderItem} );
            });
    },
    PUT_RAW_DATA: async (context, rawData) => {
        for (let index in rawData) {
            context.commit('SET_PROCESSING', true);
            let rawDataItem = Object.assign({}, rawData[index]);

            if (isDuplicateRow(context.getters.RAW_DATA, rawDataItem, 'item')) {
                continue;
            }

            await updateRenderData(state.urlRender, rawDataItem, state.gridInstanceName)
                .then((dataRenderItem) => {
                    context.commit('PUT_RAW_DATA', [rawDataItem]);
                    context.commit('PUT_RENDER_DATA_ITEM', dataRenderItem);
                });
        }
        context.commit('SET_PROCESSING', false);

    },
};

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
