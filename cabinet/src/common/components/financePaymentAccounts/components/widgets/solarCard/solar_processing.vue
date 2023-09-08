<template>
    <div>
        <div class="pa__flex h-items-center v-column">
            <autocomplete
                    :action="'countries'"
                    :model="model.country"
                    :error="modelError.country"
                    :parent="this"
                    :minLength="1"
                    :key="'country'"
                    :label="'Страна, в которой выпущена карта'"
            ></autocomplete>
            <md-button class="md-primary" v-on:click="loadTerminal()">
                Добавить карту
            </md-button>

            <pa__hloader v-if="state === 'loading'">

            </pa__hloader>
        </div>

        <div v-if="terminalUrl">
            <md-dialog :md-active.sync="linkModal" :md-click-outside-to-close="false" :md-close-on-esc="false">
                <md-dialog-title>Внимание!</md-dialog-title>

                <md-dialog-content>
                    <div>Для привязки карты, пожалуйста, перейдите к терминалу Solar Staff</div>
                </md-dialog-content>

                <md-dialog-actions>
                    <md-button @click="closeModal">Нет</md-button>
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
    import Autocomplete from "../../common/autocomplete.vue";
    import Loader from "../../../classes/Loader";
    import Pa__hloader from "../../common/pa__hloader.vue";

    export default {
        name: "solar_processing",
        components: {Pa__hloader, Autocomplete},
        data() {
            return {
                model: {
                    country: null
                },
                modelError: {
                    country: null
                },
                terminalUrl: null,
                linkModal: true,
                state: null,
                error: null,
                ready: false
            }
        },
        methods: {
            setModel(value, key) {
                this.$set(this.model, key, value);
            },
            loadTerminal() {
                let _context = this;
                _context.setReady(true);
                _context.setState('loading');
                new Loader()
                    .setUrl('/financeAccounting/debitCard/add')
                    .setData({
                        'country_id': _context.model.country
                    })
                    .setMethod('POST')
                    .run()
                    .then(function (response) {
                        if (response === undefined || response.data.data === undefined || response.data.data.terminal_url === undefined) {
                            _context.error = {
                                icon: null,
                                label: 'Оишбка...',
                                description: 'Не удалось подключиться к терминалу...',
                            };
                            _context.setState('error');
                            return;
                        }
                        let responseData = response.data.data;

                        _context.setState(null);
                        _context.linkModal = true;
                        _context.terminalUrl = responseData.terminal_url;
                        _context.model.card_id = responseData.card_id
                    })
                    .catch(function (error) {
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
                } else {
                    _context.title = 'Не удалось открыть окно терминала. Пожалуйста, разрешите вспылвающие окна в настройках вашего браузера'
                }
            },
            closeModal() {
                this.linkModal = false;
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
            setState(state) {
                this.$set(this, 'state', state)
            },
            validate() {
                this.modelError.country = null;
                if (!this.model.country) {
                    this.modelError.country = 'Необходимо ыказать страну, в которой выпущена карта';
                    return false;
                }
                return true;
            },
            setReady(val) {
                this.$set(this, 'ready', val);
            }
        },
        watch: {
            model: {
                handler(newData, oldData) {
                    if (this.ready) {
                        this.validate();
                    }
                },
                deep: true,
            },
            ready: {
                handler(newData, oldData) {
                    if (this.ready) {
                        this.validate();
                    }
                },
                deep: true,
            },
        }
    }
</script>

<style scoped>

</style>