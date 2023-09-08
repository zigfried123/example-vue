<template>
    <div class="md-layout md-gutter md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100 px-0">
        <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
            <span>Наша организация</span>
            <md-field>
                <md-select v-model="organizationId"
                           name="organizationId"
                           required
                           :disabled="isViewMode"
                           placeholder="Наша организация"
                           @md-selected="changeOrganization">
                    <md-option v-for="(item, index) in availableOurOrganizations"
                               :key="item.value" :value="item.value">
                        {{item.label}}
                    </md-option>
                </md-select>
            </md-field>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
            <span>Счет нашей организации</span>
            <md-field>
                <md-select v-model="organizationAccount"
                           name="organizationAccount"
                           required
                           :disabled="isViewMode || disabledOrganizationAccount"
                           placeholder="Счет нашей организации"
                            @md-selected="changeOrganizationAccount">
                    <md-option v-for="(item, index) in availableOurOrganizationAccounts"
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

    export default {
        mixins: [docUrlsMixin],
        props: {
            baseUrl: String,
            isViewMode: Boolean,
            organizationId: String,
            organizationAccount: String,
        },
        data: () => ({
            availableOurOrganizations: [],
            availableOurOrganizationAccounts: [],
        }),
        computed: {
            disabledOrganizationAccount() {
                return this.availableOurOrganizationAccounts.length === 0;
            }
        },
        created: function () {
            axios.get(this.urlOurOrganization())
                .then((response) => {
                    this.availableOurOrganizations = response.data.map(item => {
                        return {value: item.id, label: item.title.replace(/&quot;/g, '\"')};
                    });
                })
                .catch((error) => {
                    console.error(error);
                });

            if (!!this.organizationId) {
                this.updateAvailableOurOrganizationAccounts();
            }
        },
        methods: {
            changeOrganization(value) {
                this.$emit('update:organizationId', value);
                this.updateAvailableOurOrganizationAccounts();
                this.availableOurOrganizationAccounts = [];
                this.changeOrganizationAccount('');
            },
            changeOrganizationAccount(value) {
                this.$emit('update:organizationAccount', value);
            },
            updateAvailableOurOrganizationAccounts() {
                axios.get(this.urlOurOrganizationAccount(this.organizationId))
                    .then((response) => {
                        this.availableOurOrganizationAccounts = response.data.map(item => {
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