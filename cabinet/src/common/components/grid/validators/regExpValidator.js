import validatorAbstract from "./validatorAbstract";

var validate = require("validate.js");

export default class regExpValidator extends validatorAbstract {
    constructor() {
        super();
        this.errorMessage = "Значение не попадает под шаблон";
    }

    validate(currentValue, rulesValue) {
        let pattern = new RegExp(rulesValue);
        return pattern.test(currentValue);
    }
}