export default {
    name: "shareMethodsMixin",
    methods: {

        urlAffiliate() {
            return this.baseUrl + '/affiliate';
        },

        urlCreateClicks() {
            return this.baseUrl + '/createClicks';
        },

        urlCreateConversions() {
            return this.baseUrl + '/createConversions';
        },
        urlSurpriseMe() {
            return this.baseUrl + '/surpriseMe';
        },
        urlRedisToCrate() {
            return this.baseUrl + '/redisToCrate';
        },
        urlResetClicksCounter() {
            return this.baseUrl + '/resetClicksCounter';
        },

        /**
         * Метод отправки заполненной формы генерации кликов
         * @returns {Promise<void>}
         */
        async generateClicks() {
            try {
                this.loading = true;
                this.serverResponse = 'Подождите. Идет обработка запроса..';
                this.serverResponseCodeIcon = 'query_builder';
                let data = new FormData();
                data.append(this.saveParams.formName + '[amount]', this.amount);
                data.append(this.saveParams.formName + '[randomAmount]', this.randomAmount);
                data.append(this.saveParams.formName + '[affiliateId]', this.affiliateId);
                data.append(this.saveParams.formName + '[randomAffiliate]', this.randomAffiliate);
                data.append(this.saveParams.formName + '[offerId]', this.offerId);
                data.append(this.saveParams.formName + '[randomOffer]', this.randomOffer);
                data.append(this.saveParams.formName + '[platformId]', this.platformId);
                data.append(this.saveParams.formName + '[randomPlatform]', this.randomPlatform);

                const result = await axios.post(this.urlCreateClicks(), data);
                this.serverResponse = result.data.response;
                this.loading = false;
                this.clicksData = result.data.advSub;
                this.transactions = result.data.transactions;

                if (result.data.responseCode === '301') {
                    this.serverResponseCodeIcon = 'thumb_up';
                } else {
                    this.serverResponseCodeIcon = 'error';
                }
            } catch (e) {
                console.error(e);
                this.loading = false;
            }
        },

        /**
         * Метод отправки заполненной формы генерации конверсий
         * @returns {Promise<void>}
         */
        async generateConversions() {
            try {
                this.serverResponse = 'Подождите. Идет обработка запроса..';
                this.serverResponseCodeIcon = 'query_builder';
                let data = new FormData();
                data.append(this.saveParams.formName + '[offerId]', this.offerId);
                data.append(this.saveParams.formName + '[advertiserSub]', this.clicksData);
                data.append(this.saveParams.formName + '[transactions]', this.transactions);
                const result = await axios.post(this.urlCreateConversions(), data);
                this.serverResponse = result.data.response;

                if (result.data.responseCode === '200') {
                    this.serverResponseCodeIcon = 'thumb_up';
                } else {
                    this.serverResponseCodeIcon = 'error';
                }
            } catch (e) {
                console.error(e);
            }
        },

        /**
         * Запрос на выполнение метода "Удиви меня!"
         * @returns {Promise<void>}
         */
        async surpriseMe() {
            const result = await axios.post(this.urlSurpriseMe());
            this.serverResponse = result.data;
            console.log(result.data);
        },

        /**
         * Генератор строки для трекера
         * @returns {string}
         */
        trackerClicksGeneratorUrl(action, advertiserSub) {

            if (parseInt(this.amount) !== 1 && !this.randomAmount) {
                return 'Генерация ссылки на трекер не возможна. Кол-во кликов должно быть равно 1'
            }
            let url = this.trackerUrl + action + '?';
            if (this.affiliateId && !this.randomAffiliate) {
                url += '&aff_id=' + this.affiliateId
            }
            if (this.offerId && !this.randomOffer) {
                url += '&offer_id=' + this.offerId;
            }

            if (this.platformId && !this.randomPlatform) {
                url += '&pltfm_id=' + this.platformId;
            }
            url += '&adv_sub=' + advertiserSub;

            return url;
        },

        async resetClicksCounter() {
            try {
                this.serverResponse = 'Подождите. Идет обработка запроса..';
                this.serverResponseCodeIcon = 'query_builder';
                const result = await axios.post(this.urlResetClicksCounter());
                this.serverResponse = result.data.response;

                if (result.data.responseCode === '200') {
                    this.serverResponseCodeIcon = 'thumb_up';
                } else {
                    this.serverResponseCodeIcon = 'error';
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
}
