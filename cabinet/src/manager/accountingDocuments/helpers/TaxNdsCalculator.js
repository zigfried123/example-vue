export default class TaxNdsCalculator {

    constructor() {
        this.taxes = {
            no_nds: {
                multiplier: '0.00',
                divider: '1.00',
                inAmount: true
                },
            nds0: {
                multiplier: '0.00',
                divider: '1.00',
                inAmount: true
                },
            nds18:{
                multiplier: '20.00',
                divider: '100.00',
                inAmount: false
            },
            nds118: {
                multiplier: '20.00',
                divider: '120.00',
                inAmount: true
            },
            nds120: {
                multiplier: '20.00',
                divider: '120.00',
                inAmount: true
            }
        };
    }

    /**
     * @param {string} type
     * @param {string} amount
     * @returns {string}
     */
    calcNds (type, amount) {
        let dividedAmount = parseFloat(amount) / parseFloat(this.taxes[type].divider);
        return (parseFloat(dividedAmount) * parseFloat(this.taxes[type].multiplier)).toFixed(2);
    }
}