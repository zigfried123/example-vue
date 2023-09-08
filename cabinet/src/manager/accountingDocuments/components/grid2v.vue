<template>
    <div class="grid md-layout-item">
        <span>Табличные данные</span>
        <div class="doc-ml--8" v-if="!isViewMode">
            <slot></slot>

            <md-button class="md-raised" @click="exportData" :disabled="showProgressBar">
                Экспорт
            </md-button>

            <div class="wrap-import">
                <md-field>
                    <label>Импорт</label>
                    <md-file v-model="importParams.importFile" :disabled="showProgressBar" @md-change="importData"/>
                </md-field>
            </div>

            <div class="wrap-cleart-table">
                <md-button class="md-raised md-accent"
                           @click="clearTable"
                           :disabled="showProgressBar"
                           title="Очистить таблицу">
                    <i class="icon-trash" aria-hidden="true"></i>
                </md-button>
            </div>
        </div>

        <data-tables :data="renderData" :pagination-props="{ pageSizes: [5, 10, 15] }">
            <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.label">
                <template slot-scope="scope">
                    <div v-html="scope.row[title.prop]"></div>
                </template>
            </el-table-column>
            <el-table-column v-if="!isViewMode"
                    fixed="right"
                    width="120">
                <template slot-scope="scope">
                    <el-button
                            @click.native.prevent="deleteRow(scope.row)"
                            type="text"
                            size="small">
                        <md-icon class="md-size-1x">delete</md-icon>
                    </el-button>

                    <el-button
                            @click.native.prevent="editRow(scope.row)"
                            v-if="isEditRowButton"
                            type="text"
                            size="small">
                        <md-icon class="md-size-1x">edit</md-icon>
                    </el-button>
                </template>
            </el-table-column>
        </data-tables>
    </div>
</template>

<script>
    const FileDownload = require('js-file-download');

    export default {
        data: () => ({
            exportParams: {
                processing: false,
                filename: 'export.xls',
            },
            importParams: {
                importFile: '',
            },
        }),
        props: {
            isViewMode: Boolean,
            titles: Array,
            urlImport: String,
            urlExport: String,
            isEditRowButton: Boolean,
        },
        computed: {
            renderData() {
                return this.$store.getters.RENDER_DATA;
            },
            gridInstanceName() {
                return this.$store.getters.GRID_INSTANCE_NAME;
            },
            showProgressBar() {
                return this.$store.getters.GET_PROCESSING;
            }
        },
        methods: {
            deleteRow(row) {
                let index = this.renderData.indexOf(row);
                this.$store.dispatch('REMOVE_ITEM_RAW_DATA', index);
            },
            editRow(row) {
                let index = this.renderData.indexOf(row);
                this.$emit('editRow', index);
            },
            clearTable() {
                this.$store.dispatch('CLEAR_RAW_DATA');
            },
            exportData() {
                this.$store.commit('SET_PROCESSING', true);
                let bodyFormData = new FormData();

                bodyFormData.set('export', JSON.stringify(this.$store.getters.RAW_DATA));
                bodyFormData.set('gridInstanceName', this.gridInstanceName);

                axios({
                    method: 'post',
                    url: this.urlExport,
                    data: bodyFormData,
                    responseType: 'blob',
                }).then((response) => {
                    FileDownload(response.data, this.exportParams.filename);
                    this.$store.commit('SET_PROCESSING', false);
                }).catch((e) => {
                    notify('Ошибка экспорта данных', 'danger');
                    this.$store.commit('SET_PROCESSING', false);
                });
            },
            importData() {
                this.$store.commit('SET_PROCESSING', true);
                let formData = new FormData();
                let file = this.importParams.importFile.target.files[0];

                formData.append('importFile', file);
                formData.append('gridInstanceName', this.gridInstanceName);

                axios({
                    method: 'post',
                    url: this.urlImport,
                    data: formData,
                    config: {header: {'Content-Type': 'multipart/form-data'}}
                }).then((response) => {
                    if (response.data.success) {
                        this.$store.dispatch('CLEAR_RAW_DATA');
                        this.$store.dispatch('PUT_RAW_DATA', response.data.gridData);
                    } else {
                        notify(response.data.error, 'danger');
                    }

                    this.$store.commit('SET_PROCESSING', false);
                })
                .catch((e) => {
                    notify('Ошибка импорта данных', 'danger');
                    this.$store.commit('SET_PROCESSING', false);
                });
            },
        }
    }
</script>

<style lang="scss">
    .el-table .cell {
        word-break: normal;
        font-size: 13px;
        text-align: center;
    }

    .wrap-import {
        max-width: 180px;
        display: inline-block;
        margin-top: -10px;
    }

    .wrap-cleart-table {
        display: inline-block;
        float: right;
    }

    .el-pagination__sizes {
        display: block !important;
    }
    .el-pagination .el-select .el-input {
        width: 160px;
    }
    .grid .el-input__inner {
        border-radius: 4px !important;
        border: 1px solid #DCDFE6 !important;
        color: #606266 !important;
        font-size: inherit !important;
        padding: 0 15px !important;
    }

    .grid .el-input.el-input--mini.el-input--suffix {
        margin-top: 2px;
        min-width: 125px;
    }

    .grid .wrap-import .md-input {
        cursor: pointer;
    }
</style>
