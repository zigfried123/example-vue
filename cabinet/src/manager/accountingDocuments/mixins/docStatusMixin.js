const DRAFT = "draft";
const EXECUTED = "executed";
const FOR_DELETE = "for_delete";

export default {
    STATUS_DRAFT: DRAFT,
    STATUS_EXECUTED: EXECUTED,
    STATUS_FOR_DELETE: FOR_DELETE,
    methods: {
        getStatusTitle(status) {
            let titles = new Array();
            titles[DRAFT] = 'Черновик';
            titles[EXECUTED] = 'Проведен';
            titles[FOR_DELETE] = 'Помечен на удаление';

            return titles[status];
        },
        getStatusCssLabel(status) {
            let titles = new Array();

            titles[DRAFT] = 'default';
            titles[EXECUTED] = 'success';
            titles[FOR_DELETE] = 'delete';

            return titles[status];
        },
        isDraftStatus(status) {
            return status === DRAFT;
        },
        isExecutedStatus(status) {
            return status === EXECUTED;
        },
        isDeleteStatus(status) {
            return status === FOR_DELETE;
        },
        isEmptyStatus(status) {
            return !!status === false;
        },
    }

}