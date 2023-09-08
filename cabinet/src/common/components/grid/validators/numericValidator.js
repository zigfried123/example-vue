import validatorAbstract from "./validatorAbstract";

var validate = require("validate.js");

export default class numericValidator extends validatorAbstract {
    constructor() {
        super();
        this.numericError = "Неправильный формат числа"
    }

    validate(currentValue, validatorParams) {
        let validateEmpty = super.validate(currentValue, validatorParams)
        if (validateEmpty) {
            return true;
        } else if (validateEmpty === false) {
            this.errorMessage = this.notAllowEmpty;
            return false;
        }

        if (currentValue === undefined) {
            return true;
        }

        this.errorMessage = this.numericError;
        return this.testNumeric(currentValue, validatorParams);
    }

    testNumeric(currentValue, validatorParams) {
        currentValue = currentValue.toString();
        let patternStringFloat = "^-?[1-9][0-9]*[.,]\\d{1,2}?$";
        let patternStringFloatStartZero = "^-?[0][.,]\\d{1,2}?$";
        let patternStringIntWithoutZero = "^([1-9]+)$";

        if (validatorParams.integerOnly) {
            let pattern = new RegExp(patternStringIntWithoutZero);
            return pattern.test(currentValue);
        }

        let patternFloat = new RegExp(patternStringFloat);
        let patternFloatStartZero = new RegExp(patternStringFloatStartZero);
        let patternIntWithoutZero = new RegExp(patternStringIntWithoutZero)
        return (
            patternFloat.test(currentValue) ||
            patternFloatStartZero.test(currentValue) ||
            patternIntWithoutZero.test(currentValue)
        )
            ? true : false;

    }
}