<template>
    <md-card>
        <span class="badge">{{ paymentType.badge }}</span>
        <md-card-header>
                <h4 class="pa__header">{{ paymentType.title }}</h4>
            </md-card-header>


        <md-card-content v-html="paymentType.shortDescription">

        </md-card-content>

        <md-card-actions>
            <md-button v-on:click="select()">Добавить</md-button>
        </md-card-actions>
    </md-card>
</template>

<script>
    import PaymentType from '../../classes/PaymentType';


    export default {
        name: "pa_type_card",
        props: {
            /**
             * @property {PaymentType}
             */
            paymentType: {type: PaymentType}
        },
        methods: {
            select() {
                this.$set(this.paymentType, 'state', 'edit');
            }
        }
    }
</script>

<style scoped>
    .md-card-header {
        height: 80px;
    }
    .md-card-header + .md-card-content {
        height: 120px;
    }
    .badge{
        background-color: #ff5252;
        position: absolute !important;
        right: 0px;
        top: 15px;
    }
</style>