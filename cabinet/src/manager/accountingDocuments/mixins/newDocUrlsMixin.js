export default {
    props: {
        baseUrl: String,
    },
    methods: {
        urlList: function () {
            return this.baseUrl + '/list';
        },
        urlAddAttach: function () {
            return this.baseUrl + '/addAttach';
        },
        urlRemoveAttach: function () {
            return this.baseUrl + '/removeAttach';
        },
        urlSave: function (id) {
            if (!!id)
                return this.urlUpdate(id);

            return this.baseUrl + '/createAjax';
        },
        urlEdit: function (id) {
            return this.baseUrl + '/update/' + id;
        },
        urlUpdate: function (id) {
            return this.baseUrl + '/updateAjax/' + id;
        },
        urlDelete: function (id) {
            return this.baseUrl + '/deleteAjax/' + id;
        },
        urlView: function (id) {
            return this.baseUrl + '/view/' + id;
        },
        urlExecute: function (id) {
            return this.baseUrl + '/executeAjax/' + id;
        },
        urlRestore: function (id) {
            return this.baseUrl + '/restoreAjax/' + id;
        },
        urlUnExecute: function (id) {
            return this.baseUrl + '/unExecuteAjax/' + id;
        },
        urlLoadData: function () {
            return this.baseUrl + '/load';
        },
        urlPreRenderRow: function () {
            return this.baseUrl + '/aliases';
        },
        urlImport: function () {
            return this.baseUrl + '/import';
        },
        urlExport: function () {
            return this.baseUrl + '/export';
        },
        urlTemplates: function (id) {
            return this.baseUrl + '/templates/' + id;
        },
        urlPrefill: function () {
            return this.baseUrl + '/prefill';
        },
        urlAffiliate: function () {
            return this.baseUrl + '/affiliate';
        },
        urlAdvertiser: function () {
            return this.baseUrl + '/advertiser';
        },
        urlAdvertiserOffer: function () {
            return this.baseUrl + '/offer';
        },
        urlOffer: function () {
            return this.baseUrl + '/offer';
        },
        urlOurOrganization: function () {
            return this.baseUrl + '/organization?account_type=our';
        },
        urlAffiliateOrganization: function () {
            return this.baseUrl + '/organization?account_type=seller';
        },
        urlAffiliateSelfEmployed: function () {
            return this.baseUrl + '/selfemployed';

        },
        urlDocument: function (id) {
            return this.baseUrl + '/getDocument?id=' + id;
        },
        urlPrintForm: function (id, type, code) {
            return this.baseUrl + `/getPrintForm/${id}?type=${type}&code=${code}`;
        },
    }
}