<template>
    <div>
        <md-autocomplete
                :class="validationClass"
                v-bind="$attrs"
                v-model="searchTerm"
                :md-options="options"
                @md-selected="onItemSelected"
                @md-changed="onInputChanged(searchTerm)"
                @md-closed="onDropdownClosed"
                @md-opened="initWithValue"
                :md-input-placeholder="title">
             <span class="md-error" v-if="form && !form[this.field].required">
                                Необходимо ввести {{title}}
                             </span>
            <div v-if="loading" class="wrap-loading-progress">
                <md-progress-bar md-mode="indeterminate"/>
            </div>
            <template slot="md-autocomplete-item" slot-scope="{ item, term }">
                <md-highlight-text :md-term="term">{{ item }}</md-highlight-text>
            </template>
        </md-autocomplete>

    </div>
</template>

<script>
    import he from 'he';

    export default {
        name: 'select3',
        data: () => ({
            searchTerm: null,
            items: [],
            loading: false,
            versionQuery: 0,
        }),
        props: {
            value: {
                type: null,
                required: true
            },
            title: String,
            searchingUrl: String,
            isLoadDataOnInit: Boolean,
            validationClass: Object,
            field: String,
            form: Object
        },
        computed: {
            options() {
                return this.items.map(item => {
                    return item.label;
                });
            },
        },
        watch: {
            value (val) {
                this.initWithValue(val);
            }
        },
        mounted: function() {
            if (this.isLoadDataOnInit && !!this.value === false) {
                this.remoteMethod('');
            }

            this.$nextTick(function () {
                if (!!this.value) {
                    this.initWithValue(this.value);
                }
            })
        },
        methods: {
            onItemSelected(label) {
                let item = this.items.find(item => {
                    return item.label === label;
                });

                this.$emit('onTouchField', this.field);

                this.$emit('update:value', item.value);
            },
            onInputChanged(searchTerm) {
                if(!searchTerm){
                    this.searchTerm = '';
                    this.$emit('update:value', '');
                }
                this.remoteMethod(searchTerm);
            },
            onDropdownClosed() {
                let item = this.items.find(item => {
                    return item.label === this.searchTerm;
                });

                if (!!item === false) {
                    this.searchTerm = '';
                    this.$emit('update:value', '');
                }
            },
            clear() {
                this.change('');
                this.remoteMethod('');
            },
            remoteMethod(query) {
                this.loading = true;
                this.versionQuery++;

                let currentVersionQuery = this.versionQuery;

                let amp = this.searchingUrl.indexOf('?') < 0 ? '?' : '&';
                const queryParam = this.searchingUrl + amp + 'q=' + query;

                axios.get(queryParam)
                    .then(response => {

                        if (currentVersionQuery !== this.versionQuery) {
                            return;
                        }

                        this.loading = false;

                        let list = response.data.map(item => {
                            return this.toOption(item.id, item.title);
                        });

                        this.items = list.filter(item => {
                            return item.label.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                    })
                    .catch(error => {
                        console.error(error);
                        this.loading = false;
                    });
            },
            initWithValue(value) {
                if (!!value === false) {
                    return;
                }

                this.loading = true;

                let formData = new FormData();
                formData.append('id', value);

                axios.post(this.searchingUrl, formData)
                    .then(response => {
                        this.loading = false;

                        this.items = [];
                        this.items.push(this.toOption(response.data.id, response.data.title));

                        let item = this.items.find(item => {
                            return item.value == value;
                        });

                        this.searchTerm = item.label;
                    })
                    .catch(error => {
                        this.loading = false;
                        console.error(error);
                    });
            },
            toOption(val, text) {
                return {
                    value: val,
                    label: he.decode(text)
                };
            },
        }
    }
</script>

<style scoped>
    .wrap-loading-progress {
        width: 100%;
        position: absolute;
    }


</style>

<style>
    .md-menu-content {
        z-index: 11;
    }
</style>
