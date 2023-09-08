<template>
  <div>
    <div v-if="editEnable">

      <transition name="fade">
        <!-- Add item -->
        <add-row
                v-show="showAddingModal"
        ></add-row>
        <!--EOF Add item -->
      </transition>

      <transition name="fade">
        <!--Change item -->
        <edit-row v-show="showEditModal"
                  :inputs-to-change="inputsToChange"
                  :data-per-page="dataPerPage"
                  :id-of-changed-elem="idOfChangedElem"
        ></edit-row>
        <!--EOF Change item -->
      </transition>

      <!--Search data -->
      <transition  name="fade">
        <filter-row
                v-show="showFilterModal"
                :filter-fields="filterFields"
                :base-url="baseUrl"
        ></filter-row>
      </transition>
      <!--EOF Search data -->

    </div>



    <div v-if="editEnable" class="btn-toolbar">
      <!--search-->
      <button v-if="searchEnable" @click.prevent="showFilterModal = !showFilterModal" class="btn yellow"
              title="Подбор данных">
        Подбор данных <i class="icon-search data-transfer-icon" aria-hidden="false"></i>
      </button>
      <!--search end-->
      <!-- add -->
      <button v-if="addEnable" @click.prevent="addItem" class="btn grey" title="Добавить строку">
        <i class="icon-plus data-transfer-icon" aria-hidden="false"></i>
      </button>
      <!-- add end -->
      <!-- import -->
      <button v-if="importOptions.enable" @click.prevent="importData" class="btn grey" title="Импорт данных">
        Импорт <i class="icon-upload data-transfer-icon" aria-hidden="true"></i>
      </button>
      <input v-if="importOptions.enable" @change="uploadHandle" class="hide" type="file" value=""
             v-bind:id="importOptions.id"/>
      <!-- import end -->
      <!-- export -->
      <button v-if="exportOptions.enable" @click.prevent="exportData" class="btn grey" title="Экспорт данных">
        Экспорт <i class="icon-download data-transfer-icon" aria-hidden="true"></i>
      </button>
      <!--clear grid-->
      <button @click.prevent="clearGridAction" class="btn red pull-right" title="Очистить таблицу">
        <i class="icon-trash" aria-hidden="true"></i>
      </button>
      <!--clear grid end-->
      <form v-if="exportOptions.enable" method="post" v-bind:action="exportOptions.url" target="_blank"
            v-bind:id="exportOptions.id">
        <input type="hidden" name="export" value=""/>
        <input type="hidden" name="gridInstanceName" v-bind:value="instanceName"/>
      </form>
      <!-- export end -->

    </div>

    <div class="data-grid-container">
      <!--Grid-->
      <table class="table table-hover">
        <thead>
        <tr>
          <th v-for="(fieldObject, columnName, index) in fields"
              v-if="fieldObject.visible === true">
            {{ fieldObject.title }}
            <i class="icon-key text-warning" title="Поле должно быть уникальным" v-if="fieldObject.isUnique"></i>
          </th>

        </tr>
        </thead>
        <tbody v-for="(row, rowIndex) in dataPerPage">
        <tr>
          <td v-for="(fieldObject, columnName, index) in fields"
              v-if="fieldObject.visible !== false">
                        <span v-if="gridDataAliases[columnName] && gridDataAliases[columnName][row[columnName]]"
                              v-html="gridDataAliases[columnName][row[columnName]]">
                        </span>
            <span v-else-if="row[columnName] === ''" style="color: gray;">
                            (пусто)
                        </span>
            <span v-else v-html="row[columnName]">
                        </span>
          </td>
          <td v-if="editEnable" @click="changeElem(rowIndex)">
            <i class="icon-pencil" aria-hidden="true"></i>
          </td>
          <td v-if="editEnable" @click="removeItem(rowIndex)">
            <i class="icon-trash" aria-hidden="true"></i>
          </td>
        </tr>
        </tbody>

        <tbody v-if="dataPerPage.length === 0">
        <tr>
          <td v-bind:colspan="Object.keys(fields).length" style="text-align: center">
            Нет данных
          </td>
        </tr>
        </tbody>
      </table>
      <!--EOF Grid-->

      <!--pagination-->
      <pagination
              v-if="!hidePaginator"
              :current="thisPage"
              :total="gridData.length"
              :perPage="perPage"
              @page-changed="fetchGrid"
      ></pagination>
      <!--EOF pagination-->

    </div>
  </div>

</template>

<script>
    import Pagination from "./pagination.vue";
    import Field from './common/field';
    import AddRow from './components/AddRow.vue';
    import EditRow from './components/EditRow.vue';
    import FilterRow from './components/FilterRow.vue';

    export default {
        components: {
            pagination: Pagination,
            addRow: AddRow,
            editRow: EditRow,
            filterRow: FilterRow,
        },
        data() {
            return {
                perPage: 3,
                baseUrl: null,
                editEnable: true,
                addEnable: true,
                searchEnable: true,
                verboseMode: true,
                instanceName: '',
                importOptions: {
                    enable: false,
                    id: '',
                    params: {}
                },
                exportOptions: {
                    enable: false,
                    id: ''
                },
                showEditModal: false,
                showAddingModal: false,
                showFilterModal: false,
                inputsToChange: [],
                inputsToFilter: [],
                idOfChangedElem: 0,
                gridDataAliases: [],
                onDataLoaded: [],
                onItemUpdated: [],
                dataPerPage: [],
                thisPage: 1,
                filterFields: {}
            }
        },
        computed: {
            fields() {
                return this.$store.getters.getFields
            },
            gridData() {
                return this.$store.getters.getData
            },
            hidePaginator(){
                return (this.gridData.length <= this.perPage)? true : false
            }
        },
        methods: {
            /**
             * инициализация грида
             */
            initializeGrid(options) {
                let o = JSON.parse(options);
                this.setPerPage(o.perPage);
                this.setVerboseMode(o.verboseMode);
                this.setInstanceName(o.instanceName);
                this.editMode(o.editEnable);
                this.setImportOptions(o.import);
                this.setExportOptions(o.export);
                this.initFields(o.config);
                this.initFilterFields(o.filtersConfig);
                this.searchEnable = o.searchEnable;
                this.addEnable = o.addEnable;
                this.onDataLoaded = o.onDataLoaded;
                this.onItemUpdated = o.onItemUpdated;
                this.baseUrl = o.baseUrl;

            },

            fetchGrid(page) {
                let startIndex = 0;
                if (page > 1) startIndex = (page - 1) * this.perPage;
                let endIndex = startIndex + this.perPage;
                this.dataPerPage = this.$store.getters.getData.slice(startIndex, endIndex);
                this.thisPage = page;
            },

            /**
             * Get field by name
             * @param {String} fieldName
             * @returns {Field}
             */
            getField(fieldName) {
                return this.$store.getters.getField(fieldName);
            },

            /**
             * Set field by name
             * @param {String} fieldName
             * @param {Field} fieldObject
             * @returns {Field}
             */
            setField(fieldName, fieldObject) {
                // this.$set(this.$store.state.fields, fieldName, fieldObject);
                let info = {
                    'fieldName': fieldName,
                    'fieldObject': fieldObject
                };
                this.$store.commit('putField', info);
            },

            /**
             * Set filter field by name
             * @param {String} fieldName
             * @param {Field} fieldObject
             * @returns {Field}
             */
            setFilterField(fieldName, fieldObject) {
                this.$set(this.filterFields, fieldName, fieldObject);
            },

            /**
             * Init fields from config
             * @param config
             */
            initFields(config) {
                for (let fieldName in config) {
                    if (config === undefined) {
                        throw 'Config is not exist';
                    }
                    if (!config.hasOwnProperty(fieldName)) {
                        continue;
                    }

                    let fieldConfig = config[fieldName];

                    if (fieldConfig === undefined) {
                        continue;
                    }

                    this.setField(
                        fieldName,
                        new Field(
                            fieldName,
                            fieldConfig.title,
                            fieldConfig.type,
                            fieldConfig.editable,
                            fieldConfig.enabled,
                            fieldConfig.visible,
                            fieldConfig.validators,
                            fieldConfig.isUnique,
                            fieldConfig.selectConfig
                        )
                    )
                }
            },

            /**
             * Init filter fields from config
             * @param config
             */
            initFilterFields(config) {
                for (let fieldName in config) {
                    if (config === undefined) {
                        throw 'Config is not exist';
                    }
                    if (!config.hasOwnProperty(fieldName)) {
                        continue;
                    }

                    let fieldConfig = config[fieldName];

                    if (fieldConfig === undefined) {
                        continue;
                    }

                    this.setFilterField(
                        fieldName,
                        new Field(
                            fieldName,
                            fieldConfig.title,
                            fieldConfig.type,
                            fieldConfig.editable,
                            fieldConfig.enabled,
                            fieldConfig.visible,
                            fieldConfig.validators,
                            fieldConfig.isUnique,
                            fieldConfig.selectConfig
                        )
                    )
                }
            },
            /**
             * Clear States
             * clear all input state to init
             */
            clearStates() {
                this.inputsToChange = [];
                this.inputsToAdd = [];
                this.inputsToFilter = [];
                for (let field in this.fields) {
                    this.fields[field].clearState();
                }
            },

            /**
             * Удаление с проверкой включенного вывода уведомления(confirm)
             */
            removeItem(id) {
                let startIndex = 0;
                if (this.thisPage > 1) startIndex = (this.thisPage - 1) * this.perPage;
                let index = startIndex + id;
                if (this.verboseMode) {
                    if (confirm("Удалить элемент?")) {
                        this.remove(index);
                    }
                } else {
                    this.remove(index);
                }
            },

            /**
             * Удаления элемента
             */
            remove(id) {
                this.$store.commit('removeDataRow', id)
                if (this.dataPerPage.length == 1) {
                    this.thisPage = this.thisPage - 1;
                }
            },


            /**
             * Открыть окно редактирования
             */
            changeElem(id) {
                if (!this.editEnable) {
                    return;
                }
                // Отображаем модалку
                this.showEditModal = !this.showEditModal;

                this.idOfChangedElem = id;
                // let inputsToChange = this.inputsToChange;
                let currentRow = this.dataPerPage[this.idOfChangedElem];

                for (let columnName in currentRow) {
                    if (currentRow[columnName] === undefined) {
                        currentRow[columnName] = null;
                    }
                    this.$set(this.inputsToChange, columnName, currentRow[columnName]);
                }

                this.onItemUpdated.forEach(function (item, i, arr) {
                    eval(item);
                });
            },

            /**
             * Окно добавления новой строки
             */
            addItem() {
                if (this.addEnable) {
                    this.showAddingModal = true;
                } else {
                    notify("Добавление недоступно!", 'error');
                }
            },

            /**
             * Очистка грида
             */
            clearGridAction() {
                if (this.editEnable) {
                    this.clearGrid();
                    this.thisPage = 0;
                } else {
                    notify('Очистка грида недоступна', 'error');
                }
            },

            /**
             * Очистка грида
             */
            clearGrid() {
                this.$store.commit('clearData');
            },
            closeModal(modal) {
                this[modal] = !this[modal];
                this.clearStates();
            },


            /**
             * Добавление новых строк в gridData
             */
            addDataRows(rows) {
                for (let row of rows) {
                    this.addDataRow(row);
                }
            },

            /**
             * Добавление новой строки в gridData
             */
            addDataRow(row) {
                if (!this.validateRowIsUnique(row)) {
                    return;
                }
                this.$store.commit('addRow', row);
                this.loadAliases(row);
            },

            /**
             * Заполнение gridData
             */
            putData(data) {
                this.fetchGrid(this.thisPage);
                this.thisPage = 1;
                try {
                    this.clearGrid();
                    for (let row of data) {
                        if (!this.validateRowIsUnique(row)) {
                            return;
                        }
                        this.addDataRow(row);
                    }

                } catch (e) {
                    throw e;
                } finally {
                    this.onDataLoaded.forEach(function (item, i, arr) {
                        eval(item);
                    });
                    this.loadAliases();
                }
            },

            /**
             * Поиск строк по параметрам
             */
            getRowsByParams(params) {
                let resultSet = [];
                for (let row of this.$store.getters.getData) {
                    if (this.isRowEqualByParams(row, params)) {
                        resultSet.push(row);
                    }
                }
                return resultSet;
            },

            /**
             * Проверка того, что строка соответствует параметрам
             * validateRowIsUnique -> rowIsUnique -> getUniqueFieldNames -> getUniqueFields
             */
            isRowEqualByParams(row, params) {
                if (Object.keys(params).length === 0) {
                    return false;
                }

                for (let searchFieldName in params) {
                    let rowValueIsEqual = params[searchFieldName] == row[searchFieldName];
                    if (!rowValueIsEqual) {
                        return false;
                    }
                }
                return true;
            },

            /**
             * Проверка и уведомление о дубликате
             */
            validateRowIsUnique(row) {
                if (!this.rowIsUnique(row)) {
                    notify('Дубликат. Поля: ' + this.getUniqueFieldsText() + ' должны быть уникальными!', 'error');
                    return false;
                }
                return true;
            },

            /**
             *
             */
            rowIsUnique(row) {
                let uniqueFieldNames = this.getUniqueFieldNames();
                let searchParams = {};
                for (let uniqueFieldName of uniqueFieldNames) {
                    searchParams[uniqueFieldName] = row[uniqueFieldName];
                }
                let searchResult = this.getRowsByParams(searchParams);
                return searchResult !== undefined && searchResult.length === 0;
            },

            /**
             * @returns {Field}
             */
            getUniqueFields() {
                let uniqueFields = {};
                for (let fieldName in this.fields) {
                    let field = this.fields[fieldName];
                    /**
                     * @var {Field} field
                     */
                    if (field !== undefined && field.isUnique === true) {
                        uniqueFields[fieldName] = this.fields[fieldName];
                    }
                }
                return uniqueFields;
            },
            getUniqueFieldNames() {
                let uniqueFieldNames = [];
                let uniqueFields = this.getUniqueFields();
                for (let uniqueFieldName in uniqueFields) {
                    uniqueFieldNames.push(uniqueFieldName);
                }
                return uniqueFieldNames;
            },
            /**
             * @returns {string}
             */
            getUniqueFieldsText() {
                let uniqueFieldsTitles = [];
                let uniqueFields = this.getUniqueFields();
                for (let fieldName in uniqueFields) {
                    uniqueFieldsTitles.push(uniqueFields[fieldName].title);
                }

                return uniqueFieldsTitles.join(', ');
            },

            /**
             * Заполнение алиасов
             * @param data
             */
            putDataAliases(data) {
                this.fetchGrid(this.thisPage);
                this.thisPage = 1;
                try {
                    //Пробуем распарсить json
                    for (let type in data) {
                        for (let id in data[type]) {
                            if (this.gridDataAliases[type] == undefined) {
                                this.gridDataAliases[type] = {};
                            }
                            this.gridDataAliases[type][id] = data[type][id];
                        }
                    }
                } catch (e) {
                    //Если пришел не json выкинет синтаксическую ошибку - пробуем класть напрямую
                    if (e.name == 'SyntaxError') {
                        try {
                            this.gridDataAliases = data;
                        } catch (e) {
                            throw e;
                        }
                    } else {
                        throw e;
                    }
                } finally {
                    this.onDataLoaded.forEach(function (item, i, arr) {
                        eval(item);
                    });
                }

            },

            /**
             * Сериализованные данные всего грида
             */
            getSerializedData() {
                return JSON.stringify(this.$store.getters.getData);
            },

            /**
             * Сеттер verboseMode
             */
            setVerboseMode(verboseMode) {
                this.verboseMode = verboseMode;
            },

            /**
             * Режим редактирования
             */
            editMode(editEnable) {
                this.editEnable = editEnable;
            },

            /**
             * Установка настроек импорта
             */
            setImportOptions(importOptions) {
                this.importOptions = importOptions;
            },

            /**
             * Установка настроек экспорта
             */
            setExportOptions(exportOptions) {
                this.exportOptions = exportOptions;
            },
            /**
             * Установка типа грида
             */
            setInstanceName(instanceName) {
                this.instanceName = instanceName;
            },
            /**
             * Установка количества элементов на странице
             *
             */
            setPerPage(perPage) {
                this.perPage = perPage;
            },

            /**
             * Загрузка алиасов
             * @param row
             */
            loadAliases(row = null) {
                let putDataAliases = this.putDataAliases;
                let formData = new FormData();
                formData.append('gridData', row ? JSON.stringify([row]) : this.getSerializedData());
                formData.append('gridInstanceName', this.instanceName);

                axios({
                    method: 'POST',
                    url: this.baseUrl + '/aliases',
                    header: {
                        processData: false,
                        contentType: false
                    },
                    data: formData
                }).then(response => {
                    if (response.data.success === true) {
                        putDataAliases(response.data.gridDataAliases);
                    }

                    if (response.data.error !== undefined) {
                        notify(response.data.error, 'error');
                    }
                }).catch(function (error) {
                    notify(error, 'error');
                });

            },



            /**
             * Обработка файла
             */
            uploadHandle() {
                let fileInput = $('#' + this.importOptions.id);
                if (fileInput.val()) {
                    let formData = new FormData();
                    formData.append('importFile', fileInput.prop('files')[0]);
                    formData.append('gridInstanceName', this.instanceName);
                    for (let prop in this.importOptions.params) {
                        if (this.importOptions.params.hasOwnProperty(prop)) {
                            formData.append('params[' + prop + ']', $('#' + this.importOptions.params[prop]).val());
                        }
                    }
                    // todo избавиться от jQuery
                    let dataPut = this.putData;

                    axios({
                        method: 'POST',
                        url: this.importOptions.url,
                        header: {
                            processData: false,
                            contentType: false
                        },
                        data: formData
                    }).then(response => {
                        if (response.data.success === true) {
                            dataPut(response.data.gridData);
                        }

                        if (response.data.error !== undefined) {
                            notify(response.data.error, 'error');
                        }

                    }).catch(function (error) {
                        console.log(error);
                    });

                    fileInput.val('');
                }
            },

            /**
             * Импорт
             */
            importData() {
                $('#' + this.importOptions.id).click();
            },

            /**
             * Экспорт
             */
            exportData() {
                let data = this.getSerializedData();
                if (JSON.parse(data).length !== 0) {
                    $('#' + this.exportOptions.id + ' input[name=\"export\"]').val(data);
                    $('#' + this.exportOptions.id).submit();
                } else {
                    let msg = 'Необходимо заполнить табличную часть!';
                    if (this.verboseMode) {
                        alert(msg);
                    } else {
                        console.log(msg);
                    }
                }
            }

        },
        watch: {
            gridData: function() {
                if(this.onItemUpdated.length === 0){
                    return;
                }
                this.onItemUpdated.forEach(function (item, i, arr) {
                    eval(item);
                });
                this.fetchGrid(this.thisPage)
            },
        },
        created() {
            this.fetchGrid(this.thisPage);
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
  .multiselect{
    margin-bottom: 10px;
  }
  .v-input{
    width: 100%;
    box-sizing: border-box;
    padding: 5px;
    border-radius: 0px !important;
    min-height: 40px;
    display: block;
    border: 1px solid #e8e8e8;
    background: #fff;
    font-size: 14px;
    box-shadow: none;
  }
  i {
    cursor: pointer;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .error-message {
    font-size: 11px;
    line-height: 12px;
    margin-top: -5px;
    color: #d84a38;
  }

  .errorInput {
    border: 1px solid #d84a38 !important;
  }

  .grid-changer {
    width: 600px;
    margin: auto;
    background-color: white;
    border-radius: 20px;
    border-radius: 3px !important;
    padding: 20px;
    box-sizing: border-box;

    &-wrapper {
      width: 100%;
      height: 100vh;
      position: fixed;
      background-color: #00000070;
      display: flex;
      justify-content: center;
      z-index: 10;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }

  }

  .btn {
    margin: 2px;
  }

  .input {
    height: 20px !important;
    border-radius: 3px !important;

    &-values {
      display: flex;
      width: 100%;
      flex-wrap: wrap;

      &__item {
        width: 50%;
        padding: 10px;
        box-sizing: border-box;
      }
    }
  }

  .data-grid-container {
    overflow-x: auto;
  }

  @media (max-width: 1000px) {
    .data-grid-container {
      overflow-x: scroll;
    }
  }

  @media (max-height: 700px) {
    .grid-changer {
      &-wrapper {
        overflow: scroll;
      }
    }
  }

  @media (max-width: 500px) {
    .grid-changer-wrapper {
      overflow-y: scroll;
    }
    .input-change-values {
      flex-direction: column;
    }
  }


</style>
