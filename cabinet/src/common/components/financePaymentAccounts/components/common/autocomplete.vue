<template>
    <div>
        <md-autocomplete
                :class="messageClass"
                v-model="title"
                :md-options="collection"
                @md-changed="onChanged"
                @md-opened="onOpened"
                @md-selected="onSelected"
        >
            <label>{{ label }}</label>

            <template slot="md-autocomplete-item" slot-scope="{ item }">
                {{ item.title }}
            </template>
            <template slot="md-autocomplete-empty" slot-scope="{ term }">
                <span v-if="term">
                    По запросу "{{ term }}" ничего не найдено
                </span>
                <span v-else>
                    Введите миниум {{ minLength }} символа для поиска...
                </span>

            </template>
            <span class="md-helper-text">{{ helpText }}</span>
            <span class="md-error">{{ error }}</span>
        </md-autocomplete>

        <div v-if="multiple">
            <md-chip
                    v-for="(selectedItem, key) in selectedMultiple"
                    :key="key"
                    class="md-primary"
                    md-deletable
                    @md-delete="unselectItem(selectedItem.id)"
            >
                {{ selectedItem.title }}
            </md-chip>
        </div>
    </div>
</template>

<script>
    import Loader from "../../classes/Loader";

    export default {
        name: "autocomplete",
        props: {
            minLength: {
                type: Number,
                default: 3
            },
            label: {
                type: String,
                default: ''
            },
            action: {
                type: String,
                default: 'search'
            },
            helpText: {
                type: String,
                default: ''
            },
            multiple: {
                type: Boolean,
                default: false
            },
            error: {
                type: String,
                default: null
            },
            parent: {}
        },
        data: () => ({
            collection: [],
            title: '',
            id: null,
            selected: null,
            selectedMultiple: [],
            model: null
        }),
        computed: {
            messageClass() {
                return {
                    'md-invalid': this.error
                }
            },
        },
        mounted() {
            if (this.model !== null) {
                let _context = this;

                if (typeof this.model === 'number') {
                    this.asyncSearch('id', this.model)
                        .then(function (response) {
                            if (response.data === undefined) {
                                _context.error = 'Не удалось загрузить результаты поиска...';
                                return;
                            }
                            _context.selected = response.data;
                            console.log(_context.selected);
                            _context.title = response.data.title;
                            _context.id = response.data.id;
                        });
                    return;
                }

                if (this.model instanceof Array) {
                    for (let id of this.model) {
                        this.asyncSearch('id', id)
                            .then(function (response) {
                                if (response.data === undefined) {
                                    _context.error = 'Не удалось загрузить результаты поиска...';
                                    return;
                                }
                                _context.selectedMultiple.push(response.data);
                                _context.title = '';
                                _context.id = '';
                            });
                    }
                    return;
                }
            }
        },
        methods: {
            asyncSearch(key, value) {
                let data = {};
                data[key] = value;
                return new Loader()
                    .setUrl(this.$store.getters.getBaseUrl + this.action)
                    .setData(data)
                    .setMethod('GET')
                    .run()
            },
            onChanged(searchTerm) {
                if (searchTerm.length < this.minLength) {
                    return;
                }

                let _context = this;
                this.asyncSearch('q', searchTerm)
                    .then(function (response) {
                        if (response.data === undefined) {
                            _context.error = 'Не удалось загрузить результаты поиска...';
                            return;
                        }
                        _context.collection = response.data;
                    })
            },
            onSelected(searchTerm) {
                console.log('onSelected');
                let selectedObject = this.findObject(searchTerm.id);

                if (!selectedObject) {
                    this.$set(this, 'title', '');
                    this.$set(this, 'id', null);
                    return;
                }

                this.$set(this, 'title', selectedObject.title);
                this.$set(this, 'id', selectedObject.id);

                if (this.multiple) {
                    this.selectedMultiple.push(selectedObject);
                    this.title = '';

                } else {
                    this.$set(this, 'selected', selectedObject);
                }

                this.collection = [];

            },
            onOpened(item) {

            },
            findObject(id) {
                let selectedObject = null;
                for (let object of this.collection) {
                    if (object.id === id) {
                        selectedObject = object;
                    }
                }
                return selectedObject;
            },
            buildModel() {
                if (this.multiple) {
                    let ret = [];
                    for (let item of this.selectedMultiple) {
                        ret.push(item.id);
                    }
                    return ret;
                } else if (this.selected !== null) {
                    return this.selected.id;
                } else {
                    return null;
                }
            },
            unselectItem(id) {
                let selectedObjects = this.selectedMultiple;
                for (let key in this.selectedMultiple) {
                    let item = this.selectedMultiple[key];
                    if (item.id === id) {
                        this.selectedMultiple.splice(key, 1);
                    }
                }
            },
            getParent() {
                return !this.parent ? this.$parent : this.parent;
            }
        },
        watch: {
            title: function (value) {
                if (!this.selected || !value) {
                    this.$set(this, 'selected', null);
                    this.collection = [];
                    return;
                }
                if (value !== this.selected.title) {
                    this.$set(this, 'selected', null);
                    this.$set(this, 'title', '');
                    this.$set(this, 'id', null)
                    this.collection = [];
                }
            },
            selected: function (value) {
                this.$set(this, 'model', this.buildModel());
            },
            selectedMultiple: function (value) {
                this.$set(this, 'model', this.buildModel());
            },
            model: function (newValue, oldValue) {
                let key = this.$vnode.key;
                console.log(this.getParent());
                if (this.getParent() !== undefined && this.getParent().model !== undefined) {
                    this.getParent().setModel(newValue, key)
                }
            }
        }
    };
</script>
