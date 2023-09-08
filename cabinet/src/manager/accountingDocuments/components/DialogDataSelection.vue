<template>
    <div class="data-selection-dialog">
      <md-dialog-title>Подбор данных</md-dialog-title>

      <div class="md-layout-item md-layout md-gutter">

        <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
          <md-field :class="getValidationClass('conversion')">
            <label>Конверсия</label>
            <md-input v-model="conversion"></md-input>
              <span class="md-error"
                  v-if="!$v.conversion.minValue ">
                Конверсия может быть только положительным целочисленным значением
              </span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
          <select2
               :value.sync="advertiser_id"
               :searchingUrl="urlAdvertiser()"
               is-load-data-on-init
               title="Рекламодатель"/>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
          <md-field>
            <label>ADV SUB</label>
            <md-input v-model="advSub" ></md-input>
          </md-field>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
          <select2
                  :value.sync="webmaster_id"
                  :searchingUrl="urlAffiliate()"
                  is-load-data-on-init
                  title="Вебмастер"/>
        </div>

        <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
            <select2
                  :value.sync="offer_id"
                  :searchingUrl="urlOffer()"
                  is-load-data-on-init
                  title="Оффер"/>
        </div>
      </div>

      <md-dialog-actions>
        <md-button class="md-accent" @click="closeDataSelection">Закрыть</md-button>
        <md-button class="md-primary" @click="validateFields">Подобрать</md-button>
      </md-dialog-actions>
  </div>
</template>

<script>
    import { validationMixin } from 'vuelidate';
    import { required, numeric, minValue } from 'vuelidate/lib/validators';
    import docDataMixin from '../mixins/docDataMixin';
    import Select2 from '../../../common/components/select2/select2.vue';
    import { mapMutations, mapActions } from 'vuex';
    import docUrlsMixin from '../mixins/docUrlsMixin';

    export default {
        name: 'dialog-data-selection',
        mixins: [docDataMixin, validationMixin, docUrlsMixin],
        components: {
            select2: Select2,
        },
        props: {
            baseUrl: String,
        },
        validations: {
            conversion: {
                    numeric,
                    minValue: minValue(1),
            }
        },
        data: () =>({
            advertiser_id: '',
            webmaster_id: '',
            offer_id: '',
            conversion: '',
            advSub: '',
        }),
        methods:{
            ...mapMutations({
                setProcessing: 'SET_PROCESSING',
            }),
            ...mapActions({
                putRawData: 'PUT_RAW_DATA',
            }),
            getValidationClass (fieldName) {
                const field = this.$v[fieldName];

                if (field) {
                    return {
                        'md-invalid': field.$invalid && field.$dirty
                    }
                }
            },
            validateFields () {
                this.$v.$touch()

                if (!this.$v.$invalid) {
                    this.addFilteredData()
                }
            },
            addFilteredData() {
                this.setProcessing(true);

                let formData = new FormData();

                if (!!this.conversion) {
                    formData.append('conversion_id', this.conversion);
                }

                if (!!this.advertiser_id) {
                  formData.append('advertiser_id', this.advertiser_id);
                }

                if (!!this.advSub) {
                  formData.append('adv_sub', this.advSub);
                }

                if (!!this.webmaster_id) {
                  formData.append('affiliate_id', this.webmaster_id);
                }

                if (!!this.offer_id) {
                  formData.append('offer_id', this.offer_id);
                }

                this.loadDataForGrid(this.urlLoadData(), formData);
                this.closeDataSelection();
            },
            closeDataSelection(){
                this.$emit('closeDataSelection');
            },
        }
    }
</script>

<style scoped>
.data-selection-dialog{
  padding-top: 30px;
}
</style>
