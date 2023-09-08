import validatorAbstract from "./validatorAbstract";

var validate = require("validate.js");

export default class minLengthValidator extends validatorAbstract {
    constructor() {
        super();
        this.minLengthErrorMessage = "Введеное вами число меньше минимально возможного";
        this.notValidParameter = "В данном поле ожидаются только числовые данные";
    }

    validate(currentValue, validatorParams) {

        if(currentValue === undefined) {
            return true;
        }

        let validateEmpty = super.validate(currentValue, validatorParams)
        if(validateEmpty){
            return true;
        }else if(validateEmpty === false) {
            this.errorMessage = this.notAllowEmpty;
            return false;
        }

        this.errorMessage = '';
        currentValue = parseFloat(currentValue);
        if (!validate.isNumber(currentValue)) {
            this.errorMessage = this.notValidParameter;
            return false;
        } else if (currentValue < validatorParams.minValue) {
            this.errorMessage = this.minLengthErrorMessage;
            return false;
        }else{
            return true;
        }
    }
}