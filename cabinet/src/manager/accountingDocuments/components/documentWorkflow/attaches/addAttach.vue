<template>
    <md-dialog :md-active.sync="addAttachDialog">
        <md-dialog-title>Добавить вложение</md-dialog-title>
        <div class="md-layout-item md-layout md-gutter">

            <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">

                <div class="wrap-import">
                <md-field >
                    <label>Вложение</label>
                    <md-file @md-change="selectFileEvent"/>
                </md-field>
                </div>
            </div>
            <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                <md-field :class="getValidationClass('attachToAdd')">
                    <label>Название вложения</label>
                    <md-input required
                              md-counter="255"
                              v-model="attachToAdd.name"/>
                    <span class="md-error" v-if="!$v.attachToAdd.name.required">Обязательное поле</span>
                </md-field>
            </div>
        </div>

        <md-dialog-actions>
            <md-button class="md-primary" @click="$emit('update:addAttachDialog', false)">Закрыть</md-button>
            <md-button class="md-primary" @click="saveAttach">Добавить</md-button>
        </md-dialog-actions>
    </md-dialog>
</template>

<script>
    import { validationMixin } from 'vuelidate';
    import {
        required,
    } from 'vuelidate/lib/validators';
    import {mapActions} from 'vuex';
    import docUrlsMixin from '../../../mixins/newDocUrlsMixin';




    export default {
        name: "addAttach",
        mixins: [docUrlsMixin],
        props: {
            addAttachDialog: false,
            PrintFormId: '',
        },
        data: () => ({
            attachToAdd: {
                name: '',
                file: null,
                url: null,
                printFormId: null,
                docUrl: null
            },
        }),
        validations: {
            attachToAdd: {
                name:{
                    required,
                },
            },
        },
        methods: {
            ...mapActions({
                addAttach: 'ADD_ATTACH',
            }),
            getValidationClass (fieldName) {
                const field = this.$v[fieldName];

                if (field) {
                    return {
                        'md-invalid': field.$invalid && field.$dirty
                    }
                }
            },
            saveAttach() {
                this.$v.$touch();

                if (this.$v.$invalid) {
                    return;
                }

                this.attachToAdd.url = this.urlAddAttach();
                this.attachToAdd.docUrl = this.urlDocument(this.extractDocumentId());
                this.attachToAdd.printFormId = this.PrintFormId;
                this.addAttach(this.attachToAdd);
                this.$emit('update:addAttachDialog', false);
                this.clearAttachToAdd();
            },

            selectFileEvent(event) {
                this.attachToAdd.file = event[0];
            },
            clearAttachToAdd(){
                this.attachToAdd.name =  '';
                this.attachToAdd.file =  null;
                this.attachToAdd.url =  null;
                this.attachToAdd.printFormId =  null;
                this.attachToAdd.docUrl =  null;
            },
            extractDocumentId: function () {
                return window.location.pathname.split("/")[4];
            },
        },

    }
</script>

<style>
    .wrap-import .md-input {
        cursor: pointer;
    }
</style>