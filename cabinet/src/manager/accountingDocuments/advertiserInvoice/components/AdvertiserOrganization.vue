<template>
    <div class="md-layout md-gutter md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100 px-0">
        <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
            <select2 :disabled="isViewMode"
                     :value.sync="advertiserId"
                     is-load-data-on-init
                     :searchingUrl="urlAdvertiser()"
                     title="Рекламодатель"/>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
            <span>Организация рекламодателя</span>
            <md-field>
                <md-select v-model="advertiserOrganizationId"
                           name="organization"
                           required
                           :disabled="isViewMode || disabledOrganization"
                           placeholder="Организация рекламодателя">
                    <md-option v-for="(item, index) in availableOrganizations"
                               :key="item.value" :value="item.value">
                        {{item.label}}
                    </md-option>
                </md-select>
            </md-field>
        </div>
    </div>
</template>

<script>
    import docUrlsMixin from '../../mixins/docUrlsMixin';
    import Select2 from '../../../../common/components/select2/select2.vue';

    export default {
        mixins: [docUrlsMixin],
        props: {
            baseUrl: String,
            isViewMode: Boolean,
            advertiserId: String,
            advertiserOrganizationId: String,
        },
        components: {
            select2: Select2,
        },
        data: () => ({
            availableOrganizations: [],
        }),
        computed: {
            disabledOrganization() {
                return this.availableOrganizations.length === 0;
            }
        },
        created: function() {
            if (!!this.advertiserId) {
                this.updateAavailableOrganizations();
            }
        },
        watch: {
            advertiserId: function (value) {
                this.$emit('update:advertiserId', value);
                this.availableOrganizations = [];
                this.$emit('update:advertiserOrganizationId', '');

                if (!!value === false) {
                    return;
                }

                this.updateAavailableOrganizations();
            },
            advertiserOrganizationId: function (value) {
                this.$emit('update:advertiserOrganizationId', value);
            },
        },
        methods: {
            updateAavailableOrganizations() {
                axios.get(this.urlAdvertiserOrganization(this.advertiserId))
                    .then((response) => {
                        this.availableOrganizations = response.data.map(item => {
                            return {value: item.id, label: item.title.replace(/&quot;/g, '\"')};
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
    }
</script>


<style type="text/css">
    .px-0 {
        padding-left: 0px !important;
        padding-right: 0px !important;
    }
</style>