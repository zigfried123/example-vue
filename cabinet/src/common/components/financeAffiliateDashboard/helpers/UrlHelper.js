export class UrlHelper {

    static url(url, params = {}) {
        let queryParams = [];
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
        return url;
    }
}