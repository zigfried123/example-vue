import Vue from 'vue'
import Vuex from 'vuex'
import {isDuplicateRow, updateRenderData} from '../helpers/RenderData';
import TaxNdsCalculator from '../helpers/TaxNdsCalculator';

Vue.use(Vuex);

const state = {
    id: null,
    operation_id: null,
    processing: false,
    rawData: [],
    renderData: [],
    urlRender: '',
    gridInstanceName: '',
    nds: 'no_nds',
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
    NDS: state => {
        return state.nds;
    },
    SUM_TOTAL_AMOUNT: state => {
        let total = 0;

        state.rawData.forEach(item => {
            total += parseFloat(item.totalAmount);
        });

        return total.toFixed(2);
    },
    SUM_TOTAL_NDS: state => {
        let total = 0;

        state.rawData.forEach(item => {
            total += parseFloat(item.nds);
        });

        return total.toFixed(2);
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
    SET_NDS: (state, nds) => {
        state.nds = nds;
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
    CHANGE_NDS: (context, nds) => {
        context.commit('SET_NDS', nds);

        for (let i = 0; i < context.getters.RAW_DATA.length; i++) {
            context.dispatch('CHANGE_ITEM_RAW_DATA', {item: context.getters.RAW_DATA[i], index: i});
        }
    },
    CHANGE_ITEM_RAW_DATA: (context, row) => {
        row.item = recalcRow(row.item, context.getters.NDS);
        context.commit('CHANGE_ITEM_RAW_DATA', row);

        updateRenderData(state.urlRender, row.item, state.gridInstanceName)
            .then((dataRenderItem) => {
                context.commit('CHANGE_RENDER_DATA_ITEM', {index: row.index, item: dataRenderItem} );
            });
    },
    PUT_RAW_DATA: async (context, rawData) => {
        for (let index in rawData) {
            context.commit('SET_PROCESSING', true);
            let rawDataItem = recalcRow(rawData[index], context.getters.NDS);

            if (isDuplicateRow(context.getters.RAW_DATA, rawDataItem, 'item')) {
                continue;
            }

            context.commit('PUT_RAW_DATA', [rawDataItem]);

            await updateRenderData(state.urlRender, rawDataItem, state.gridInstanceName)
                .then((dataRenderItem) => {
                    context.commit('PUT_RENDER_DATA_ITEM', dataRenderItem);
                });
        }
        context.commit('SET_PROCESSING', false);
    },
};


function recalcRow(row, nds) {
    let taxNdsCalculator = new TaxNdsCalculator();
    return {
        item: row.item,
        advertiser_id: row.advertiser_id,
        description: row.description,
        amountBase: parseFloat(row.amountBase).toFixed(2),
        ndsBase:  taxNdsCalculator.calcNds(nds, row.amountBase),
        amount: parseFloat(row.amount).toFixed(2),
        nds: taxNdsCalculator.calcNds(nds, row.amount),
        totalAmount: (parseFloat(row.amount) + parseFloat(taxNdsCalculator.calcNds(nds, row.amount))).toFixed(2),
    }
}

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
