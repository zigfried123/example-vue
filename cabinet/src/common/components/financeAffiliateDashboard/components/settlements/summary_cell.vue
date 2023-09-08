<template>
    <div class="md-layout md-gutter md-alignment-center-right">

        <md-icon v-if="amount < 0 && changeIcon" class="md-accent">arrow_drop_down</md-icon>
        <md-icon v-if="amount > 0 && changeIcon" class="md-success">arrow_drop_up</md-icon>
        <div>
            {{ formatter.format(amount) }}
            <br>
            {{ count}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "summary_cell",
        props: {
            amount: {
                type: Number,
                default: 0.00
            },
            count: {
                type: Number,
                default: null
            },
            changeIcon: {
                type: Boolean,
                default: false
            },
            formatter: {
                type: Intl.NumberFormat
            }
        },
    }
</script>

<style scoped>

</style>