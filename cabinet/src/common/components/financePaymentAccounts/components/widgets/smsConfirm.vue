<template>
    <div>
        <div class="pa__confirm-wrapper">
            <div v-if="state === 'start'" class="pa__state-warp pa__flex v-items-center h-items-start">
                <md-button
                        class="md-raised md-theme-default md-primary pa__no-margin"
                        v-bind:class="{'md-accent' : !!error}"
                        v-on:click="send"
                >
                    Выслать код
                </md-button>
                <div class="pa__button-icon-wrap">
                    <md-icon v-if="error" class="md-accent">error_outline</md-icon>
                </div>

                <small>Необходимо подтвердить телефон</small>
            </div>

            <div v-if="state === 'wait'">
                <md-field :class="messageClass">
                    <label>{{ widget.config.label }}</label>
                    <span class="md-prefix" v-if="widget.config.prefix">{{ widget.config.prefix}}</span>
                    <md-input
                            v-model="model"
                            type="number"
                            v-on:change="ready = true"
                            v-on:keyup="validate"
                            :pattern="pattern"
                            :maxlength="length"
                    ></md-input>
                    <span v-if="helperText" class="md-helper-text" v-html="helperText"></span>
                    <span v-if="error" class="md-error">{{ error }}</span>
                    <md-button
                            v-bind:readonly="sendEnabled"
                            class="md-primary pa__no-margin"
                            v-bind:class="{'md-accent' : !!error}"
                            v-on:click="reSend"
                    >
                        {{ sendEnabled ? 'Выслать еще раз' : resendTime + ' сек.' }}
                    </md-button>
                </md-field>
            </div>

            <div v-if="state === 'loading'" class="pa__state-warp pa__flex v-items-center">
                <div>
                    <md-progress-spinner class="md-default-accent" :md-diameter="30"
                                         md-mode="indeterminate"></md-progress-spinner>
                </div>
            </div>

            <div v-if="state === 'success'" class="pa__state-warp pa__flex v-items-center">
                <md-checkbox v-on:change="checked = true" v-model="checked" class="md-primary"></md-checkbox>
                <span class="md-primary">Телефон подтвержден</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Loader from "../../classes/Loader";
    import _widget_mixin from './_widget_mixin';

    export default {
        name: "smsConfirm",
        mixins: [_widget_mixin],
        data() {
            return {
                checked: true,
                model: '',
                state: 'start',
                length: 4,
                helperText: null,
                resendTime: 0,
                resendTimer: null,
                sendEnabled: true
            }
        },
        methods: {
            reSend() {
                if (!this.sendEnabled) {
                    notify('Повторная отправка доступна через ' + this.resendTime + ' сек.');
                    return false;
                }
                this.setDefault();
                this.send();
            },
            send() {
                if (!this.sendEnabled) {
                    return false;
                }
                this.setDefault();
                this.setLoading();
                let _setWait = this.setWait;
                let _context = this;
                new Loader()
                    .setUrl(this.$store.getters.getBaseUrl + 'sendCode')
                    .setMethod('GET')
                    .run()
                    .then(function (response) {

                        if (!response.data.success) {
                            for (let error of response.data.errors) {
                                notify(error, 'error');
                            }
                            return false;
                        } else {
                            _context.$set(_context, 'helperText', response.data.data.message);
                            _context.$set(_context, 'resendTime', response.data.data.resendTime);
                            _context.sendPause()
                        }
                    })
                    .finally(function (xhr) {
                        _setWait()
                    })
            },
            validate() {
                if (this.state === 'success') {
                    return true;
                }

                this.setError(null);
                let code = this.model ? this.model : '';

                if (code.length === this.length) {
                    this.widget.setReady(true);
                }

                if (!this.ready) {
                    return true;
                } else {
                    if (!this.model || (code.length !== this.length)) {
                        this.setError('Необходимо подтвердить телефон')
                        return false;
                    }
                    let _setWait = this.setWait;
                    let _setError = this.setError;
                    let _setSuccess = this.setSuccess;
                    let _setLoading = this.setLoading;

                    _setLoading();
                    new Loader()
                        .setUrl(this.$store.getters.getBaseUrl + 'checkCode')
                        .setData({
                            code: code
                        })
                        .setMethod('GET')
                        .run()
                        .then(function (response) {
                            if (response.data.errors.length === 0) {
                                _setSuccess();
                                return true;
                            } else {
                                _setWait();
                                _setError(response.data.errors.join(', '));
                                return false;
                            }
                        })
                        .finally(function () {

                        });
                }

                return true;
            },
            setDefault() {
                this.widget.setReady(false);
                this.widget.setError(null);
                this.widget.setModel('');
            },
            setError(string) {
                this.widget.setError(string);
            },
            setWait() {
                this.$set(this, 'state', 'wait');
            },
            setSuccess() {
                this.$set(this, 'checked', true);
                this.$set(this, 'state', 'success');
            },
            setLoading() {
                this.$set(this, 'state', 'loading');
            },
            sendPause() {
                this.resendTimer = setInterval(() => {
                    if (this.resendTime > 0) {
                        this.$set(this, 'resendTime', this.resendTime - 1);
                    } else {
                        clearInterval(this.resendTimer);
                    }
                }, 1000)
            }
        },
        computed: {
            pattern() {
                return '[0-9]{' + this.length + '}';
            },

        },
        watch: {
            resendTime: function () {
                return this.$set(this, 'sendEnabled', this.resendTime === 0);
            }
        }
    }
</script>

<style scoped>
    .pa__state-warp {
        height: 100%;
    }

    .pa__button-icon-wrap {
        padding: 10px;
    }

    .pa__confirm-wrapper {
        height: 70px;
    }
</style>