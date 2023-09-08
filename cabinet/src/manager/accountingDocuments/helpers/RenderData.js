function isDuplicateRow(rawData, row, uniqueFieldName) {
    for(let index in rawData) {
        if (!!row[uniqueFieldName] &&
            !!rawData[index][uniqueFieldName] &&
            row[uniqueFieldName] === rawData[index][uniqueFieldName]) {
            return true;
        }
    }

    return false;
}

function updateRenderData(urlRender, dataItemRaw, gridInstanceName) {
    let formData = new FormData();

    let dataItemRender = Object.assign({}, dataItemRaw);

    formData.append('gridData', JSON.stringify([dataItemRender]));
    formData.append('gridInstanceName', gridInstanceName);

    return axios.post(urlRender, formData)
        .then((response) => {
            if (response.data.success) {
                Object.keys(response.data.gridDataAliases).map((fieldName) => {
                    let field = response.data.gridDataAliases[fieldName];
                    let fieldValue = Object.values(field)[0];
                    dataItemRender[fieldName] = fieldValue;
                });

                return dataItemRender;
            }
        });
}

export {isDuplicateRow, updateRenderData};