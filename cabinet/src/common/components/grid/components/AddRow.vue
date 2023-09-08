<template>
  <div class="grid-changer-wrapper">
    <div class="grid-changer">
      <h2 class="grid-changer__title">Добавление записи</h2>
      <div class="input-values">
        <div v-for="(fieldObject, columnName, index) in fields" class="input-values__item">

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
            ></multiselect>
          </div>
          <div v-else>
            <input v-model="inputsToAdd[columnName]"
                   v-bind:class="{ errorInput: fieldObject.state.isError  }"
                   :type="fieldObject.type"
                   @change="fieldObject.validate(inputsToAdd[columnName])"
                   :placeholder="fieldObject.title"
                   class="v-input">
          </div>
          <div class="error-message" v-if="fieldObject.state.isError">
            {{fieldObject.state.message}}
          </div>

        </div>
      </div>
      <div class="button-block">
        <button @click.prevent="saveAddingElem" class="btn green">Сохранить</button>
        <button @click.prevent="closeModal('showAddingModal')" class="btn red pull-right">Отмена
        </button>
      </div>
    </div>
  </div>
</template>
<script>
    import workingWithDataMixin from './mixins/searchingAddingDataMixin'
    export default {
        mixins: [workingWithDataMixin],
        data() {
            return {
                inputsToAdd: [],
            }
        },
        methods: {
            /**
             * Сохранение новой строки
             */
            saveAddingElem() {
                let isValid = true;
                for (let columnName in this.fields) {
                    let value = this.inputsToAdd[columnName];
                    let field = this.getField(columnName);
                    if (field.type == 'select') {
                        if(field.selectConfig.selectedValue.length === 0 && field.validators.hasOwnProperty('required') === true){
                            field.state.setError('Выберите как минимум 1 select');
                        }else{
                            field.state.setSuccess('sucess');
                            for (let key in field.selectConfig.selectedValue) {
                                if (!field.validate(field.selectConfig.selectedValue[key])) {
                                    this.$set(this.fields[columnName], 'state', field.state);
                                }
                            }
                        }
                    }
                    else if (!field.validate(value)) {
                        this.$set(this.fields[columnName], 'state', field.state);
                        //TODO: переделать через комит а не напрямую сетить
                        // let info = {
                        //     'fieldName': columnName,
                        //     'state': field.state
                        // }
                        // this.$store.commit('setFieldState', info)

                        isValid = false
                    }
                }

                if (
                    !isValid
                ) {
                    return false;
                }

                let newElem = {};
                for (let key in this.fields) {
                    if (this.inputsToAdd[key] === undefined) {
                        this.inputsToAdd[key] = null;
                    }
                    if (this.fields[key].type === 'select') {
                        newElem[key] = this.fields[key].selectConfig.selectedValue;
                    } else {
                        newElem[key] = this.inputsToAdd[key];
                    }
                }
                gridComponent.addDataRow(newElem);
                gridComponent.loadAliases(newElem);
                gridComponent.closeModal('showAddingModal');
                this.inputsToAdd = [];
                gridComponent.clearStates();
            }
        }
    }

</script>

<style>

</style>