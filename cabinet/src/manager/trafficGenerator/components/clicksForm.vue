<template>
    <div>
        <div class="md-layout md-gutter">
            <div class="md-layout-item">
                <md-content class="md-elevation-2" style="padding: 5px;">
                    <h3>Генератор кликов и конверсий. </h3>Данный инструмент позволяет создавать тестовые конверсии по
                    заданнымм параметрам.<br/>
                    После генерации кликов и конверсий, вы можете запустить серию тасков - задач, которые проведут
                    данные до конечных отчетов.
                </md-content>
            </div>
        </div>
        <br/>
        <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-20 buttons-block">
                <div>
                    <md-tooltip md-delay="500" md-direction="top">Нажатие кнопки запустит процесс генерации кликов на
                        трекере с заданными параметрами
                    </md-tooltip>
                    <md-button class="md-raised md-primary btn_item" @click="generateClicks()">
                        Генерация кликов
                    </md-button>
                </div>
                <div>
                    <md-tooltip md-delay="500" md-direction="top">
                        После генерации кликов, жмите на эту кнопку - сгенерируем конверсии
                    </md-tooltip>
                    <md-button class="md-raised md-primary btn_item" :disabled="!clicksData" style="margin-left: 8px;"
                               @click="generateConversions()">Генерация конверсий
                    </md-button>
                </div>
            </div>

            <div class="md-layout-item md-size-20 md-small-size-20 md-xsmall-size-50">
                <div>
                    <md-tooltip md-delay="500" md-direction="top">
                        Данный флаг позволит выбрать случайное кол-во кликов генератору
                    </md-tooltip>
                    <md-checkbox v-model="randomAmount">Случайное кол-во кликов
                        <span class="icon icon-question-sign"></span>
                    </md-checkbox>
                </div>
                <label for="amount_field">Кол-во кликов</label>
                <md-field>
                    <md-tooltip md-delay="500" md-direction="top">Введите необходимое кол-во кликов
                        (желательно не более 100 за один раз). Если вам нужна ссылка на трекер, введите число 1
                    </md-tooltip>
                    <md-input v-model="amount" id="amount_field" :disabled="randomAmount"></md-input>
                </md-field>
            </div>

            <div class="md-layout-item md-size-20 md-small-size-20 md-xsmall-size-50">
                <div>
                    <md-tooltip md-delay="500" md-direction="top">
                        Данный флаг позволит выбрать случайного вебмастера генератору
                    </md-tooltip>
                    <md-checkbox v-model="randomAffiliate">
                        Случайный вебмастер <span class="icon icon-question-sign"></span>
                    </md-checkbox>
                </div>
                <label for="affiliate_field">Вебмастер</label>
                <md-field>
                    <md-select v-model="affiliateId"
                               id="affiliate_field"
                               placeholder="Выберите вебмастера"
                               required
                               :disabled="randomAffiliate">
                        <md-option
                                v-for="item in options.affiliateList"
                                :key="item.value"
                                :label="item.label"
                                required
                                :value="item.value">{{ item.label}}
                        </md-option>
                    </md-select>
                    <md-tooltip md-delay="500" md-direction="top">
                        Выберите Вебмастера, для которого будут сгенерированы клики и конверсии
                    </md-tooltip>
                </md-field>
            </div>

            <div class="md-layout-item md-size-20 md-small-size-20 md-xsmall-size-50">
                <div>
                    <md-tooltip md-delay="500" md-direction="top">
                        Данный флаг позволит выбрать случайного оффера генератору
                    </md-tooltip>
                    <md-checkbox v-model="randomOffer">
                        Случайный оффер <span class="icon icon-question-sign"></span>
                    </md-checkbox>
                </div>
                <div>
                    <label>Оффер</label>
                <md-autocomplete v-model="offerName"
                                 :md-options="options.offerList"
                                 :md-input-placeholder = "offerPlaceholder"
                                 :disabled="randomOffer"
                                 @md-changed="getOffers"
                                 @md-opened="getOffers"
                                 @md-selected="selectOffer">
                    <template slot="md-autocomplete-item" slot-scope="{ item, term }">
                        <md-highlight-text :md-term="term">{{ item.title }}</md-highlight-text>
                    </template>

                    <template slot="md-autocomplete-empty" slot-scope="{ term }">
                        Оффер "{{ term }}" не найден!
                    </template>
                </md-autocomplete>

                    <md-tooltip md-delay="500" md-direction="top">
                        Выберите оффер, для которого будут сгенерированы клики и конверсии
                    </md-tooltip>
                </div>
            </div>

            <div class="md-layout-item md-size-20 md-small-size-20 md-xsmall-size-50">
                <div>
                    <md-tooltip md-delay="500" md-direction="top">
                        Данный флаг позволит выбрать случайную площадку генератору
                    </md-tooltip>
                    <md-checkbox v-model="randomPlatform">
                        Случайная площадка <span class="icon icon-question-sign"></span>
                    </md-checkbox>
                </div>
                <label for="platform_field">Площадка</label>
                <md-field>
                    <md-select v-model="platformId"
                               ref="platform_field"
                               :placeholder="platformPlaceholder"
                               required
                               :disabled="randomPlatform">
                        <md-option
                                v-for="item in options.platformList"
                                :key="item.value"
                                :label="item.label"
                                required
                                :value="item.value">{{ item.label}}
                        </md-option>
                    </md-select>

                    <md-tooltip md-delay="500" md-direction="top">
                        Вы можете выбрать конкректную площадку для генерации кликов и конверсий
                    </md-tooltip>
                </md-field>
            </div>
        </div>

        <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-80">
                <md-field>
                    <md-tooltip md-delay="500" md-direction="top">
                        Сформированную ссылку из этого поля можно вставить
                        в адресную строку браузера и проверить формирование клика вручную
                    </md-tooltip>
                    <md-input v-model="trackerUri" id="url_field"></md-input>
                </md-field>
            </div>
            <div class="md-layout-item md-size-20 action_button">
                <md-tooltip md-delay="500" md-direction="top">
                    Данная кнопка сбросит счетчик количества кликов и конверсий с одного ip-адреса
                </md-tooltip>
                <md-button class="md-raised md-primary btn_item" @click="resetClicksCounter()">Сбросить счетчик</md-button>
            </div>

            <div class="md-layout-item md-size-80">
                <md-field>
                    <md-tooltip md-delay="500" md-direction="top">
                        Сформированную ссылку из этого поля можно вставить
                        в адресную строку браузера и сформировать конверсию
                    </md-tooltip>
                    <md-input v-model="trackerConversionsUri" id="url_field"></md-input>
                </md-field>
            </div>

            <div class="md-layout-item md-size-20 action_button">
                <md-tooltip md-delay="500" md-direction="top">
                    Данная кнопка сгенерирует случайные конверсии в полностью автоматическом режиме.
                </md-tooltip>
                <md-button class="md-raised md-default btn_item" @click="surpriseMe()">Удиви меня!</md-button>
            </div>
        </div>

        <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-80">
                <md-icon :class="responseIconClass()">{{serverResponseCodeIcon}}</md-icon>
                <md-field>
                    <md-tooltip md-delay="500" md-direction="top">
                        Поле для отображения всех ответов сервера на запросы по генерации кликов и конверсий
                    </md-tooltip>
                    <md-textarea v-model="serverResponse" md-autogrow disabled></md-textarea>
                </md-field>
            </div>
        </div>
    </div>
</template>

<script>
    import shareMethodsMixin from "../mixins/shareMethodsMixin";

    export default {
        name: "clicks-form",
        mixins: [shareMethodsMixin],
        props: {
            baseUrl: String,
            trackerUrl: String,
            advertiserSub: String,
        },

        data: () => ({
            clicksData: false,
            randomAmount: false,
            randomAffiliate: false,
            randomOffer: false,
            randomPlatform: false,
            amount: 1,
            loading: false,
            offerId: '',
            offerName: '',
            affiliateId: '',
            platformId: '',
            serverResponse: 'Сюда придет ответ от сервера',
            serverResponseCodeIcon: '',
            platformPlaceholder: 'Сначала выберите оффер',
            offerPlaceholder: 'Сначала выберите вебмастера',
            options: {
                affiliateList: [],
                offerList: [],
                platformList: []

            },
            saveParams: {
                formName: 'clicks-form',
            },
        }),
        watch: {
            affiliateId: function() {
                this.offerPlaceholder = 'Можете выбирать';
            },

            offerId: async function (value) {
                this.options.platformList = [];
                this.platformId = null;
                const platforms = await axios(this.urlPlatform(value));
                if (platforms.data.length) {
                    this.platformPlaceholder = 'Можете выбирать';
                } else {
                    this.platformPlaceholder = 'Оффер не выбран или у него нет площадок'
                }
                this.options.platformList = platforms.data.map(item => {
                    return {value: item.id, label: item.title};
                });
            }
        },
        created: async function () {
            const affiliates = await axios.get(this.urlAffiliate());
            this.options.affiliateList = affiliates.data.map(item => {
                return {value: item.id, label: item.title.replace(/&quot;/g, '\"')};
            });
        },

        methods: {
            getOffers: async function (searchTerm) {
                this.options.offerList = new Promise(resolve => {
                    window.setTimeout(async () => {
                        if (searchTerm) {
                            const term = searchTerm.toString().toLowerCase();
                            let offerList = await axios.get(this.urlOffer(term));
                            resolve(offerList.data.filter(({ title }) => title.toLowerCase().includes(term)));
                        }
                    }, 500)
                })
            },

            selectOffer: function(offer) {
                this.offerId = offer.id;
                this.offerName = offer.title;
            },

            responseIconClass() {
                let icon = this.serverResponseCodeIcon;
                if (icon === 'thumb_up') {
                    return 'success-icon';
                }
                return 'error-icon'
            },
            urlOffer(term) {
                return this.baseUrl + '/offer/?aff_id=' + this.affiliateId + '&term=' + term;
            },
            urlPlatform(offerId) {
                return this.baseUrl + '/platforms/?offer_id=' + offerId;
            },

        },
        computed: {
            trackerUri: {
                get() {
                    return this.trackerClicksGeneratorUrl('/aff_c', this.advertiserSub);
                },
                set() {
                }
            },

            trackerConversionsUri: {
                get() {
                    return this.trackerClicksGeneratorUrl('/aff_l', this.advertiserSub);
                },
                set() {
                }
            },
        },
    }

</script>

<style scoped>
    .tooltip-form {
        padding-top: -30px;
    }

    .success-icon {
        color: darkgreen !important;
    }

    .error-icon {
        color: red !important;
    }
</style>