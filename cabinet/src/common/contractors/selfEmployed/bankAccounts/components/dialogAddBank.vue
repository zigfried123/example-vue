<template>
    <div class="data-selection-dialog">
        <md-dialog-title>Добавление банковского счета</md-dialog-title>

        <div class="md-layout-item md-layout md-gutter">

            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <md-field :class="getValidationClass('name')">
                    <label>Название</label>
                    <md-input v-model="name" id="name"></md-input>
                    <span class="md-error" v-if="!$v.name.required">Обязательное поле</span>
                </md-field>
            </div>

            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <md-field :class="getValidationClass('bik')">
                    <label>БИК</label>
                    <md-input v-model="bik"
                              maxlength="9"
                              v-mask="'#########'" id="bik"></md-input>
                    <span class="md-error" v-if="!$v.bik.required">Обязательное поле</span>
                    <span class="md-error" v-else-if="!$v.bik.numeric || !$v.bik.minLength">БИК должен состоять из 9 цифр</span>
                </md-field>
            </div>

            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <md-field :class="getValidationClass('correspondentAccount')">
                    <label>Корреспондентский счет</label>
                    <md-input v-model="correspondentAccount"
                              maxlength="20"
                              v-mask="'####################'" id="correspondentAccount"></md-input>
                    <span class="md-error" v-if="!$v.correspondentAccount.required">Обязательное поле</span>
                    <span class="md-error" v-else-if="!$v.correspondentAccount.numeric || !$v.correspondentAccount.minLength">Корреспондентский счет должен состоять из 20 цифр</span>
                </md-field>
            </div>

            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <md-field :class="getValidationClass('checkingAccount')">
                    <label>Рассчетный счет</label>
                    <md-input v-model="checkingAccount"
                              maxlength="20"
                              v-mask="'####################'" id="checkingAccount"></md-input>
                    <span class="md-error" v-if="!$v.checkingAccount.required">Обязательное поле</span>
                    <span class="md-error"
                          v-else-if="
                          !$v.checkingAccount.numeric || !$v.checkingAccount.minLength">
                        Корреспондентский счет должен состоять из 20 цифр</span>
                </md-field>
            </div>
        </div>

        <md-dialog-actions>
            <md-button class="md-accent" @click="close">Закрыть</md-button>
            <md-button class="md-primary"
                       id="addBankAccBtn"
                       @click="onClickAddBankAccount">Добавить</md-button>
        </md-dialog-actions>
    </div>
</template>

<script>
    import { validationMixin } from 'vuelidate';
    import { required, numeric, minLength} from 'vuelidate/lib/validators';

    export default {
        name: "dialog-add-bank",
        mixins: [validationMixin],
        data: () => ({
            name: null,
            bik: null,
            correspondentAccount: null,
            checkingAccount: null,
        }),
        validations: {
            name: {
                required,
            },
            bik: {
                required,
                numeric,
                minLength: minLength(9),
            },
            correspondentAccount: {
                required,
                numeric,
                minLength: minLength(20),
            },
            checkingAccount: {
                required,
                numeric,
                minLength: minLength(20),
            },
        },
        methods: {
            onClickAddBankAccount() {
                this.$v.$touch();

                if (this.$v.$invalid) {
                    return;
                }

                this.$emit(
                    'onClickAddBankAccount',
                    {
                        name: this.name,
                        bik: this.bik,
                        checkingAccount: this.checkingAccount,
                        correspondentAccount: this.correspondentAccount
                    }
                );
                this.close();
            },
            getValidationClass(fieldName) {
                return {'md-invalid': this.$v[fieldName].$invalid && this.$v[fieldName].$dirty};
            },
            close() {
                this.$emit('close');
            }
        }
    }
</script>

<style scoped>
    .data-selection-dialog{
        padding-top: 30px;
    }
    .md-dialog-title {
        padding-left: 20px;
    }
</style>