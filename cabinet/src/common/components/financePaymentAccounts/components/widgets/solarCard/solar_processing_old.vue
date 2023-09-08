<template>
    <div>
        <div v-if="">
            <md-dialog :md-active.sync="linkModal" :md-click-outside-to-close="false" :md-close-on-esc="false">
                <md-dialog-title>Внимание!</md-dialog-title>

                <md-dialog-content>
                    <div>Для привязки карты, пожалуйста, перейдите к терминалу Solar Staff</div>
                </md-dialog-content>

                <md-dialog-actions>
                    <md-button @click="toDisclaimTerminal">Нет</md-button>
                    <md-button class="md-primary" :ref="'processingButton'" v-if="terminalUrl"
                               v-on:click="gotoTerminal">
                        Перейти
                    </md-button>
                </md-dialog-actions>
            </md-dialog>
        </div>
    </div>
</template>

<script>
    import Loader from "../../../classes/Loader";
    import Pa__hloader from "../../common/pa__hloader.vue";

    const INITIALISED = 1;
    const BOUND = 4;
    const DUPLICATE = 8;

    export default {
        name: "solar_processing",
        components: {Pa__hloader},
        props: {
            waitTime: {
                type: Number,
                default: 5
            },
            tryCount: {
                type: Number,
                default: 5
            },
            tryPause: {
                type: Number,
                default: 5
            },
            parent: {},
        },
        data() {
            return {
                country: null,
                title: 'Загрузка...',
                state: 'loading',
                timer: 0,
                checkTry: 0,
                terminalUrl: null,
                timerInterval: null,
                checkInterval: null,
                linkModal: false,
                checkResult: null,
                error: {
                    icon: null,
                    label: null,
                    description: null
                }
            }
        },
        mounted() {
            // Отправка на бэк и получение терминала
            this.loadTerminal();
        },
        computed: {
            timerString() {
                var date = new Date(null);
                date.setSeconds(this.timer);
                return date.toISOString().substr(11, 8);
            }
        },
        methods: {
            loadTerminal() {
                let _context = this;
                _context.setState('loading');
                new Loader()
                    .setUrl('/financeAccounting/debitCard/add')
                    .setData({
                        'country_id': _context.country
                    })
                    .setMethod('POST')
                    .run()
                    .then(function (response) {
                        if (response === undefined || response.data.data === undefined || response.data.data.terminal_url === undefined) {
                            _context.title = null;
                            _context.error = {
                                icon: null,
                                label: 'Оишбка...',
                                description: 'Не удалось подключиться к терминалу...',
                            };
                            _context.setState('error');
                            return;
                        }
                        let responseData = response.data.data;

                        _context.setState('link');
                        _context.linkModal = true;
                        _context.title = '';
                        _context.terminalUrl = responseData.terminal_url;
                        _context.model.card_id = responseData.card_id
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            loadStatus() {
                let _context = this;
                _context.setState('loading');
                new Loader()
                    .setUrl('/financeAccounting/debitCard/checkStatus')
                    .setData({
                        'card_id': _context.model.card_id,
                    })
                    .setMethod('GET')
                    .run()
                    .then(function (response) {
                        if (response === undefined || response.data.data === undefined) {
                            _context.title = null;
                            _context.setState('manualCheck');
                            return;
                        }

                        let responseData = response.data.data;


                        let statusId = responseData.verify_status_id;

                        console.log(statusId, INITIALISED, BOUND, DUPLICATE);


                        switch (statusId) {
                            case INITIALISED:
                                _context.toWaitChecking();
                                break;
                            case BOUND:
                                _context.title = null;
                                _context.model.card_number = responseData.card_number;
                                _context.model.card_expire = responseData.card_expire;
                                _context.model.card_holder = responseData.card_holder;
                                _context.toFinal();
                                break;
                            case DUPLICATE:
                                _context.title = null;
                                _context.error = {
                                    icon: null,
                                    label: 'Ошибка...',
                                    description: responseData.card_status,
                                };
                                _context.setState('duplicate');
                                break;
                            default:
                                _context.title = null;
                                _context.error = {
                                    icon: null,
                                    label: 'Ошибка...',
                                    description: 'Не удается получить статус карты',
                                };
                                _context.setState('error');
                        }
                    })
                    .catch(function (error) {
                        _context.title = null;
                        _context.error = {
                            icon: null,
                            label: 'Ошибка...',
                            description: 'Не удается получить статус карты',
                        };
                        _context.setState('error');
                    });
            },
            gotoTerminal() {
                let _context = this;
                let newTab = window.open(
                    '',
                    'processing',
                    _context.getTerminalWindowParams(600, 800)
                );
                newTab.location.href = this.terminalUrl;

                if (newTab) {
                    _context.linkModal = false;
                    _context.toWait();
                } else {
                    _context.title = 'Не удалось открыть окно терминала. Пожалуйста, разрешите вспылвающие окна в настройках вашего браузера'
                }
            },
            getTerminalWindowParams(width, height) {
                let left = (screen.width / 2) - (width / 2);
                let top = (screen.height / 2) - (height / 2);

                let params = [
                    'menubar=no',
                    'location=no',
                    'resizable=yes',
                    'scrollbars=yes',
                    'status=no',
                    'height=' + height,
                    'width=' + width,
                    'left=' + left,
                    'top=' + top,
                ];

                return params.join(',')
            },
            toDisclaimTerminal() {
                this.linkModal = false;
                this.error = {
                    icon: 'sentiment_satisfied',
                    label: 'Увы...',
                    description: 'Вы не перешли в терминал',
                };
                this.setState('error');
            },
            toWait() {
                let _context = this;
                _context.title = 'Ожидание';
                _context.setState('wait');
                _context.timer = this.waitTime;
                _context.timerInterval = setInterval(function () {
                    if (_context.timer > 0) {
                        _context.timer--;
                    } else {
                        clearInterval(_context.timerInterval);
                        _context.$set(_context, 'timerInterval', null);
                        _context.toChecking();
                    }
                }, 1000)
            },
            toChecking() {
                let _context = this;
                _context.setState('checking');
                _context.checkTry++;
                _context.title = 'Проверка ' + _context.checkTry + '/' + _context.tryCount;

                console.log('LOAD');
                _context.loadStatus();
            },
            toWaitChecking() {
                let _context = this;

                if (_context.checkTry >= _context.tryCount) {
                    _context.title = 'Попытки завершены';
                    _context.toManualCheck();
                    return;
                }

                _context.timer = _context.tryPause;
                _context.setState('waitChecking');

                _context.checkInterval = setInterval(function () {
                    if (_context.timer > 0) {
                        _context.timer--;
                    } else {
                        clearInterval(_context.checkInterval);
                        _context.$set(_context, 'checkInterval', null);
                        _context.toChecking();
                    }
                }, 1000);
            },
            toManualCheck() {
                let _context = this;
                _context.checkTry = 0;
                _context.setState('manualCheck');
            },
            toFinal() {
                this.parent.routeToFinal();
            },
            isState(state) {
                return this.state === state;
            },
            setState(state) {
                this.$set(this, 'state', state)
            }

        },
    }
</script>

<style scoped>
    .pa__solar_processing_wrapper {
        height: 400px;
    }

    .pa__solar_processing_timer {
        margin: 15px;
        font-size: 48px;
        color: var(--pa-accent-color);
    }

    .pa__solar_processing__loading_wrapper {
        width: 150px;
    }
</style>