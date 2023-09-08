const ACTIVE = 'active';
const MODERATE = 'moderate';
const DECLINED = 'declined';
const DELETED = 'deleted';


const colors = {
    [ACTIVE]: '#14ba8a',
    [MODERATE]: '#f4d330',
    [DECLINED]: '#f4d330',
    [DELETED]: '#e92a5f',
};

export default class StatusHelper {

    static getColor(code) {
        return colors.hasOwnProperty(code) ? colors[code] : null;
    }

    static isActive(code) {
        return code === ACTIVE;
    }

    static isModerate(code) {
        return code === MODERATE;
    }

    static isDeclined(code) {
        return code === DECLINED;
    }

    static isDeleted(code) {
        return code === DELETED;
    }
}
