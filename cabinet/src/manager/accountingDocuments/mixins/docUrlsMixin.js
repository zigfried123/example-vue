export default{
    methods: {
        urlSave: function(id) {
            if (!!id)
                return this.urlEdit(id);

            return this.baseUrl + '/create';
        },
        urlEdit: function(id) {
            return this.baseUrl + '/update/' + id;
        },
        urlDelete: function(id) {
            return this.baseUrl + '/delete/' + id;
        },
        urlView: function(id) {
            return this.baseUrl + '/view/' + id;
        },
        urlExecute: function(id) {
            return this.baseUrl + '/execute/' + id;
        },
        urlRestore: function(id) {
            return this.baseUrl + '/restore/' + id;
        },
        urlUnExecute: function(id) {
            return this.baseUrl + '/unexecute/' + id;
        },
        urlLoadData: function() {
            return this.baseUrl + '/load';
        },
        urlPreRenderRow: function() {
            return this.baseUrl + '/aliases';
        },
        urlImport: function() {
            return this.baseUrl + '/import';
        },
        urlExport: function() {
            return this.baseUrl + '/export';
        },
        urlTemplates: function(id) {
            return this.baseUrl + '/templates?documentId=' + id;
        },
        urlPrefill: function() {
            return this.baseUrl + '/prefill';
        },
        urlAffiliate: function () {
            return this.baseUrl + '/affiliate';
        },
        urlSystemAffiliate: function () {
            return this.baseUrl + '/system_affiliate';
        },
        urlAdvertiser: function() {
            return this.baseUrl + '/advertiser';
        },
        urlOffer: function () {
            return this.baseUrl + '/offer';
        },
        urlOurOrganization: function() {
            return this.baseUrl + '/organization?account_id=0&account_type=our';
        },
        urlOurOrganizationAccount: function(organizationId) {
            return this.baseUrl + '/organizationAccount?organization_id=' + organizationId;
        },
        urlAdvertiserOrganization: function(advertiserId) {
            return this.baseUrl + '/organization?account_id=' + advertiserId + '&account_type=buyer';
        },
        urlAdvertiserOffer: function(advertiserId) {
            return this.baseUrl + '/offer?adv_id=' + advertiserId;
        },
        urlAffiliateBalance: function() {
            return this.baseUrl + '/getAffiliateBalance';
        },
    }
}
