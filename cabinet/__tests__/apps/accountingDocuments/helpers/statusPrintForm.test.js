import StatusHelper from '../../../../src/manager/accountingDocuments/helpers/StatusPrintForm';

describe('Check print form status', () => {
    it('Color', () => {
        var provider = providerStatusColor();

        for(let status in provider) {
            expect(StatusHelper.getColor(status)).toEqual(provider[status]);
        }
    });
});

function providerStatusColor() {
    return {
        signed: '#14ba8a',
        not_signed: '#f4d330',
        deleted: '#e92a5f',
    };
}