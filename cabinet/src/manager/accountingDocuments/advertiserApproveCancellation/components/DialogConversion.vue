<template>
    <div class="data-selection-dialog">
        <md-dialog-title>Конверсия</md-dialog-title>

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
                <md-field :class="getValidationClass('advertiserId')">
                    <label>ID рекламодателя</label>
                    <md-input v-model="advertiserId"></md-input>
                    <span class="md-error" v-if="!$v.advertiserId.minValue">
                            ID рекламодателя может быть только положительным целочисленным значением
                        </span>
                    <span class="md-error" v-else-if="!$v.advertiserId.numeric">
                            ID рекламодателя может быть только целочисленным значением
                        </span>
                </md-field>
            </div>

            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <md-field :class="getValidationClass('amount')">
                    <label>Сумма</label>
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
          <md-button class="md-primary" @click="saveConversion" :disabled="!isValidData">Сохранить</md-button>
      </md-dialog-actions>
  </div>
</template>

<script>
    import { validationMixin } from 'vuelidate';
    import { required, numeric, decimal, minValue } from 'vuelidate/lib/validators';
    import conversionDialogMixin from '../../mixins/conversionDialogMixin';

    export default {
        name: 'dialog-conversion',
        mixins: [validationMixin, conversionDialogMixin],
        props: {
            editIndexRow: Number,
            baseUrl: String,
            urlLoadData: String,
        },
        validations: {
            conversion: {
                numeric,
                minValue: minValue(1),
            },
            advertiserId: {
                numeric,
                minValue: minValue(1),
            },
            amount: {
                required,
                decimal,
                minValue: minValue(1),
            }
        },
        data: () =>({
            conversion: '',
            advertiserId: '',
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
                this.conversion = this.$store.getters.RAW_DATA[this.editIndexRow].conversion_id;
                this.advertiserId = this.$store.getters.RAW_DATA[this.editIndexRow].advertiser_id;
                this.amount = this.$store.getters.RAW_DATA[this.editIndexRow].amount;
            }
        },
        methods:{
            getValidationClass (fieldName) {
                return {'md-invalid': this.$v[fieldName].$invalid};
            },
            saveConversion() {
                if (this.editIndexRow != null) {
                    this.editConversion();
                } else {
                    this.addConversion();
                }
            },
            editConversion() {
                this.$store.dispatch(
                    'CHANGE_ITEM_RAW_DATA',
                    {
                        index: this.editIndexRow,
                        item: {
                            conversion_id: this.conversion,
                            advertiser_id: this.advertiserId,
                            amount: this.amount
                        }
                    }
                );
                this.close()
            },
            addConversion() {
                this.$store.dispatch(
                    'PUT_RAW_DATA', [{
                        conversion_id: this.conversion,
                        advertiser_id: this.advertiserId,
                        amount: this.amount
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
