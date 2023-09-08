export class DateHelper {

    /**
     * Парсинг дат в формате dd.mm.yyyy
     *
     * TODO: Возможно заюзать format.js
     * @param dateString
     * @return {Date}
     */
    static parseRus(dateString) {
        let dateParts = dateString.split(".");
        return  new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
    }
}