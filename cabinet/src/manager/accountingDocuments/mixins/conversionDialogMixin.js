export default {
    methods: {
        isUniqueConversion(conversionId, rawData) {
            for (let i = 0; i < rawData.length; i++) {
                let item = rawData[i];
                if (item.conversion_id == conversionId) {
                    return false;
                }
            }

            return true;
        },
    }
}