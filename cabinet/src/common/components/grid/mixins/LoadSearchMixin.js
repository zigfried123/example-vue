
export default {
    data() {
        return {
            inputsToFilter: []
        }
    },
    methods: {

        /**
         * Загрузка результатов филтра
         * @param append
         */
        loadSearch(append = false) {
            let formData = new FormData();
            if (!this.validateFilter()) {
                return;
            }
            for (let fieldName in this.inputsToFilter) {
                formData.set(fieldName, this.inputsToFilter[fieldName]);
            }
            let dataPut = gridComponent.putData;
            let dataAliasesPut = gridComponent.putDataAliases;
            let dataAdd = gridComponent.addDataRows;
            let gridData = gridComponent.$store.getters.getData;

            axios({
                method: 'POST',
                url: this.baseUrl + '/load',
                header: {
                    processData: false,
                    contentType: false
                },
                data: formData
            }).then(response => {
                if (response.data.length === 0) {
                    notify('Ничего не найдено!', 'warning');
                    if (append) {
                        return;
                    }
                }
                if (response.data.error) {
                    notify(response.data.error, 'error');
                    return;
                }

                if (append) {
                    dataAdd(response.data);
                } else {
                    dataPut(response.data);
                }
            }).catch(function (error) {
                notify(error, 'error');
                return false;
            });
            this.showFilterModal = false;
        },


        /**
         * Валидация формы фильтра
         * @return {boolean}
         */
        validateFilter() {
            let isValid = true;
            for (let columnName in this.filterFields) {
                let value = this.inputsToFilter[columnName];
                let field = this.getFilterField(columnName);
                if (!field.validate(value)) {
                    this.$set(this.fields[columnName], 'state', field.state);
                    isValid = false
                }
            }
            return isValid;
        },

        /**
         * Get field by name
         * @param {String} fieldName
         * @returns {Field}
         */
        getFilterField(fieldName) {
            return this.filterFields[fieldName];
        },
    }
}