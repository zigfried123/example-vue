export default {

    data() {
        return {

        }
    },
    computed: {
        fields() {
            return this.$store.getters.getFields
        }
    },
    methods: {

        closeModal(modal) {
            gridComponent.closeModal(modal);
        },
        /**
         * Ajax запрос с параметрами
         * Результат вставляется в селект из которого сделан запрос
         * @param {String} query
         * as second arg
         * @param {Object} fieldObject
         */
        asyncFind(query = "") {
            let fieldObject = arguments[1];
            let url = fieldObject.selectConfig.url;
            let isLoading = fieldObject.selectConfig.isLoading = true;

            let queryParam = url + '?q=' + query;
            axios
                .get(queryParam)
                .then(response => {
                    if (response.status === 200) {
                        fieldObject.setSelectOptions(response.data);
                        isLoading = false;
                    }
                    if (response.status !== 200) {
                        notify(response.status, 'error ' + response.statusText);
                        isLoading = false;
                    }
                }).catch(error => {
                notify(error, 'error');
            });
        },
        /**
         * Get field by name
         * @param {String} fieldName
         * @returns {Field}
         */
        getField(fieldName) {
            return this.fields[fieldName]
        },
    }
};