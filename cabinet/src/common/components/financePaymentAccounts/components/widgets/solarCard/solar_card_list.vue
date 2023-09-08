<template>
    <div>
        <h4 class="pa__header">Можно привязать</h4>
        <div class="pa__flex h-items-center v-column">
            <md-list class="pa__card_list">
                <md-subheader>
                    {{
                    cards.length !== 0
                    ? 'Активированные карты'
                    : 'У Вас пока нет карт для добавления...'
                    }}
                </md-subheader>

                <md-list-item v-for="(card, index) of cards" :key="card.card_id">



                    <div class="md-list-item-text" v-bind:class="{'pa__card_list__item__error' : !cardIsActive(card) }">
                        <span>
                            {{ card.card_number }}&nbsp;
                        </span>
                        <span class="md-caption">{{ card.card_holder }} {{ card.card_expire }}</span>
                    </div>

                    <md-badge class="md-square" :md-content="card.verify_status" v-bind:class="{'md-primary' : cardIsActive(card) }"/>
                    &nbsp;
                    &nbsp;

                    <md-radio v-if="cardIsActive(card)" class="md-primary" v-model="selected" :value="index"></md-radio>
                    <md-button v-else class="md-icon-button md-dense md-accent pa__card_list__unlink-btn"
                               v-on:click="unlinkCard(card.card_id)">
                        <md-icon>close</md-icon>
                    </md-button>
                </md-list-item>
            </md-list>

            <md-button class="md-primary" v-on:click="loadCards" :disabled="state === 'loading'">
                {{ state === 'loading' ? 'Проверка списка карт...' : 'Обновить список' }}
            </md-button>
        </div>
    </div>
</template>

<script>
    import Pa_load_stub from "../../common/pa_load_stub.vue";
    import Pa_empty_stub from "../../common/pa_empty_stub.vue";
    import Loader from "../../../classes/Loader";

    const INITIALISED = 1;
    const BOUND = 4;
    const DUPLICATE = 8;

    export default {
        name: "solar_card_list",
        components: {Pa_empty_stub, Pa_load_stub},
        data() {
            return {
                state: null,
                cards: [],
                selected: null,
                updateInterval: null
            }
        },
        mounted() {
            let _context = this;
            // Отправка на бэк и получение терминала
            _context.loadCards();

            _context.updateInterval = setInterval(function () {
                _context.loadCards();
            }, 10000);
        },
        computed: {},
        methods: {
            loadCards() {
                let _context = this;
                _context.state = 'loading';
                new Loader()
                    .setUrl('/financeAccounting/debitCard/cardList')
                    .setMethod('GET')
                    .run()
                    .then(function (response) {
                        _context.$set(_context, 'cards', response.data.data)
                    })
                    .finally(function () {
                        _context.state = 'none';
                    });
            },
            unlinkCard(id) {
                let _context = this;
                let card = _context.findCardById(id);
                _context.state = 'loading';
                if (card) {
                    new Loader()
                        .setUrl('/financeAccounting/debitCard/cardUnlink')
                        .setMethod('POST')
                        .run()
                        .then(function (response) {
                            if(response.data.success === true) {
                                _context.cards.splice(_context.cards.indexOf(card), 1);
                            } else {
                                notify('Не удалось отвязать карту', 'error');
                            }
                        })
                        .finally(function () {
                            _context.state = 'none';
                        });
                }

            },
            findCardById(id) {
                let list = this.cards.filter(function (item) {
                    return item.card_id === id;
                });

                return list ? list[0] : null;
            },
            getSelectedCard() {
                return this.cards[this.selected];
            },
            cardIsActive(card) {
                return card.verify_status_id === BOUND;
            }
        },
    }
</script>

<style scoped>
    .pa__card_list {
        margin: 0 -15px 0 -15px;
    }

    .pa__card_list__item__error {
        color: var(--md-theme-default-accent);
    }

    .pa__card_list__unlink-btn {
        margin: 0 -5px !important;
    }

</style>