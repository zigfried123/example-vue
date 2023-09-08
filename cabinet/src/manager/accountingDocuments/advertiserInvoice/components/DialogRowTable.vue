<template>
    <div class="data-selection-dialog">
        <md-dialog-title>Редактирование строки</md-dialog-title>

        <div class="md-layout-item md-layout md-gutter">

            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <md-field :class="getValidationClass('conversion')">
                    <label>Конверсия</label>
                    <md-input v-model="conversion"></md-input>
                    <span class="md-error" v-if="!$v.conversion.minValue">
                            Конверсия может быть только положительным целочисленным значением
                        </span>
                    <span class="md-error" v-else-if="!$v.conversion.numeric">
                            Конверсия может быть только целочисленным значением
                        </span>
                </md-field>
            </div>

            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <select2
                        :value.sync="advertiser_id"
                        :searchingUrl="urlAdvertiser()"
                        is-load-data-on-init
                        placeholder="Рекламодатель"/>
            </div>

            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <md-field :class="getValidationClass('description')">
                    <label>Описание</label>
                    <md-input v-model="description"></md-input>
                </md-field>
            </div>

            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <md-field :class="getValidationClass('amountBase')">
                    <label>Сумма (учета)</label>
                    <md-input v-model="amountBase"></md-input>
                    <span class="md-error" v-if="!$v.amountBase.minValue">
                        Сумма может быть только положительным значением
                    </span>
                    <span class="md-error" v-else-if="!$v.amountBase.decimal">
                        Сумма может быть только числом
                    </span>
                </md-field>
            </div>

                        <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <md-field :class="getValidationClass('amount')">
                    <label>Сумма (факт)</label>
                    <md-input v-model="amount"></md-input>
                    <span class="md-error" v-if="!$v.amount.minValue">
                        Сумма может быть только положительным значением
                    </span>
                    <span class="md-error" v-else-if="!$v.amount.decimal">
                        Сумма может быть только числом
                    </span>
                </md-field>
            </div>


        </div>

        <md-dialog-actions>
            <md-button class="md-accent" @click="close">Отмена</md-button>
            <md-button class="md-primary" @click="saveRow" :disabled="!isValidData">Сохранить</md-button>
        </md-dialog-actions>
    </div>
</template>

<script>
    import { validationMixin } from 'vuelidate';
    import { required, numeric, decimal, minValue } from 'vuelidate/lib/validators';
    import Select2 from '../../../../common/components/select2/select2.vue';
    import docUrlsMixin from '../../mixins/docUrlsMixin';

    export default {
        name: 'dialog-row-table',
        components: {
            select2: Select2,
        },
        mixins: [validationMixin, docUrlsMixin],
        props: {
            editIndexRow: Number,
            baseUrl: String,
            urlLoadData: String,
        },
        validations: {
            conversion: {
                required,
                numeric,
                minValue: minValue(1),
            },
            description: {
                required,
            },
            amountBase: {
                required,
                decimal,
                minValue: minValue(1),
            },
            amount: {
                required,
                decimal,
                minValue: minValue(1),
            },
        },
        data: () =>({
            conversion: '',
            description: '',
            advertiser_id: '',
            amountBase: '',
            amount: '',
        }),
        computed: {
            isValidData() {
                this.$v.$touch();
                return !this.$v.$invalid;
            },
        },
        mounted: function() {
            if (this.editIndexRow != null) {
                this.conversion = this.$store.getters.RAW_DATA[this.editIndexRow].item;
                this.advertiser_id = this.$store.getters.RAW_DATA[this.editIndexRow].advertiser_id;
                this.description = this.$store.getters.RAW_DATA[this.editIndexRow].description;
                this.amountBase = this.$store.getters.RAW_DATA[this.editIndexRow].amountBase;
                this.amount = this.$store.getters.RAW_DATA[this.editIndexRow].amount;
            }
        },
        methods:{
            getValidationClass (fieldName) {
                return {'md-invalid': this.$v[fieldName].$invalid};
            },
            saveRow() {
                if (this.editIndexRow != null) {
                    this.editRow();
                } else {
                    this.addRow();
                }
            },
            editRow() {
                this.$store.dispatch(
                    'CHANGE_ITEM_RAW_DATA',
                    {
                        index: this.editIndexRow,
                        item: {
                            item: this.conversion,
                            advertiser_id: this.advertiser_id,
                            description: this.description,
                            amountBase: this.amountBase,
                            amount: this.amount,
                        }
                    }
                );
                this.close()
            },
            addRow() {
                this.$store.dispatch(
                    'PUT_RAW_DATA', [{
                        item: this.conversion,
                        advertiser_id: this.advertiser_id,
                        description: this.description,
                        amountBase: this.amountBase,
                        ndsBase: this.ndsBase,
                        amount: this.amount,
                        nds: this.nds,
                        totalAmount: this.totalAmount,
                    }]
                );
                this.close()
            },
            close(){
                this.$emit('close');
            }
        }

    }
</script>

<style scoped>
    .data-selection-dialog{
        padding-top: 30px;
    }
</style>
