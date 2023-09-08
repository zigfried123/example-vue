export default {
    methods:{
        saveFormData(url, formData, saveAndExecute) {
            axios.post(url, formData)
                .then((response) => {
                    this.$store.commit('SET_PROCESSING', false);
                    let id =  response.data.id || response.data.data.id;
                    if (saveAndExecute) {
                        window.location.href = this.urlExecute(id);
                    } else {
                        window.location.href = this.urlView(id);
                    }
                }).catch((e) => {
                for (let field in e.response.data.errors) {
                    try {
                        for(let error in e.response.data.errors[field]){
                            notify(e.response.data.errors[field][error], 'danger');
                        }
                    } catch (exception) {
                        console.error(exception);
                    }
                }
                this.$store.commit('SET_PROCESSING', false);
            });
        },
        loadDataForGrid(url, formData) {
            this.$store.commit('SET_PROCESSING', true);
            axios.post(url, formData)
                .then((response) => {
                    this.$store.dispatch('CLEAR_RAW_DATA');
                    this.$store.dispatch('PUT_RAW_DATA', response.data);
                    if (response.data.length == 0) {
                        notify('Данные для загрузки отсутствуют', 'danger');
                    }
                })
                .catch((e) => {
                    notify(e.response.data.error, 'danger');
                    this.$store.commit('SET_PROCESSING', false);
                });
        },
    }
}