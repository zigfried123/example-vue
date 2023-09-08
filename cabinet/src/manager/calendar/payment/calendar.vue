<template>
    <div>
        <breadcrumbs :breadcrumbs="[
                {url: '/', title: 'Главная'},
                {title: 'Платежный календарь'},
            ]"/>
        <md-card>
            <div class="header-table" >
                <h1 class="md-title">Платежный календарь</h1>
                <div class="legend">Верхняя строка - все запросы за период</div>
                <div class="legend">Нижний уровень - все запросы за период + задолжность</div>
                <md-button class="md-raised md-primary button-download"
                           href="/financeAccounting/calendar/payment/download"
                           target="_blank">
                    Скачать
                </md-button>
            </div>

            <md-table v-if="rows">
                <div class="calendar-grid">
                    <md-table-row>
                        <md-table-head></md-table-head>
                        <md-table-head :colspan="rows[0].before.data.length" class="table-title table-title--minus">
                            <md-icon>alarm</md-icon>
                            Просрочено
                        </md-table-head>
                        <md-table-head class="table-title table-title--today">
                            <md-icon>today</md-icon>
                            Сегодня
                        </md-table-head>
                        <md-table-head :colspan="rows[0].after.data.length + 1" class="table-title table-title--plus">
                            <md-icon>timelapse</md-icon>
                            Запланировано
                        </md-table-head>
                    </md-table-row>

                    <md-table-row>
                        <md-table-head class="cell-interval headcol-side-bar">
                            Тип платежа
                        </md-table-head>


                        <md-table-head class="cell-interval cell-interval--minus"
                                       v-for="(item, index) in rows[0].before.data" :key="'hb' + index">
                            <div>{{item.name}}</div>
                            <div class="pt-15">на {{item.date_end}}</div>
                        </md-table-head>

                        <md-table-head class="cell-interval cell-interval--today">
                            <div>{{rows[0].today.data.name}}</div>
                            <div class="pt-15">на {{rows[0].today.data.date_end}}</div>
                        </md-table-head>

                        <md-table-head class="cell-interval cell-interval--plus"
                                       v-if="index !== rows[0].after.data.length - 1"
                                       v-for="(item, index) in rows[0].after.data" :key="'ha' + index">
                            <div>{{item.name}}</div>
                            <div class="pt-15">на {{item.date_end}}</div>
                        </md-table-head>

                        <md-table-head class="cell-interval cell-interval--plus">
                        </md-table-head>

                        <md-table-head class="cell-interval cell-interval--plus headcol">
                            <div>{{rows[0].after.data[rows[0].after.data.length - 1].name}}</div>
                            <div class="pt-15">на {{rows[0].after.data[rows[0].after.data.length - 1].date_end}}</div>
                        </md-table-head>

                    </md-table-row>

                    <md-table-row v-for="(row, indexRow) in rows" :key="'row' + indexRow" v-if="!isEmptyRow(row)">
                        <md-table-cell class="payment-name headcol-side-bar headcol-side-bar--type">
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
                            <cell :cell="cell"/>
                        </md-table-cell>

                        <md-table-cell class="cell-value cell-value--plus">
                        </md-table-cell>

                        <md-table-cell class="cell-value cell-value--plus headcol headcol--val">
                            <cell :cell="row.after.data[row.after.data.length - 1]"/>
                        </md-table-cell>

                    </md-table-row>

                    <md-table-row>
                        <md-table-head class="cell-interval headcol-side-bar">
                            Тип платежа
                        </md-table-head>


                        <md-table-head class="cell-interval cell-interval--minus"
                                       v-for="(item, index) in rows[0].before.data" :key="'hb' + index">
                            <div>{{item.name}}</div>
                            <div class="pt-15">на {{item.date_end}}</div>
                        </md-table-head>

                        <md-table-head class="cell-interval cell-interval--today">
                            <div>{{rows[0].today.data.name}}</div>
                            <div class="pt-15">на {{rows[0].today.data.date_end}}</div>
                        </md-table-head>

                        <md-table-head class="cell-interval cell-interval--plus"
                                       v-if="index !== rows[0].after.data.length - 1"
                                       v-for="(item, index) in rows[0].after.data" :key="'ha' + index">
                            <div>{{item.name}}</div>
                            <div class="pt-15">на {{item.date_end}}</div>
                        </md-table-head>

                        <md-table-head class="cell-interval cell-interval--plus">
                        </md-table-head>

                        <md-table-head class="cell-interval cell-interval--plus headcol last">
                            <div>{{rows[0].after.data[rows[0].after.data.length - 1].name}}</div>
                            <div class="pt-15">на {{rows[0].after.data[rows[0].after.data.length - 1].date_end}}</div>
                        </md-table-head>

                    </md-table-row>
                </div>
            </md-table>
            <md-progress-bar md-mode="indeterminate" v-else></md-progress-bar>
        </md-card>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import cell from './cell.vue';
    import breadcrumbs from '../../../common/components/breadcrumbs/breadcrumbs.vue';

    export default {
        name: 'paymentCalendar',
        components: {
            cell: cell,
            breadcrumbs: breadcrumbs,
        },
        computed: {
            ...mapState([
                'rows',
            ]),
        },
        created: function () {
            this.appendCalendar();
        },
        methods: {
            ...mapActions({
                appendCalendar: 'APPEND_CALENDAR',
            }),
            isEmptyRow(row) {
                for(let index in row.before.data) {
                    if (!this.isEmptyCell(row.before.data[index])) {
                        return false;
                    }
                }

                if (!this.isEmptyCell(row.today.data)) {
                    return false;
                }

                for(let index in row.after.data) {
                    if (!this.isEmptyCell(row.after.data[index])) {
                        return false;
                    }
                }

                return true;
            },
            isEmptyCell(cell) {
                return parseFloat(cell.value_on_period) === 0 &&
                    parseFloat(cell.value_on_period_plus_before) === 0;
            }
        }
    }
</script>
