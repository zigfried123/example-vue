/**
 *
 */

export default class PaymentGroup {

    /**
     * PaymentGroup constructor
     * @param {String} code
     * @param {String} title
     * @param {String} shortDescription
     * @param {PaymentType[]} paymentTypeCodes
     * @param {bool} collapsed
     */
    constructor(
        code,
        title,
        shortDescription,
        paymentTypeCodes = [],
        collapsed = false
    ) {
        this.code = code;
        this.title = title;
        this.shortDescription = shortDescription;
        this.paymentTypeCodes = paymentTypeCodes;
        /**
         *
         * @type {PaymentType[]}
         */
        this.paymentTypes = {};
        this.collapsed = collapsed;
    }

    setPaymentType(paymentTypeCode, paymentTypeObject) {
        this.paymentTypes[paymentTypeCode] = paymentTypeObject;
        return this;
    }

}
