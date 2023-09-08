function urlSelfEmployed(id) {
    return '/contractors/selfEmployed/entityApi/get/' + id;
}

function urlSelfEmployedForEdit(id) {
    return '/contractors/selfEmployed/entityApi/getForEdit/' + id;
}

function urlBankAccountsAdd() {
    return '/contractors/selfEmployed/bankAccountsApi/add';
}

function urlBankAccountsDelete(id) {
    return '/contractors/selfEmployed/bankAccountsApi/delete/' + id;
}

function urlBankAccountsView(id) {
    return '/contractors/selfEmployed/bankAccounts/view/' + id;
}

function urlListSelfEmployed() {
    return '/contractors/selfEmployed/entity/list';
}

function urlEditSelfEmployed(id) {
    return '/contractors/selfEmployed/entity/edit/' + id;
}

function urlViewSelfEmployed(id) {
    return '/contractors/selfEmployed/entity/view/' + id;
}

function urlCreateApiSelfEmployed() {
    return '/contractors/selfEmployed/entityApi/create';
}

function urlUpdateApiSelfEmployed(id) {
    return '/contractors/selfEmployed/entityApi/edit/' + id;
}

function urlCreateSelfEmployed() {
    return '/contractors/selfEmployed/entity/create';
}

function urlActivateSelfEmployed(id) {
    return '/contractors/selfEmployed/entityApi/activate/' + id;
}

function urlDeclineApiSelfEmployed(id) {
    return '/contractors/selfEmployed/entityApi/decline/' + id;
}

function urlToModerateApiSelfEmployed(id) {
    return '/contractors/selfEmployed/entityApi/toModerate/' + id;
}

function urlRemoveSelfEmployed(id) {
    return '/contractors/selfEmployed/entityApi/remove/' + id;
}

function urlApiModerateHistory(id) {
    return '/contractors/selfEmployed/entityApi/getModerateHistory/' + id;
}

export {
    urlSelfEmployed,
    urlSelfEmployedForEdit,
    urlBankAccountsAdd,
    urlBankAccountsDelete,
    urlListSelfEmployed,
    urlCreateApiSelfEmployed,
    urlCreateSelfEmployed,
    urlUpdateApiSelfEmployed,
    urlEditSelfEmployed,
    urlBankAccountsView,
    urlViewSelfEmployed,
    urlActivateSelfEmployed,
    urlRemoveSelfEmployed,
    urlDeclineApiSelfEmployed,
    urlToModerateApiSelfEmployed,
    urlApiModerateHistory,
}
