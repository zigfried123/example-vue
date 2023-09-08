/**
 * Модель типов выплат
 */
import Loader from "./Loader";
import PaymentTypeForm from "./PaymentTypeForm";

/**
 * Состояния выплаты
 * @type {string}
 */
export const STATE_NONE = 'none',
    STATE_EDIT = 'edit';

export default class PaymentType {

    /**
     * PaymentType constructor
     */
    constructor(code) {
        this.code = code;
        this.title = '';
        this.badge = '';
        this.description = '';
        this.shortDescription = '';
        this.isRecommended = false;
        this.canBeDefault = true;
        this.state = STATE_NONE;
        this.isLoading = false;
        this.paymentAccounts = [];
        this.widgets = {};
        this.form = new PaymentTypeForm(this);
        this.affiliateCommission = '';
        this.requestPayoutDays = '';

    }

    /**
     * @returns {string}
     */
    static get STATE_NONE() {
        return STATE_NONE;
    }

    /**
     * @returns {string}
     */
    static get STATE_EDIT() {
        return STATE_EDIT;
    }

    /**
     * Установка заголовка
     * @param {string} string
     */
    setTitle(string) {
        this.title = string;
        return this;
    }

    /**
     * Установка бэйджа
     * @param {string} string
     */
    setBadge(string) {
        this.badge = string;
        return this;
    }

    /**
     * Установка описания
     * @param {string} string
     */
    setDescription(string) {
        this.description = string;
        return this;
    }

    /**
     * Установка описания
     * @param {string} string
     */
    setShortDescription(string) {
        this.shortDescription = string;
        return this;
    }

    /**
     * Установка описания
     * @param {boolean} bool
     */
    setIsRecommended(bool) {
        this.isRecommended = bool;
        return this;
    }
    /**
     * Установка значения платежа по-умолчанию
     * @param {number} value
     */
    setCanBeDefault(value) {
        this.canBeDefault = !!value;
        return this;
    }

    /**
     * Установка состояния на редактирование
     */
    stateEdit() {
        this.state = STATE_EDIT;
        return this;
    }

    /**
     * Установка без состояния
     */
    stateNone() {
        this.state = STATE_NONE;
        return this;
    }

    /**
     * Установка размера комиссии
     * @param {string} string
     */
    setAffiliateCommission (string) {
       this.affiliateCommission = string;
       return this;
    }

    /**
     * Установка срока выплаты
     * @param {string} value
     */
    setRequestPayoutDays(value) {
        this.requestPayoutDays = value;
        return this;
    }

    /**
     * Отдает форму
     * @returns {PaymentTypeForm}
     */
    getForm() {
        return this.form;
    }


}
