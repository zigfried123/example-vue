<template>
    <md-dialog :md-active.sync="removeAttachDialog">
        <md-dialog-title>Удалить вложение?</md-dialog-title>
        <div class="md-layout-item md-layout md-gutter">
            <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                        <span>
                                 <a :href="attachToRemove.url"
                                    target="_blank">
                                {{ attachToRemove.name }}
                            </a>
                            </span>
            </div>
        </div>

        <md-dialog-actions>
            <md-button class="md-primary" @click="$emit('update:removeAttachDialog', false)">Отмена</md-button>
            <md-button class="md-primary" @click="removeAttach">Удалить</md-button>
        </md-dialog-actions>
    </md-dialog>
</template>

<script>
    import {mapActions} from 'vuex';
    import docUrlsMixin from '../../../mixins/newDocUrlsMixin';

    export default {
        name: "removeAttach",
        mixins: [docUrlsMixin],
        props: {
            removeAttachDialog: false,
            attachToRemove: null
        },
        methods: {
            ...mapActions({
                removeAttachAction: 'REMOVE_ATTACH'
            }),
            getValidationClass (fieldName) {
                const field = this.$v[fieldName];

                if (field) {
                    return {
                        'md-invalid': field.$invalid && field.$dirty
                    }
                }
            },
            removeAttach() {
                this.attachToRemove.attachRemoveUrl = this.urlRemoveAttach();
                this.attachToRemove.docUrl = this.urlDocument(this.extractDocumentId())
                this.removeAttachAction(this.attachToRemove);
                this.$emit('update:removeAttachDialog', false);
            },
            extractDocumentId: function () {
                return window.location.pathname.split("/")[4];
            },
        },

    }
</script>


<style scoped>

</style>