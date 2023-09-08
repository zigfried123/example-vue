import Loader from "./Loader";
import PaymentTypeFormWidget from "./PaymentTypeFormWidget";


export default class PaymentTypeForm {

    /**
     * @param {PaymentType} paymentType
     */
    constructor(paymentType) {
        this.paymentType = paymentType;
        this.isLoading = false;
        this.widgetsData = null;
        this.widgets = {};
        this.data = {};
    }

    getWidgetsData() {
        return this.widgetsData;
    }

    getWidgets() {
        let widgetsData = this.getWidgetsData();
        for (let key in widgetsData) {
            if (!widgetsData.hasOwnProperty(key)) {
                continue;
            }
            let widgetData = widgetsData[key];
            this.widgets[key] = new PaymentTypeFormWidget(key, widgetData.type, widgetData.config)
        }
        return this.widgets;
    }

    loadWidgets(url) {
        if (this.widgetsData !== null) {
            return;
        }

        let _context = this;
        let pt = _context.paymentType;
        _context.isLoading = true;
        let loader = new Loader()
            .setMethod('GET')
            .setUrl(url)
            .setData({label: pt.code})
            .run()
            .then(function (response) {
                console.log(response);
                if (response.data === undefined) {
                    return;
                }

                if (response.data.data) {
                    _context.widgetsData = response.data.data
                } else {
                    notify('Добавление реквизитов типа ' + pt.title + ' временно недоступно', 'warning');
                }
            }).finally(function () {
                _context.isLoading = false;
            });
    }

    getFormModel() {
        for(let widgetKey in this.widgets) {
            if(!this.widgets.hasOwnProperty(widgetKey)) {
                continue;
            }
            this.data[widgetKey] = this.widgets[widgetKey].getModel();
        }


        return this.data;
    }

    validate() {
        let isValid = true;
        for(let widgetKey in this.widgets) {
            if(!this.widgets.hasOwnProperty(widgetKey)) {
                continue;
            }
            let widget = this.widgets[widgetKey];
            widget.setReady(true);
            if(!widget.validate()) {
                isValid = false;
            }
        }


        return isValid;
    }
}
