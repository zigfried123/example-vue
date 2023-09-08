<template>
    <div class="dialog-load-data">
        <md-dialog-title>Подбор данных</md-dialog-title>

        <div class="md-layout-item md-layout md-gutter">

            <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                <select2
                        :value="advertiser_id"
                        :searchingUrl="urlAdvertiser"
                        is-load-data-on-init
                        placeholder="Рекламодатель"/>
            </div>
        </div>

        <md-dialog-actions>
            <md-button class="md-accent" @click="closeDataSelection">Закрыть</md-button>
            <md-button class="md-primary" @click="addFilteredData">Добавить</md-button>
        </md-dialog-actions>
    </div>
</template>

<script>
    import Select2 from '../../../../common/components/select2/select2.vue';

    export default {
        name: 'dialog-load-data',
        components: {
            select2: Select2,
        },
        props: {
            baseUrl: String,
            urlLoadData: String,
        },
        data: () =>({
            advertiser_id: '',
        }),
        computed: {
            urlAdvertiser: function () {
                return this.baseUrl + '/advertiser';
            },
        },
        methods:{
            addFilteredData() {
                this.$store.commit('SET_PROCESSING', true);

                let formData = new FormData();
                formData.append('advertiser_id', this.advertiser_id);

                axios.post(this.urlLoadData, formData)
                    .then((response) => {
                        this.$store.dispatch('PUT_RAW_DATA', response.data);
                        this.$emit('closeDataSelection');
                        this.$store.commit('SET_PROCESSING', false);

                        if (response.data.length == 0) {
                            notify('Данные для загрузки отсутствуют', 'danger');
                        }
                    })
                    .catch((e) => {
                        notify(e.response.data.error, 'danger');
                        this.$store.commit('SET_PROCESSING', false);
                    });
            },
            closeDataSelection(){
                this.$emit('closeDataSelection');
            }
        }

    }
</script>

<style scoped>
    .dialog-load-data {
        padding-top: 30px;
    }
</style>
