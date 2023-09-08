/**
 * @property message
 * @property state
 * @property isError
 */
export default class State {

    constructor() {
        this.message = '';
        this.state = 'init';
        this.isError = false;
    }

    setError(message = '') {
        this.isError = true;
        this.message = message;
        this.state = 'error'
    }

    setSuccess(message = '') {
        this.isError = false;
        this.message = message;
        this.state = 'success'
    }
    clear(){
        this.message = '';
        this.state = 'init';
        this.isError = false;
    }

}