/**
 *
 */

export default class Loader {

    constructor() {
        this.axios = axios;
        this.url = '';
        this.data = {};
        this.method = 'POST';
        this.onCatch = function (error) {

        };
    }

    setOnCatch(closure) {
        this.onCatch = closure;
        return this;
    }

    setUrl(value) {
        this.url = value;
        return this;
    }

    setData(value) {
        this.data = value;
        return this;
    }

    setMethod(value) {
        this.method = value;
        return this;
    }

    run() {
        let url = this.url;
        let data = this.data;
        if (this.method === 'GET') {
            let queryParams = [];
            let params = this.data;
            for (let param in params) {
                if (!params.hasOwnProperty(param)) {
                    continue;
                }
                queryParams.push(param + '=' + params[param]);
            }

            if (queryParams.length !== 0) {
                url += '?';
                url += queryParams.join('&');
            }
            data = {};
        }
        let _context = this;

        return this.axios({
            method: this.method,
            url: url,
            header: {
                processData: false,
                contentType: false
            },
            data: this.data
        }).catch(function (error) {
            if (error === undefined) {
                return;
            }
            if (error.response) {
                if (error.response.data.errors) {
                    for (let error of error.response.data.errors) {
                        notify(error, 'error');
                    }
                }


            } else if (error.request) {
                if (error.toString() === 'Error: Network Error error') {
                    notify('Отсутствует сетевое соединение...', 'error');
                    return;
                }
                notify(error.request, 'error');
            } else {
                console.log(error.message, 'message');
                notify(error.message, 'error');
            }

            if (_context.onCatch) {
                _context.onCatch(error);
            }
        })
    }

    get() {

    }
}