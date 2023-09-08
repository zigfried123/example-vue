/**
 *
 */

export const STATE_ACTIVE = 'active',
    STATE_DISABLED = 'disabled';

export default class PaymentAccount {
    /**
     * PaymentType constructor
     */
    constructor() {
        this.id = null;
        this.title = '';
        this.details = {};
        this.icon = '';
        this.state = STATE_ACTIVE;
        this.isDefault = false;
        this.isLoading = false;
        this.needReload = false;
    }

    static get STATE_ACTIVE() {
        return STATE_ACTIVE;
    }

    static get STATE_DISABLED() {
        return STATE_DISABLED;
    }

    /**
     * Установка ID
     * @param {number} value
     */
    setId(value) {
        this.id = value;
        return this;
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
     * Установка полной инфо
     * @param {object} details
     */
    setDetails(details) {
        this.details = details;
        return this;
    }

    /**
     * Установка состояния
     * @param {string} string
     */
    setState(string) {
        this.state = string;
        return this;
    }

    setNeedReload(value) {
        this.needReload = !!value;
        return this;
    }

    setIsDefault(value) {
        this.isDefault = !!value;
        return this;
    }

    isActive() {
        return this.state === STATE_ACTIVE;
    }

    toggleState()
    {
        // TODO
    }
}
