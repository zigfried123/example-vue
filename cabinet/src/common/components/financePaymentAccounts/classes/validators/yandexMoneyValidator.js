import validatorAbstract from "./validatorAbstract";

var validate = require("validate.js");

export default class yandexMoneyValidator extends validatorAbstract {
    constructor() {
        super();
        this.errorMessage = "Невалидный кошелек";
    }

    validate(currentValue, validatorParams) {
        let regExpTest =  /^41001[1-9][0-9]{3,21}$/.test(currentValue);
        let ctrlSumTest = this.accountNumberRedundancy(currentValue);
        return regExpTest && ctrlSumTest;
    }

    accountNumberRedundancy(N) {
        function elongation(N, size) {
            while (N.length < size) N = "0" + N;
            return N;
        }

        if (N.length < 3 || N.length > 33) return false;
        var B = N.substring(1, Number(N.charAt(0)) + 1);
        var C = N.substring(1 + B.length, N.length - 2);
        var BC = elongation(B, 10) + elongation(C, 20);
        var Sum = 0;
        for (let i = 0; i < BC.length; i++) {
            var K = Number(BC.charAt(i));
            if (K == 0) K = 10;
            Sum = (Sum * 13 + K) % 99;
        }
        return Sum * 13 * 13 % 99 + 1 == N.substring(N.length - 2);
    }
}