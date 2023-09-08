<template>
    <form method="post" class="form-horizontal container-fluid">
        <div class="row-fluid">
            <div class="span6">
                <fieldset
                        v-if="initial_data.platforms.length || initial_data.offer_urls.length || initial_data.domains.length || initial_data.deeplink == 1 && initial_data.file_type != 'form' || initial_data.pre_offer_urls.length && initial_data.file_type != 'form' || initial_data.contextad_providers.length && initial_data.file_type != 'form'">
                    <legend>Основные параметры  <img v-if="state.loading.indexOf('initial_data') != -1"
                                                     src="/assets/new/images/ajax-loader.gif"/></legend>
                    <div v-if="initial_data.platforms.length" class="platform control-group"
                         :class="{error:state.errors.platform}">
                        <label class="control-label" for="modal-platform">Площадка:</label>
                        <div class="controls">
                            <select v-model.number="platform" id="modal-platform" name="platform_id">
                                <option disabled value="0">Выберите площадку</option>
                                <option v-for="item in initial_data.platforms" :value="item.id">{{item.name}}
                                </option>
                            </select>
                            <span v-if="state.errors.platform" class="help-inline">Необходимо выбрать площадку</span>
                        </div>
                    </div>
                    <div v-if="initial_data.offer_urls.length" class="control-group">
                        <label class="control-label" for="modal-url">Посадочная страница</label>
                        <div class="controls">
                            <select v-model.number="landing" id="modal-url" name="url_id">
                                <option value="0">Страница по умолчанию</option>
                                <option v-for="item in initial_data.offer_urls" :value="item.id">{{item.name}}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div v-if="initial_data.domains.length && isNotAidaVkWidget" class="control-group">
                        <label class="control-label" for="modal-domain">Домены</label>
                        <div class="controls">
                            <select v-model="domain" id="modal-domain" name="domain_id">
                                <option :value="initial_data.default_domain">Домен по умолчанию</option>
                                <option v-for="item in initial_data.domains" :value="item.id">{{item.name}}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div v-if="initial_data.deeplink == 1 && initial_data.file_type != 'form'" class="control-group">
                        <label class="control-label" for="modal-deeplink">Deeplink</label>
                        <div class="controls">
                            <input v-model="deeplink" id="modal-deeplink" type="text" data-param="deeplink">
                        </div>
                    </div>
                    <div v-if="initial_data.pre_offer_urls.length && initial_data.file_type != 'form'"
                         class="control-group">
                        <label class="control-label" for="modal-pre_offer_url">Прелендинги</label>
                        <div class="controls">
                            <select v-model="pre_offer_url" id="modal-pre_offer_url" name="preoffer_url_id">
                                <option :value="0">Без прелендинга</option>
                                <option v-for="item in initial_data.pre_offer_urls" :value="item.id">
                                    {{item.name}}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div v-if="bbcode" class="control-group">
                        <label class="control-label" for="modal-bbcode">В формате BBCode</label>
                        <div class="controls">
                            <input v-model="bbcode" id="modal-bbcode" type="checkbox">
                        </div>
                    </div>
                </fieldset>

                <fieldset v-if="initial_data.contextad_providers.length && initial_data.file_type != 'form' && !linkDirect">
                    <legend>
                        Настройка ROI
                        <a target="_blank" class="btn mini green no-icon" href="/education/roi/index">Документация</a>
                        <img v-if="state.loading.indexOf('initial_data') != -1" src="/assets/new/images/ajax-loader.gif"/>
                    </legend>

                    <div v-if="initial_data.contextad_providers.length && initial_data.file_type != 'form'"
                         class="control-group">
                        <label class="control-label" for="modal-contextad_provider">Рекламная сеть</label>
                        <div class="controls">
                            <select v-model="contextad_provider" id="modal-contextad_provider"
                                    name="contextad_provider">
                                <option :value="0">Рекламная сеть</option>
                                <option v-for="item in initial_data.contextad_providers"
                                        :value="item.params | joinUrlParams">{{item.name}}
                                </option>
                            </select>
                        </div>
                    </div>


                    <div v-if="initial_data.contextad_providers.length && initial_data.file_type != 'form' && contextad_provider" class="control-group">
                        <label class="control-label" for="modal-personal_url">Адрес вашей посадочной страницы</label>
                        <div class="controls">
                            <input v-model="personal_url" id="modal-personal_url" type="text" data-param="personal_url" placeholder="http://example.com">
                            <a target="_blank" class="btn mini green no-icon"
                               href="/education/roi/statcollect">Как интегрировать?</a>
                        </div>
                    </div>

                </fieldset>

                <fieldset class="extra" v-if="!linkDirect && isNotAidaVkWidget">
                    <legend>Дополнительные параметры</legend>
                    <div class="control-group" style="margin-top:0;">
                        <label class="control-label" for="modal-source">Партнерский источник:</label>
                        <div class="controls">
                            <input v-model="params.source" id="modal-source" type="text" data-param="source">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="modal-aff_sub1">Партнерский Sub ID:</label>
                        <div class="controls">
                            <input v-model="params.aff_sub1" id="modal-aff_sub1" type="text" data-param="aff_sub1">
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="modal-aff_sub2">Партнерский Sub ID 2:</label>
                        <div class="controls">
                            <input v-model="params.aff_sub2" id="modal-aff_sub2" type="text" data-param="aff_sub2">
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="modal-aff_sub3">Партнерский Sub ID 3:</label>
                        <div class="controls">
                            <input v-model="params.aff_sub3" id="modal-aff_sub3" type="text" data-param="aff_sub3">
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="modal-aff_sub4">Партнерский Sub ID 4:</label>
                        <div class="controls">
                            <input v-model="params.aff_sub4" id="modal-aff_sub4" type="text" data-param="aff_sub4">
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="modal-aff_sub5">Партнерский Sub ID 5:</label>
                        <div class="controls">
                            <input v-model="params.aff_sub5" id="modal-aff_sub5" type="text" data-param="aff_sub5">
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="modal-custom">Произвольные поля:</label>
                        <div class="controls">
                            <input v-model="custom_params" id="modal-custom" type="text" data-param="custom">
                            <p class="muted">перечислите необходимые значения в формате "key=value<strong>&amp;</strong>.."
                            </p>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div class="span6" v-if="getError()">
                <div class="alert in fade alert-warning"> {{ getError() }} </div>
            </div>
            <div class="span6" v-if="!getError()">

                <fieldset v-if="initial_data.file_type != 'form' && isNotAidaVkWidget">
                    <legend>Прямая ссылка
                        <img v-if="state.loading.indexOf('code') != -1" src="/assets/new/images/ajax-loader.gif"/>
                    </legend>
                    <div class="b-form-field b-form-field_type_ico">
                        <input id="copyLink" v-model="link" type="text" readonly class="b-form-field__field b-copy-link"/>
                        <CopyText :inputId="'copyLink'"/>
                    </div>
                </fieldset>

                <fieldset v-if="linkDirect">
                    <legend>Для трафика с мобильных устройств</legend>
                    <div class="b-form-field b-form-field_type_ico">
                        <input id="copyLinkDirect" v-model="linkDirect" type="text" readonly class="b-form-field__field b-copy-link"/>
                        <CopyText :inputId="'copyLinkDirect'"/>
                    </div>
                </fieldset>

                <fieldset v-if="!rotator_id">
                    <legend>Код для размещения на сайте <img v-if="state.loading.indexOf('code') != -1"
                                                             src="/assets/new/images/ajax-loader.gif"/></legend>
                    <div class="b-form-field b-form-field_type_ico">
                        <textarea id="modalCode" :rows="getTextAreaHeight()"
                                  readonly class="b-form-field__field b-copy-code">{{code}}</textarea>
                        <CopyText :inputId="'modalCode'"/>
                    </div>

                </fieldset>
            </div>
        </div>
    </form>
</template>
<script>
    import _ from 'lodash';
    import axios from 'axios';
    import CopyText from './CopyText.vue'

    const data = {
        platform: 0,
        landing: 0,
        pre_offer_url: 0,
        contextad_provider: 0,
        personal_url: '',
        rotator_id: 0,
        deeplink: '',
        domain: '',
        bbcode: false,
        params: {
            source: '',
            aff_sub1: '',
            aff_sub2: '',
            aff_sub3: '',
            aff_sub4: '',
            aff_sub5: ''
        },
        custom_params: '',
        hashes: {
            impression: '',
            click: ''
        },
        external: {
        },
        initial_data: {
            platforms: [],
            contextad_providers: [],
            offer_urls: [],
            pre_offer_urls: [],
            deeplink: 0,
            domains: [],
            file_id: null,
            offer_id: null,
            default_domain: '',
            file_type: null,
            protocol: 'https'
        },
        state: {
            loading: [],
            errors: {
                platform: false
            }
        },
        code_template: ''
    };

    export default {
        name: 'codegenerator',
        components: {
            CopyText
        },
        data: function(){
            return _.clone(data);
        },
        props: {
            'data-codegenerator-options': {
                type: String,
                default: '123'
            },
        },
        updated: function () {
            this.validate();
        },
        mounted: function () {
            this.reset();
            let that = this;
            $('.codegenerator-modal-link').on('click', function (e) {
                // нужно чтобы при открытии модалки не скроллило страницу вверх
                e.preventDefault();
                let config = {
                    offer_id: $(this).data('offer_id'),
                    file_id: $(this).data('file_id'),
                    platform_id: $(this).data('platform_id'),
                    domain: $(this).data('domain'),
                    platforms: $(this).data('platforms'),
                    domains: $(this).data('domains'),
                    contextad_providers: $(this).data('contextad_providers'),
                    rotator_id: $(this).data('rotator_id')
                };

                that.loadInitialData(config);
                $('#code').closest('.modal').find('.modal-header h3').text($(this).data('header')).end().modal('show');
            });
            $('#code').closest('.modal').on('hidden', function(){
                that.reset();
            });
        },
        computed: {
            link: function () {
                return this.getClickUrl();
            },
            linkDirect: function() {
                if (!this.external.aida) {
                    return '';
                }
                return this.external.aida.offer_url;
            },
            isNotAidaVkWidget: function () {
                return !this.external.aida_vk_widget;
            },
            code: function () {
                let clickUrl = this.getClickUrl();
                let impressionUrl = this.getImpressionUrl();
                if (!clickUrl) {
                    return '';
                }

                if (this.initial_data.file_type === 'flash banner') {
                    impressionUrl = this.appendUrlParams(impressionUrl, {'ab': '0', 'clickTag': clickUrl});
                }

                let code = this.parseTemplate(this.code_template, {
                    impression_url: impressionUrl,
                    click_url: clickUrl,
                    click_url_encoded: encodeURIComponent(clickUrl),
                    click_hash: this.hashes.click,
                    impression: this.getProtocol() + this.domain + '/impression/' + this.hashes.impression,
                    source: this.params.source,
                    aff_sub1: this.params.aff_sub1,
                    aff_sub2: this.params.aff_sub2,
                    aff_sub3: this.params.aff_sub3,
                    aff_sub4: this.params.aff_sub4,
                    aff_sub5: this.params.aff_sub5
                });
                return code;
            }
        },
        watch: {
            platform: function () {
                this.state.errors.platform = false;
                this.getCode();
            },
            landing: function () {
                this.getCode();
            },
            pre_offer_url: function () {
                this.getCode();
            },
            bbcode: function () {
                this.getCode();
            }
        },
        filters: {
            encodeURI: function (value) {
                return encodeURIComponent(value);
            },
            joinUrlParams: function (params, encode) {
                let str = [];
                for (let p in params)
                    if (params.hasOwnProperty(p) && params[p]) {
                        if (encode) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
                        } else {
                            str.push(encodeURIComponent(p) + "=" + params[p]);
                        }

                    }
                return str.join("&");
            }
        },
        methods: {
            getError() {
                if(this.external && this.external.error) {
                    return this.external.error;
                }
                return null;
            },
            getProtocol: function () {
                return this.initial_data.protocol ? (this.initial_data.protocol + '://') : '//';
            },
            getInitOptions: function () {
                return JSON.parse(this.dataCodegeneratorOptions);
            },
            reset: function () {
                for (let item in data) {
                    if (data.hasOwnProperty(item)) {
                        this[item] = _.clone(data[item]);
                    }
                }
                this.initial_data = this.getInitOptions().initial_data;
            },
            parseTemplate: function (template, params) {
                let res = template;
                for (let item in params) {
                    if (params.hasOwnProperty(item)) {
                        res = res.replace(new RegExp('{{' + item + '}}', 'gi'), params[item]);
                    }
                }
                return res;
            },
            splitUrlParams: function (url) {
                return _.chain(url)
                    .replace('?', '')
                    .split('&')
                    .map(_.ary(_.partial(_.split, _, '='), 1)) // [["a","b454"],["c","dhjjh"]]
                    .fromPairs()
                    .value();
            },
            joinUrlParams: function (params) {
                return this.$options.filters.joinUrlParams(params, true);
            },
            appendUrlParams: function (url, params) {
                if (url.indexOf('?') !== -1) {
                    return url + '&' + this.joinUrlParams(params);
                }
                return url + '?' + this.joinUrlParams(params);
            },
            buildParamsUrl: function () {
                let p = this.joinUrlParams(this.params);
                p += (p && this.custom_params ? '&' : '') + this.custom_params;
                if (this.deeplink) {
                    p += (p && this.deeplink ? '&' : '') + 'deeplink=' + encodeURIComponent(this.deeplink);
                }
                if (this.contextad_provider) {
                    p += (p && this.contextad_provider ? '&' : '') + this.contextad_provider;
                }
                return (p ? '?' : '') + p;
            },
            getClickUrl: function () {
                let base = this.hashes.click ? this.getProtocol() + this.domain + '/click/' + this.hashes.click : '';
                if (this.personal_url) {
                    base = this.personal_url;
                }

                return base + this.buildParamsUrl();
            },
            getImpressionUrl: function () {
                let base = this.hashes.impression ? this.getProtocol() + this.domain + '/impression/' + this.hashes.impression : '';
                if (this.personal_url) {
                    base = this.personal_url;
                }
                return base + this.buildParamsUrl();
            },

            // Формирование запроса на сервер, за получением нового кода с новым хэшем
            getCode: function () {
                if (!this.validate()) {
                    return;
                }
                let that = this;
                this.state.loading.push('code');
                axios.post('/codegenerator/default/getCode', {
                    file_id: this.initial_data.file_id,
                    platform_id: this.platform,
                    offer_id: this.initial_data.offer_id,
                    url_id: this.landing,
                    preoffer_url_id: this.pre_offer_url,
                    rotator_id: this.rotator_id
                }, {'X-Pjax': 1}).then(function (response) {

                    that.initial_data.default_domain = response.data.domain;
                    if (!that.domain) {
                        that.domain = that.initial_data.default_domain;
                    }
                    that.hashes.click = response.data.hashes.click.hash;
                    that.hashes.impression = response.data.hashes.impression.hash;
                    that.code_template = response.data.code;
                    that.external = response.data.external;
                }).catch(function (error) {
                    that.reset();
                }).then(function () {
                    that.state.loading = that.state.loading.filter(function (item) {
                        return item.indexOf('code') === -1;
                    });

                });
            },
            loadInitialData: function (config) {
                let that = this;
                this.state.loading.push('initial_data');
                axios.post('/codegenerator/default/getInitialData', {
                    file_id: config.file_id,
                    offer_id: config.offer_id
                }, {'X-Pjax': 1, 'Content-Type': 'multipart/form-data'})
                    .then(function (response) {
                        that.initial_data = response.data.initial_data;

                        if (config.platforms !== undefined) {
                            that.initial_data.platforms = config.platforms;
                        }

                        if (config.domains !== undefined) {
                            that.initial_data.domains = config.domains;
                        }

                        if (config.contextad_providers !== undefined) {
                            that.initial_data.contextad_providers = config.contextad_providers;
                        }

                        if (that.initial_data.platforms.length === 1 && !config.platform_id) {
                            that.platform = that.initial_data.platforms[0]['id'];
                        }

                        if (config.platform_id) {
                            that.platform = config.platform_id;
                        }
                        if (config.domain) {
                            that.domain = config.domain;
                        }
                        if (config.contextad_provider) {
                            that.contextad_provider = config.contextad_provider;
                        }
                        if (config.rotator_id) {
                            that.rotator_id = config.rotator_id;
                        }
                    }).catch(function (error) {
                    that.reset();
                }).then(function () {
                    that.state.loading = that.state.loading.filter(function (item) {
                        return item.indexOf('initial_data') === -1;
                    });
                });
            },
            validate: function () {
                if (!this.platform) {
                    this.state.errors.platform = true;
                    return false;
                }
                return true;
            },
            copyText: function (cls) {

                let fieldLink = document.querySelector('.' + cls);
                let range = document.createRange();
                range.selectNode(fieldLink, range);
                window.getSelection().addRange(range);

                try {
                    let successful = document.execCommand('copy');
                    //var msg = successful ? 'successful' : 'unsuccessful';
                    //console.log('Copy email command was ' + msg);
                } catch (err) {
                    //console.log('Oops, unable to copy');
                }

                window.getSelection().removeAllRanges();
            },
            getTextAreaHeight() {
                if (this.initial_data.file_type == 'form') {
                    return 27;
                }
                if (this.external.aida) {
                    return 10;
                }

                return 15;
            }
        }
    }
</script>