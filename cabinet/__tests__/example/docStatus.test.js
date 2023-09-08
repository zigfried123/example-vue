import docStatusMixin from '../../src/manager/accountingDocuments/mixins/docStatusMixin';

describe('Check documents status', () => {
    it('Draft', () =>{
        expect('Черновик').toEqual(docStatusMixin.methods.getStatusTitle(docStatusMixin.STATUS_DRAFT));
        expect('default').toEqual(docStatusMixin.methods.getStatusCssLabel(docStatusMixin.STATUS_DRAFT));
    });

    it('Executed', () =>{
        expect('Проведен').toEqual(docStatusMixin.methods.getStatusTitle(docStatusMixin.STATUS_EXECUTED));
        expect('success').toEqual(docStatusMixin.methods.getStatusCssLabel(docStatusMixin.STATUS_EXECUTED));
    });

    it('For deleted', () =>{
        expect('Помечен на удаление').toEqual(docStatusMixin.methods.getStatusTitle(docStatusMixin.STATUS_FOR_DELETE));
        expect('delete').toEqual(docStatusMixin.methods.getStatusCssLabel(docStatusMixin.STATUS_FOR_DELETE));
    });

    it('isDraftStatus', () =>{
        expect(true).toEqual(docStatusMixin.methods.isDraftStatus(docStatusMixin.STATUS_DRAFT));
        expect(false).toEqual(docStatusMixin.methods.isDraftStatus(docStatusMixin.STATUS_EXECUTED));
        expect(false).toEqual(docStatusMixin.methods.isDraftStatus(null));
        expect(false).toEqual(docStatusMixin.methods.isDraftStatus(''));
        expect(false).toEqual(docStatusMixin.methods.isDraftStatus(docStatusMixin.STATUS_FOR_DELETE));
    });

    it('isExecutedStatus', () =>{
        expect(true).toEqual(docStatusMixin.methods.isExecutedStatus(docStatusMixin.STATUS_EXECUTED));
        expect(false).toEqual(docStatusMixin.methods.isExecutedStatus(docStatusMixin.STATUS_DRAFT));
        expect(false).toEqual(docStatusMixin.methods.isExecutedStatus(null));
        expect(false).toEqual(docStatusMixin.methods.isExecutedStatus(''));
        expect(false).toEqual(docStatusMixin.methods.isExecutedStatus(docStatusMixin.STATUS_FOR_DELETE));
    });

    it('isDeleteStatus', () =>{
        expect(true).toEqual(docStatusMixin.methods.isDeleteStatus(docStatusMixin.STATUS_FOR_DELETE));
        expect(false).toEqual(docStatusMixin.methods.isDeleteStatus(docStatusMixin.STATUS_DRAFT));
        expect(false).toEqual(docStatusMixin.methods.isDeleteStatus(null));
        expect(false).toEqual(docStatusMixin.methods.isDeleteStatus(''));
        expect(false).toEqual(docStatusMixin.methods.isDeleteStatus(docStatusMixin.STATUS_EXECUTED));
    });

    it('isEmptyStatus', () =>{
        expect(false).toEqual(docStatusMixin.methods.isEmptyStatus(docStatusMixin.STATUS_FOR_DELETE));
        expect(false).toEqual(docStatusMixin.methods.isEmptyStatus(docStatusMixin.STATUS_DRAFT));
        expect(false).toEqual(docStatusMixin.methods.isEmptyStatus(docStatusMixin.STATUS_EXECUTED));
        expect(true).toEqual(docStatusMixin.methods.isEmptyStatus(null));
        expect(true).toEqual(docStatusMixin.methods.isEmptyStatus(''));
    });
});