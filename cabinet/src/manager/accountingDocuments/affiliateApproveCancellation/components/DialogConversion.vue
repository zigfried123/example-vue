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
                <md-field :class="getValidationClass('affiliateId')">
                    <label>ID вебмастера</label>
                    <md-input v-model="affiliateId"></md-input>
                    <span class="md-error" v-if="!$v.affiliateId.minValue">
                            ID вебмастера может быть только положительным целочисленным значением
                        </span>
                    <span class="md-error" v-else-if="!$v.affiliateId.numeric">
                            ID вебмастера может быть только целочисленным значением
                        </span>
                </md-field>
            </div>

            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <md-field :class="getValidationClass('affiliateReferralId')">
                    <label>ID реферала</label>
                    <md-input v-model="affiliateReferralId"></md-input>
                    <span class="md-error" v-if="!$v.affiliateReferralId.minValue">
                            ID реферала может быть только положительным целочисленным значением
                        </span>
                    <span class="md-error" v-else-if="!$v.affiliateReferralId.numeric">
                            ID реферала может быть только целочисленным значением
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
            affiliateId:{
                numeric,
                minValue: minValue(1),
            },
            affiliateReferralId:{
                numeric,
                minValue: minValue(1),
            },
            amount: {
                decimal,
                minValue: minValue(1),
            }
        },
        data: () =>({
            conversion: '',
            affiliateId: '',
            affiliateReferralId: '',
            amount:null,
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
                this.affiliateId = this.$store.getters.RAW_DATA[this.editIndexRow].affiliate_id;
                this.affiliateReferralId = this.$store.getters.RAW_DATA[this.editIndexRow].affiliate_referral_id;
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
                            affiliate_id: this.affiliateId,
                            affiliate_referral_id: this.affiliateReferralId,
                            amount: this.amount
                        }
                    }
                );
                this.close()
            },
            addConversion() {
                if (!this.isUniqueConversion(this.conversion, this.$store.getters.RAW_DATA)) {
                    notify('Данная конверсия уже присутствует в таблице', 'danger');
                    return;
                }

                this.$store.dispatch(
                    'PUT_RAW_DATA', [{
                        conversion_id: this.conversion,
                        affiliate_id: this.affiliateId,
                        affiliate_referral_id: this.affiliateReferralId,
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
