import validatorAbstract from "./validatorAbstract";

var validate = require("validate.js");

export default class requiredValidator extends validatorAbstract{
    constructor() {
        super ();
        this.errorMessage = "Необходимо заполнить это поле"
    }

    validate(currentValue, rulesValue) {
        // Если required == false
        //  - то пропускаем проверку
        if(!rulesValue) {
            return true;
        }

        // Если значение пустое - то кидаем ошибку
        return currentValue !== null && currentValue !== false && currentValue !== '' && currentValue !== undefined;
    }
}