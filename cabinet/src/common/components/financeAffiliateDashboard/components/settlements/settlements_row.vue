<template>
    <md-table-row v-if="item" class="md-pointer">
        <md-table-cell
                md-label=""
        >

            <div class="md-layout md-gutter">
                <div
                        class="md-layout-item"
                        v-bind:class="[getOffsetClass()]"
                >
                    <md-avatar class="md-avatar-icon md-small md-primary" v-if="level === 0">
                        <md-icon>{{ icon }}</md-icon>
                    </md-avatar>
                </div>
                <div class="md-layout-item" v-bind:class="{'md-body-2' : level === 0}">
                    {{ item.title }}
                </div>
            </div>

        </md-table-cell>
        <md-table-cell
                md-label="До"
                md-numeric
        >
            <summary_cell
                    :amount="item.before"
                    :count="!showCount ? null : item.beforeCount"
                    :formatter="formatter"
            ></summary_cell>
        </md-table-cell>

        <md-table-cell
                md-numeric
                md-label="Изменение"
        >
            <summary_cell
                    :amount="item.change"
                    :count="!showCount ? null : item.changeCount"
                    :changeIcon="true"
                    :formatter="formatter"
            ></summary_cell>
        </md-table-cell>
        <md-table-cell
                md-label="После"
                md-numeric
        >
            <summary_cell
                    :amount="item.after"
                    :count="!showCount ? null : item.afterCount"
                    :formatter="formatter"
            ></summary_cell>
        </md-table-cell>
    </md-table-row>
</template>

<script>
    import Summary_cell from "./summary_cell.vue";

    export default {
        components: {Summary_cell},
        data() {
            return {
                details: []
            }
        },
        props: {
            item: {
                type: Object
            },
            icon: {
                type: String
            },
            level: {
                type: Number,
                default: 0
            },
            showCount: {
                type: Boolean,
                default: false
            },
            formatter: {
                type: Intl.NumberFormat
            }
        },
        methods: {
            getOffsetClass() {
                return 'md-size-' + (5 + 15 * (this.level)).toString();
            }
        },
        name: "settlements_row",
    }
</script>

<style scoped>

</style>