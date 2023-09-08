<template>
    <div>
        <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <span>
                    Дата создания документа
                </span>
                <md-field>
                    <md-icon>event</md-icon>
                    <md-input v-model="createdDate" disabled></md-input>
                </md-field>
            </div>

            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <span>Дата(учет)</span>
                <datepicker :modelDate.sync="internalAccountingDate" :disabled="isViewMode"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Datepicker from './Datepicker.vue';

    export default {
        name: "date-create-and-management",
        components: {
            datepicker: Datepicker,
        },
        props: {
            isViewMode: Boolean,
            createdDate: String,
            accountingDate: String,
        },
        computed : {
            internalAccountingDate: {
                get() {
                    return this.accountingDate;
                },
                set(value) {
                    this.$emit('update:accountingDate', value);
                }
            },
        }
    }
</script>
