<template>
    <div>
        <breadcrumbs
                     :breadcrumbs="[
            {url: '/', title: 'Главная'},
            {url: urlListSelfEmployed, title: 'Самозанятые'},
            {title: isCreated() ? 'Создание' : 'Редактирование'},
        ]"/>

        <md-toolbar md-elevation="1">
            <h4 class="md-title" v-if="isCreated()">Создание самозанятого</h4>
            <h4 class="md-title" v-else>
                Редактирование "{{ lastName }} {{ firstName }} {{ middleName }}"
            </h4>
        </md-toolbar>

        <form novalidate class="md-layout md-alignment-center-center" @submit.prevent="saveSelfEmployed">
            <md-card class="md-layout-item md-size-100 md-small-size-100">

                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100 ">
                            <select2
                                    :value.sync="affiliateId"
                                    :searchingUrl="affiliateUrl"
                                    is-load-data-on-init
                                    ref="affiliateId"
                                    title="Вебмастер"></select2>
                        </div>
                    </div>

                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('lastName')">
                                <label for="passport-last-name">Фамилия</label>
                                <md-input name="last-name"
                                          id="last-name"
                                          autocomplete="family-name"
                                          v-model="lastName"
                                          :disabled="sending" />
                                <span class="md-error" v-if="!$v.lastName.required">Обязательное поле</span>
                                <span class="md-error" v-else-if="!$v.lastName.alpha">Допускаются только буквы</span>
                                <span class="md-error" v-else-if="!$v.lastName.minlength">Фамилия слишком короткая</span>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('firstName')">
                                <label for="first-name">Имя</label>
                                <md-input name="first-name" id="first-name" autocomplete="given-name" v-model="firstName" :disabled="sending" />
                                <span class="md-error" v-if="!$v.firstName.required">Обязательное поле</span>
                                <span class="md-error" v-else-if="!$v.firstName.alpha">Допускаются только буквы</span>
                                <span class="md-error" v-else-if="!$v.firstName.minlength">Ваше имя слишком маленькое</span>
                            </md-field>
                        </div>
                    </div>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('middleName')">
                                <label for="middle-name">Отчество</label>
                                <md-input name="middle-name" id="middle-name" autocomplete="middle-name" v-model="middleName" :disabled="sending" />
                                <span class="md-error" v-if="!$v.middleName.required">Обязательное поле</span>
                                <span class="md-error" v-else-if="!$v.middleName.alpha">Допускаются только буквы</span>
                                <span class="md-error" v-else-if="!$v.middleName.minlength">Ваше отчество слишком маленькое</span>
                            </md-field>
                        </div>
                    </div>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('passportSeries')" :md-toggle-password="true">
                                <label for="passport-series">Серия</label>
                                <md-input name="passport-series"
                                          id="passport-series"
                                          maxlength="4"
                                          v-mask="'####'"
                                          v-model="passportSeries"
                                          :disabled="sending" />
                                <span class="md-error" v-if="!$v.passportSeries.required">Обязательное поле</span>
                                <span class="md-error" v-else-if="!$v.passportSeries.numeric">Серия паспорта состоит только из чисел</span>
                                <span class="md-error" v-else-if="!$v.passportSeries.minlength || !$v.passportNumber.maxlength">Серия может быть только из 4 цифр</span>
                            </md-field>
                        </div>

                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('passportNumber')" :md-toggle-password="true">
                                <label for="passport-number">Номер</label>
                                <md-input name="passport-number"
                                          id="passport-number"
                                          maxlength="6"
                                          v-mask="'######'"
                                          v-model="passportNumber"
                                          :disabled="sending" />
                                <span class="md-error" v-if="!$v.passportNumber.required">Обязательное поле</span>
                                <span class="md-error" v-else-if="!$v.passportNumber.numeric">Номер паспорта состоит только из чисел</span>
                                <span class="md-error" v-else-if="!$v.passportNumber.minlength || !$v.passportNumber.maxlength">Номер может быть только из 6 цифр</span>
                            </md-field>
                        </div>
                    </div>

                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('passportIssuedBy')">
                                <label for="passport-issued-by">Кем выдан паспорт</label>
                                <md-input name="passport-issued-by" id="passport-issued-by" autocomplete="passport-issued-by" v-model="passportIssuedBy" :disabled="sending" />
                                <span class="md-error" v-if="!$v.passportIssuedBy.required">Обязательное поле</span>
                            </md-field>
                        </div>

                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('passportDepartmentCode')">
                                <label for="passport-issued-by">Код подразделения</label>
                                <md-input name="passport-department-code"
                                          id="passport-department-code"
                                          autocomplete="passport-department-code"
                                          maxlength="7"
                                          v-mask="'###-###'"
                                          v-model="passportDepartmentCode"
                                          :disabled="sending" />
                                <span class="md-error" v-if="!$v.passportDepartmentCode.required">Обязательное поле</span>
                                <span class="md-error" v-else-if="!$v.passportDepartmentCode.minlength || !$v.passportDepartmentCode.maxlength">Код подразделения может быть только из 6 цифр</span>
                            </md-field>
                        </div>
                    </div>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <div class="md-subhead">Дата выдачи паспорта</div>
                                <md-datepicker v-model="passportIssuedDate" md-immediately :class="getValidationClass('passportIssuedDate')"/>
                        </div>
                    </div>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('passportRegistration')">
                                <label for="passport-registration">Адрес регистрации</label>
                                <md-input
                                        name="passport-registration"
                                        id="passport-registration"
                                        autocomplete="passport-registration"
                                        v-model="passportRegistration"
                                        :disabled="sending"
                                />
                                <span class="md-error" v-if="!$v.passportRegistration.required">Обязательное поле</span>
                            </md-field>
                        </div>
                    </div>

                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('inn')">
                                <label for="passport-inn">ИНН</label>
                                <md-input name="inn"
                                          id="passport-inn"
                                          maxlength="12"
                                          v-model="inn"
                                          v-mask="'############'"
                                          :disabled="sending" />
                                <span class="md-error" v-if="!$v.inn.required">Обязательное поле</span>
                                <span class="md-error" v-else-if="!$v.inn.numeric">ИНН состоит только из чисел</span>
                                <span class="md-error" v-else-if="!$v.inn.minlength || !$v.inn.maxlength">Номер может быть только из 12 цифр</span>
                            </md-field>
                        </div>
                    </div>

                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('phone')" :md-toggle-password="true">
                                <label for="phone">Телефон</label>
                                <md-input name="phone"
                                          id="phone"
                                          v-model="phone"
                                          :disabled="sending" />
                                <span class="md-error" v-if="!$v.phone.required">Обязательное поле</span>
                            </md-field>
                        </div>

                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('email')" :md-toggle-password="true">
                                <label for="email">Email</label>
                                <md-input name="email"
                                          id="email"
                                          v-model="email"
                                          :disabled="sending" />
                                <span class="md-error" v-if="!$v.email.required">Обязательное поле</span>
                            </md-field>
                        </div>
                    </div>
                </md-card-content>

                <md-progress-bar md-mode="indeterminate" v-if="sending" />

                <md-card-actions>
                    <md-button type="submit" class="md-raised md-primary" :disabled="sending">Сохранить</md-button>
                </md-card-actions>
            </md-card>
        </form>

        <md-snackbar md-position="center" :md-duration="8000" :md-active.sync="isShowError" md-persistent>
            <div v-html="textError" class="wrap-errors"></div>
        </md-snackbar>
    </div>
</template>

<script>
    import { validationMixin } from 'vuelidate';
    import { mapActions, mapState, mapMutations } from 'vuex';
    import {urlListSelfEmployed, urlCreateSelfEmployed} from '../../../../common/contractors/selfEmployed/helpers/selfEmployedUrls';

    import {
        required,
        minLength,
        maxLength,
        numeric,
    } from 'vuelidate/lib/validators';
    import { helpers } from 'vuelidate/lib/validators';
    const alpha = helpers.regex('alpha', /^[a-zA-ZА-Яа-яЁё][a-zA-ZА-Яа-яЁё]*[a-z\sA-Z\sА-Яа-яЁё-]*[a-zA-ZА-Яа-яЁё]$/);
    import Select2 from '../../../../common/components/select2/select2.vue';
    import breadcrumbs from '../../../../common/components/breadcrumbs/breadcrumbs.vue';

    export default {
        name: 'SelfEmployed',
        mixins: [validationMixin],
        components: {
            select2: Select2,
            breadcrumbs: breadcrumbs,
        },
        data: () => ({
            affiliateUrl: '/contractors/selfEmployed/entityApi/affiliate',
        }),
        computed : {
            ...mapState({
                sending: 'isLoadProgress',
                textError: 'textError',
            }),
            urlListSelfEmployed() {
                return urlListSelfEmployed();
            },
            firstName: {
                get() { return this.$store.state.firstName },
                set(value) { this.setFirstName(value); },
            },
            lastName: {
                get() { return this.$store.state.lastName; },
                set(value) { this.setLastName(value); },
            },
            middleName: {
                get() { return this.$store.state.middleName },
                set(value) { this.setMiddleName(value); },
            },
            passportNumber: {
                get() { return this.$store.state.passportNumber },
                set(value) { this.setPassportNumber(value); },
            },
            passportSeries: {
                get() { return this.$store.state.passportSeries },
                set(value) { this.setPassportSeries(value); },
            },
            passportIssuedBy: {
                get() { return this.$store.state.passportIssuedBy },
                set(value) { this.setPassportIssuedBy(value); },
            },
            passportIssuedDate: {
                get() { return this.$store.state.passportIssuedDate },
                set(value) { this.setPassportIssuedDate(value); },
            },
            passportDepartmentCode: {
                get() { return this.$store.state.passportDepartmentCode },
                set(value) { this.setPassportDepartmentCode(value); },
            },
            passportRegistration: {
                get() { return this.$store.state.passportRegistration },
                set(value) { this.setPassportRegistration(value); },
            },
            inn: {
                get() { return this.$store.state.inn },
                set(value) { this.setInn(value); },
            },
            phone: {
                get() { return this.$store.state.phone },
                set(value) { this.setPhone(value); },
            },
            email: {
                get() { return this.$store.state.email },
                set(value) { this.setEmail(value); },
            },
            affiliateId: {
                get() { return this.$store.state.affiliateId },
                set(value) { this.setAffiliateId(value); },
            },
            isShowError: {
                get() { return this.$store.state.isShowError; },
                set(value) { this.setShowError(value); },
            }
        },
        validations: {
            firstName: {
                required,
                alpha,
                minLength: minLength(1)
            },
            lastName: {
                required,
                alpha,
                minLength: minLength(1)
            },
            middleName: {
                required,
                alpha,
                minLength: minLength(2)
            },
            passportNumber:{
                required,
                numeric,
                minLength: minLength(6),
                maxLength: maxLength(6)
            },
            passportSeries: {
                required,
                numeric,
                minLength: minLength(4),
                maxLength: maxLength(4)
            },
            passportIssuedBy: {
                required
            },
            passportIssuedDate: {
                required
            },
            passportDepartmentCode: {
                required,
                minLength: minLength(7),
                maxLength: maxLength(7)
            },
            passportRegistration: {
                required
            },
            inn: {
                required,
                numeric,
                minLength: minLength(12),
                maxLength: maxLength(12)
            },
            phone: {
                required,
            },
            email: {
                required,
            },
        },
        created: function () {
            if (this.isCreated()) {
                return;
            }

            let selfEmployedId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
            this.appendSelfEmployed(selfEmployedId);
        },
        watch: {
            affiliateId: function (val) {
                this.$refs.affiliateId.initWithValue(val);
            },
        },
        methods: {
            ...mapMutations({
                setShowError: 'SET_SHOW_ERROR',
                setFirstName: 'SET_FIRST_NAME',
                setLastName: 'SET_LAST_NAME',
                setMiddleName: 'SET_MIDDLE_NAME',
                setPassportNumber: 'SET_PASSPORT_NUMBER',
                setPassportSeries: 'SET_PASSPORT_SERIES',
                setPassportIssuedBy: 'SET_PASSPORT_ISSUED_BY',
                setPassportIssuedDate: 'SET_PASSPORT_ISSUED_DATE',
                setPassportDepartmentCode: 'SET_PASSPORT_DEPARTMENT_CODE',
                setPassportRegistration: 'SET_PASSPORT_REGISTRATION',
                setInn: 'SET_INN',
                setPhone: 'SET_PHONE',
                setEmail: 'SET_EMAIL',
                setAffiliateId: 'SET_AFFILIATE_ID',
            }),
            ...mapActions({
                createSelfEmployed: 'CREATE_SELF_EMPLOYED',
                appendSelfEmployed: 'APPEND_SELF_EMPLOYED',
                updateSelfEmployed: 'UPDATE_SELF_EMPLOYED',
            }),
            isCreated() {
                return window.location.pathname.indexOf(urlCreateSelfEmployed()) === 0;
            },
            getValidationClass (fieldName) {
                const field = this.$v[fieldName];

                if (field) {
                    return {
                        'md-invalid': field.$invalid && field.$dirty
                    }
                }
            },
            saveSelfEmployed () {
                this.$v.$touch();

                if (this.$v.$invalid) {
                    return;
                }

                let selfEmployed = {
                    affiliateId: this.affiliateId,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    middleName: this.middleName,
                    passportSeries: this.passportSeries,
                    passportNumber: this.passportNumber,
                    passportIssuedBy: this.passportIssuedBy,
                    passportIssuedDate: this.passportIssuedDate,
                    passportDepartmentCode: this.passportDepartmentCode,
                    passportRegistration: this.passportRegistration,
                    inn: this.inn,
                    phone: this.phone,
                    email: this.email,
                };

                if (this.isCreated()) {
                    this.createSelfEmployed(selfEmployed);
                } else {
                    this.updateSelfEmployed(selfEmployed);
                }
            },
        }
    }
</script>

<style lang="scss">
    .md-field .md-input, .md-field .md-textarea{
        box-shadow: none !important;
    }
    .md-field.md-clearable .md-input{
        box-shadow: none !important;
   }

    .md-snackbar.md-theme-default {
        background-color: #ff5252;
    }

    .wrap-errors {
        margin: 10px;
    }
</style>