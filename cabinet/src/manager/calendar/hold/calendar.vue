<template>
    <div>
        <md-card>
            <md-table-toolbar class="header-table">
                <h2 class="md-title">Календарь HOLD</h2>
                <div class="legend">Верхняя строка - инфо по холду</div>
                <div class="legend">Нижний уровень - доступно к выплате</div>
            </md-table-toolbar>

            <md-table v-if="row">
                <md-table-row>
                    <md-table-head></md-table-head>
                    <md-table-head :colspan="row.before.data.length" class="table-title table-title--minus">
                        <md-icon>alarm</md-icon>
                        Просрочено
                    </md-table-head>
                    <md-table-head class="table-title table-title--today">
                        <md-icon>today</md-icon>
                        Сегодня
                    </md-table-head>
                    <md-table-head :colspan="row.after.data.length" class="table-title table-title--plus">
                        <md-icon>timelapse</md-icon>
                        Запланировано
                    </md-table-head>
                </md-table-row>

                <md-table-row>
                    <md-table-head class="cell-interval">
                    </md-table-head>
                    <md-table-head class="cell-interval cell-interval--minus"
                                   v-for="(item, index) in row.before.data" :key="'hb' + index">
                        <div>{{item.name}}</div>
                        <div class="pt-15">на {{item.date_end}}</div>
                    </md-table-head>

                    <md-table-head class="cell-interval cell-interval--today">
                        <div>{{row.today.data.name}}</div>
                        <div class="pt-15">на {{row.today.data.date_end}}</div>
                    </md-table-head>
                    
                    <md-table-head class="cell-interval cell-interval--plus"
                                   v-if="index !== row.after.data.length - 1"
                                   v-for="(item, index) in row.after.data" :key="'ha' + index">
                        <div>{{item.name}}</div>
                        <div class="pt-15">на {{item.date_end}}</div>
                    </md-table-head>


                    <md-table-head class="cell-interval cell-interval--plus">
                    </md-table-head>

                    <md-table-head class="cell-interval cell-interval--plus headcol">
                        <div>{{row.after.data[row.after.data.length - 1].name}}</div>
                        <div class="pt-15">на {{row.after.data[row.after.data.length - 1].date_end}}</div>
                    </md-table-head>

                </md-table-row>

                <md-table-row>
                    <md-table-cell class="payment-name">
                        {{ row.name }}
                    </md-table-cell>

                    <md-table-cell class="cell-value cell-value--minus"
                                   v-for="(cell, indexCell) in row.before.data" :key="'cell-b' + indexCell">
                        <cell :cell="cell"/>
                    </md-table-cell>

                    <md-table-cell class="cell-value cell-value--today">
                        <cell :cell="row.today.data"/>
                    </md-table-cell>

                    <md-table-cell class="cell-value cell-value--plus"
                                   v-if="indexCell !== row.after.data.length - 1"
                                   v-for="(cell, indexCell) in row.after.data" :key="'cell-a' + indexCell">
                        <cell :cell="cell"></cell>
                    </md-table-cell>


                    <md-table-cell class="cell-value cell-value--plus">
                    </md-table-cell>

                    <md-table-cell class="cell-value cell-value--plus headcol">
                        <cell :cell="row.after.data[row.after.data.length - 1]"/>
                    </md-table-cell>

                </md-table-row>

            </md-table>
            <md-progress-bar md-mode="indeterminate" v-else></md-progress-bar>
        </md-card>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import {currencyFormat} from './../helpers/format';
    import cell from './cellHold.vue'

    export default {
        name: 'holdCalendar',
        components: {
            cell: cell,
        },
        computed: {
            ...mapState([
                'row',
            ]),
        },
        created: function () {
            this.appendCalendar();
        },
        methods: {
            ...mapActions({
                appendCalendar: 'APPEND_CALENDAR',
            }),
        }
    }
</script>
