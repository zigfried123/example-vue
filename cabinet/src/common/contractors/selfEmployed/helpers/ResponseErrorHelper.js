export default class ResponseErrorHelper {

    getMessage(response) {
        return !!response.message ? response.message : null;
    }

    errorsToMessages(response) {
        if (!!response.errors === false) {
            return null;
        }

        let errors = [];
        for (let field in response.errors) {
            if (!!field) {
                errors.push(response.errors[field]);
            }
        }

        return errors;
    }
}