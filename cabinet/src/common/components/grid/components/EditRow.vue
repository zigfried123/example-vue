<template>
  <div class="grid-changer-wrapper">
    <div class="grid-changer">
      <h2 class="grid-changer__title">Редактирование строки</h2>
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
          <input v-model="inputsToChange[columnName]"
                 v-bind:class="{ errorInput: fieldObject.state.isError  }"
                 :type="fieldObject.type"
                 @change="fieldObject.validate(inputsToChange[columnName])"
                 :placeholder="fieldObject.title"
                 :disabled="!fieldObject.editable"
                 class="v-input">
          </div>
          <div class="error-message" v-if="fieldObject.state.isError">
            {{fieldObject.state.message}}
          </div>

        </div>
      </div>
      <div class="button-block">
        <button @click.prevent="saveChangeElem" class="btn green">Сохранить</button>
        <button @click.prevent="closeModal('showEditModal')" class="btn red pull-right">Отмена</button>
      </div>
    </div>
  </div>
</template>
<script>
    import workingWithDataMixin from './mixins/searchingAddingDataMixin'
    export default {
        mixins: [workingWithDataMixin],
        props:{
            inputsToChange: {
                type: Array
            },
            dataPerPage:{
                type: Array
            },
            idOfChangedElem:{

            }

        },
        methods:{
            /**
             * Сохрание данных формы редактирования
             */
            saveChangeElem() {
                let isValid = true;
                for (let columnName in this.fields) {
                    let value = this.inputsToChange[columnName];
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
                        isValid = false;
                    }
                }

                if (!isValid) {
                    return false;
                }

                let idOfChangedElem = this.idOfChangedElem;
                let inputsToChange = this.inputsToChange;
                let currentRow = this.dataPerPage[idOfChangedElem];


                for (var key in currentRow) {
                    if(this.fields[key].type === 'select'){
                        currentRow[key] = this.fields[key].selectConfig.selectedValue;
                    }else{
                        currentRow[key] = inputsToChange[key];
                    }
                }
                gridComponent.loadAliases(currentRow);
                gridComponent.closeModal('showEditModal');
                gridComponent.onItemUpdated.forEach(function (item, i, arr) {
                    eval(item);
                });
                gridComponent.clearStates();
            }
        }
    }

</script>
<style>

</style>