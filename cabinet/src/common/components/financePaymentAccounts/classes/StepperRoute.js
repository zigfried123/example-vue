/**
 *
 */

export default class StepperRoute {

    constructor(key) {
        this.key = key;
        this.editable = false;
        this.done = false;
        this.onInit = function () {

        }
    }

    setOnInit(closure) {
        this.onInit = closure;
    }

}