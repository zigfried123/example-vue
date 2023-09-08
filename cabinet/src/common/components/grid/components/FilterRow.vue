<template>
  <div class="grid-changer-wrapper">
    <div class="grid-changer">
      <h2 class="grid-changer__title">Подбор данных</h2>
      <div class="input-values">
        <div v-for="(fieldObject, columnName, index) in filterFields" class="input-values__item">

          <label>{{fieldObject.title}}</label>
          <div v-if="fieldObject.type === 'select'">
            <multiselect
                    :id="fieldObject"
                    v-model="fieldObject.selectConfig.selectedValue"
                    :options="fieldObject.selectConfig.options"
                    :multiple="fieldObject.selectConfig.multiple"
                    :searchable="true"
                    @search-change="asyncFind"
                    :placeholder="fieldObject.selectConfig.placeholder"
                    :noOptions="'список пуст'"
            ></multiselect>
          </div>
          <div v-else>
            <input v-model="inputsToFilter[columnName]"
                   v-bind:class="{ errorInput: fieldObject.state.isError  }"
                   :type="fieldObject.type"
                   @change="fieldObject.validate(inputsToFilter[columnName])"
                   :placeholder="fieldObject.title"
                   :disabled="!fieldObject.enabled"
                   class="v-input">
          </div>
          <div class="error-message" v-if="fieldObject.state.isError">
            {{fieldObject.state.message}}
          </div>

        </div>
      </div>
      <div class="button-block">
        <button @click.prevent="loadSearch(false)" class="btn green">Заполнить</button>
        <button @click.prevent="loadSearch(true)" class="btn green">Добавить</button>
        <button @click.prevent="closeModal('showFilterModal')" class="btn red pull-right">Закрыть
        </button>
      </div>
    </div>
  </div>
</template>
<script>
    import loadSearchMixin from '../mixins/LoadSearchMixin'
    import workingWithDataMixin from './mixins/searchingAddingDataMixin'

    export default {

        mixins: [loadSearchMixin, workingWithDataMixin],

        props: {
            filterFields: {},
            baseUrl: {}
        },
        methods: {
            getFilterField(fieldName) {
                return this.filterFields[fieldName];
            }

        }
    }
</script>
<style>

</style>