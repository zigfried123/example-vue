<template>
    <div>
        <div v-if="!isZeroOnPeriod">
            <a :href="url" target="_blank" class="link-payout">
                {{ valueOnPeriod }}
            </a>
        </div>
        <div v-if="!isZeroOnPeriod">
            {{ totalValueOnPeriodPlusBefore }}
        </div>
    </div>
</template>

<script>
    import {currencyFormat} from '../helpers/format';

    export default {
        name: 'cell',
        props: {
            cell: Object
        },
        computed: {
            isZeroOnPeriod() {
                return parseFloat(this.cell.value_on_period) === 0;
            },
            url() {
                let filters = [];

                this.cell.ids_requests.forEach(id => filters.push('request_ids[]=' + id));
                filters.push('dateRange=' + this.startDate + '-' + this.endDate);

                return '/financeAccounting/affiliate/payoutRequests/list?' + filters.join('&');
            },
            valueOnPeriod() {
                return currencyFormat(this.cell.value_on_period);
            },
            valueOnPeriodPlusBefore() {
                return currencyFormat(this.cell.value_on_period_plus_before);
            },
            totalValueOnPeriodPlusBefore() {
                return currencyFormat(this.cell.total_value_on_period_plus_before);
            },
            startDate() {
                let dateEnd = new Date();
                dateEnd.setDate(dateEnd.getDate() - 200);

                return this.formatDate(dateEnd);
            },
            endDate() {
                let dateStart = new Date();

                return this.formatDate(dateStart);
            },
        },
        methods: {
            formatDate(date) {
                let day = date.getDate();
                if (day < 10) {
                    day = '0' + day;
                }

                let month = date.getMonth() + 1;
                if (month < 10) {
                    month = '0' + month;
                }

                return day + '.' + month + '.' + date.getFullYear();
            }
        }
    }
</script>
