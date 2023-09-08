import Translate from '../helpers/Translate';

export default {
    methods:{
        saveFormData(url, formData, saveAndExecute) {
            axios.post(url, formData)
                .then((response) => {
                    let id =  formData.id || response.data.id || response.data.data.id;
                    if (saveAndExecute) {
                        axios.get(this.urlExecute(id))
                            .then((responseExecute) =>{
                                window.location.href = this.urlView(id);
                                this.$store.commit('SET_PROCESSING', false);
                            }).catch((e) => {
                                this.$store.commit('SET_PROCESSING', false);
                                this.errorCatcher(e);
                        });
                    } else {
                        window.location.href = this.urlView(id);
                        this.$store.commit('SET_PROCESSING', false);
                    }
                }).catch(this.errorCatcher);
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
        errorCatcher(e){

            if (e.response.data.message) {
                notify(Translate.t(e.response.data.message), 'danger');
            }

            if (e.response.data.errors) {
               let values = Object.values(e.response.data.errors);
                for (let error in values) {
                    notify(Translate.t(values[error]), 'danger');
                }
            }

            this.$store.commit('SET_PROCESSING', false);
        },
        getDocumentData(url, fields, form){
            axios.get(url)
                .then((response) => {

                    let data = response.data;

                    for (let field in fields) {
                        this[field] = data[fields[field]];
                        if(form[field] != undefined) {
                            form[field].$touch();
                        }
                    }

                    if (!Object.keys(data).length) {
                        notify('Данные для загрузки отсутствуют', 'danger');
                    }
                })
                .catch((e) => {
                    notify(e.response.data.error, 'danger');
                    this.$store.commit('SET_PROCESSING', false);
                });
        },
        unExecuteDocument(id){

            let url = this.urlUnExecute(id);

            axios.get(url)
                .then((responseExecute) => {
                    window.location.href = this.urlView(id);
                    this.$store.commit('SET_PROCESSING', false);
                }).catch((e) => {
                this.$store.commit('SET_PROCESSING', false);
                notify(Translate.t(e.response.data.message), 'danger');
                this.errorCatcher(e);
            });
        }
    }
}
