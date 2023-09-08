var translations = new Array();

translations['Slices list cannot be empty'] = 'Для проведения документа ничего не найдено';
translations['Amount should be greater than 0'] = 'Сумма должна быть больше 0';
translations['Start date must be earlier than end date'] = 'Дата конца периода не может быть раньше даты начала периода';

export default class Translate {

    static t(str) {
        return translations[str] ? translations[str] : str;
    }
}
