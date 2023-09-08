<template>
        <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-50">
                <md-button
                        class="md-raised md-primary"
                        @click="$emit('clickOnSave')"
                        :disabled="disabled || !isValidData"
                        v-if="buttonSave">
                    Сохранить
                </md-button>

                <md-button
                        class="md-raised md-accent"
                        @click="$emit('clickOnSave', $event, true)"
                        :disabled="disabled || !isValidData"
                        v-if="buttonSaveAndExecute">
                    Сохранить и провести
                </md-button>

                <md-button
                        class="md-raised md-primary"
                        :href="urlEdit"
                        :disabled="disabled"
                        v-if="buttonEdit">
                    Изменить
                </md-button>
            </div>

            <div class="md-layout-item md-size-50 align-right">
                <md-button
                        class="md-raised md-accent"
                        :href="urlUnExecute"
                        :disabled="disabled"
                        v-if="buttonUnExecute">
                    Распровести
                </md-button>

                <md-button
                        class="md-raised md-accent"
                        :href="urlDelete"
                        :disabled="disabled"
                        v-if="buttonDelete">
                    Удалить
                </md-button>

                <md-button
                        class="md-raised md-primary"
                        :href="urlRestore"
                        v-if="buttonRestore">
                    Восстановить
                </md-button>
            </div>
        </div>
</template>

<script>
    import docStatusMixin from '../mixins/docStatusMixin';

    export default {
        name: "footer-doc",
        mixins: [docStatusMixin],
        props:{
            isViewMode: Boolean,

            status: String,

            urlEdit: String,
            urlUnExecute: String,
            urlDelete: String,
            urlRestore: String,

            canEdit : Boolean,
            canExecute: Boolean,
            canUnexecute: Boolean,

            disabled: Boolean,
            isValidData: Boolean,
        },
        computed : {
            buttonEdit() {
                return this.canEdit && this.isViewMode && this.isDraftStatus(this.status);
            },
            buttonSave() {
                return this.canEdit && !this.isViewMode && (this.isDraftStatus(this.status) || this.isEmptyStatus(this.status));
            },
            buttonSaveAndExecute() {
                return this.buttonSave && !this.isViewMode && (this.canExecute || this.isEmptyStatus(this.status));
            },
            buttonUnExecute() {
                return this.canUnexecute && this.isExecutedStatus(this.status);
            },
            buttonDelete() {
                return this.canEdit && this.isDraftStatus(this.status);
            },
            buttonRestore() {
                return this.canEdit && this.isDeleteStatus(this.status);
            },
        }
    }
</script>

<style type="text/css">
    .align-right {
        text-align: right;
    }
</style>
