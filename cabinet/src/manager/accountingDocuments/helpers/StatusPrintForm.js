const SIGNED = 'signed';
const NOT_SIGNED = 'not_signed';
const DELETED = 'deleted';


const colors = {
    [SIGNED]: '#14ba8a',
    [NOT_SIGNED]: '#f4d330',
    [DELETED]: '#e92a5f',
};

export default class StatusHelper {

    static getColor(code) {
        return colors.hasOwnProperty(code) ? colors[code] : null;
    }
}
