import StatusHelper from '../../../../src/apps/contractors/helpers/StatusHelper';

describe('Check self employed status', () => {
    it('Color', () => {
        var provider = providerStatusColor();

        for(let status in provider) {
            expect(provider[status]).toEqual(StatusHelper.getColor(status));
        }
    });

    it('Is Active', () => {
        var provider = providerStatus();

        for(let status in provider.active) {
            expect(provider.active[status]).toEqual(StatusHelper.isActive(status));
        }
    });

    it('Is moderate', () => {
        var provider = providerStatus();

        for(let status in provider.moderate) {
            expect(provider.moderate[status]).toEqual(StatusHelper.isModerate(status));
        }
    });

    it('Is declined', () => {
        var provider = providerStatus();

        for(let status in provider.declined) {
            expect(provider.declined[status]).toEqual(StatusHelper.isDeclined(status));
        };
    });

    it('Is deleted', () => {
        var provider = providerStatus();

        for(let status in provider.deleted) {
            expect(provider.deleted[status]).toEqual(StatusHelper.isDeleted(status));
        };
    });
});

function providerStatusColor() {
    return {
        active: '#14ba8a',
        moderate: '#f4d330',
        declined: '#f4d330',
        deleted: '#e92a5f' ,
    };
}

function providerStatus() {
    return {
        active: {
            active: true,
            moderate: false,
            declined: false,
            deleted: false,
        },
        moderate: {
            active: false,
            moderate: true,
            declined: false,
            deleted: false,
        },
        declined: {
            active: false,
            moderate: false,
            declined: true,
            deleted: false,
        },
        deleted: {
            active: false,
            moderate: false,
            declined: false,
            deleted: true,
        },
    };
}