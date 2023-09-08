import Vue from 'vue'
import Multiselect from 'vue-multiselect'
import Grid from '../../../src/common/components/grid/grid.vue'
import {store} from '../../../src/common/components/grid/store/store.js'

var _ = require('lodash');

Vue.component('multiselect', Multiselect);

if ($('#grid-component').length) {
    window.gridComponent = new Vue({
        el: '#grid-component',
        store,
        render: h => h(Grid)
    }).$children[0];
}

