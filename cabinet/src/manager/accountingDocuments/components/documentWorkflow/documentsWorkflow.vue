<template>
    <md-card-content>

        <!--   Attach Adding Dialog    -->
        <add-attach :addAttachDialog.sync="addAttachDialog"
                    :PrintFormId="attachToAddPrintFormId"
                    :baseUrl="baseUrl"></add-attach>
        <!--   EOF Attach Adding Dialog     -->

        <!--   Attach Remove Dialog    -->
       <remove-attach v-if="attachToRemove !== null"
                      :removeAttachDialog.sync="removeAttachDialog"
                      :attachToRemove="attachToRemove"
                      :baseUrl="baseUrl"></remove-attach>
        <!-- EOF   Attach Remove Dialog    -->

        <md-table class="md-layout-item md-size-100">
            <md-table-toolbar>
                <h3 class="md-title">Печатные формы</h3>
            </md-table-toolbar>

            <md-table-row>
                <md-table-head>Название</md-table-head>
                <md-table-head>Статус</md-table-head>
                <md-table-head>Вложения</md-table-head>
                <md-table-head>Скачать</md-table-head>
            </md-table-row>

            <md-table-row v-for="(infoPrintForm, index) in printForms" :key="index">
                <md-table-cell>
                    <span class="md-subheading">
                        {{ infoPrintForm.name }}
                    </span>
                </md-table-cell>

                <md-table-cell>
                    <span class="md-body-2">
                        <span
                                v-if="infoPrintForm.printForm.data.statusTitle"
                                v-bind:style="{color: getStatusColor(infoPrintForm.printForm.data.statusCode)}">
                            ●
                        </span>
                        <b>{{ infoPrintForm.printForm.data.statusTitle || '-' }}</b>
                    </span>
                </md-table-cell>

                <md-table-cell>
                    <div v-if="isExistAttaches(infoPrintForm.printForm.data)">
                        <div v-for="(attach, indexAttach) in infoPrintForm.printForm.data.attach.data"
                             :key="indexAttach">
                             <span v-if="infoPrintForm.printForm.data.statusCode === 'not_signed'" @click="removeAttachDialogOnClick(attach)">
                                <md-icon  class="icon md-accent">delete</md-icon>
                                <md-tooltip md-direction="top">Удалить вложение</md-tooltip>
                           </span>
                            <span>
                                 <a :href="attach.url"
                                    target="_blank">
                                {{ attach.name }}
                            </a>
                            </span>
                        </div>
                    </div>
                    <div v-if="infoPrintForm.printForm.data.id && infoPrintForm.printForm.data.statusCode === 'not_signed'" @click="addAttachDialogOnClick(infoPrintForm.printForm.data.id)">
                        <md-button class="md-dense md-raised">добавить</md-button>
                    </div>
                </md-table-cell>

                <md-table-cell>
                    <md-chip
                            v-for="(converter, indexConverter) in infoPrintForm.converters" :key="indexConverter"
                            class="md-primary"
                            md-clickable>
                        <a :href="urlPrintForm(id, infoPrintForm.type, converter.code)"
                           target="_blank">
                            {{ converter.name }}
                        </a>
                    </md-chip>
                </md-table-cell>
            </md-table-row>

        </md-table>
    </md-card-content>
</template>

<script>
    import statusPrintForm from '../../helpers/StatusPrintForm';
    import docUrlsMixin from '../../mixins/newDocUrlsMixin';
    import {mapState} from 'vuex';

    import AddAttach from './attaches/addAttach.vue';
    import RemoveAttach from './attaches/removeAttach.vue';


    export default {
        name: "documentsWorkflow",
        mixins: [docUrlsMixin],
        components: {
            addAttach : AddAttach,
            removeAttach : RemoveAttach
        },
        data: () => ({
            removeAttachDialog: false,
            addAttachDialog: false,
            attachToAddPrintFormId: '',
            attachToRemove: null,
        }),

        computed: {
            ...mapState([
                'id',
                'printForms',
            ]),
        },
        methods: {
            getStatusColor(statusCode) {
                return statusPrintForm.getColor(statusCode);
            },
            isExistAttaches(printFormData) {
                return printFormData.attach && printFormData.attach.data.length > 0;
            },
            removeAttachDialogOnClick(attach) {
                this.attachToRemove = attach;
                this.removeAttachDialog = true;
            },
            addAttachDialogOnClick( printFormId) {
                this.attachToAddPrintFormId = parseInt(printFormId);
                this.addAttachDialog = true;
            },
        },
    }
</script>
<style>
    .icon {
        cursor: pointer;
    }
</style>