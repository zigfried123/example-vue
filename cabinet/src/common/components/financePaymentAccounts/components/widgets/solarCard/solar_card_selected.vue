<template>
    <div>
        <h4 class="pa__header">Выбранная карта</h4>
        <div v-on:click="actionOpenList">
            <md-card md-with-hover class="pa__card_wrapper" v-bind:class="cardClass">
                <div v-if="!card.card_id" class="pa__flex v-column v-items-center h-items-center v-stretch">
                    <div class="pa__flex v-column">
                        <md-icon class="md-primary">add</md-icon>
                        <span>Добавить карту</span>
                    </div>
                </div>
                <div v-else>
                    <div>{{ card.card_number }}</div>
                    <br>
                    <div>{{ card.card_holder }}</div>
                    <div>{{ card.card_expire }}</div>
                </div>
            </md-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "solar_card_selected",
        props: {
            card: {},
            errors: {}
        },
        computed: {
            cardClass() {
                return {
                    'empty': !this.card.card_id,
                    'error': this.errors.card_id
                }
            }
        },
        methods: {
            actionOpenList() {
                this.$parent.actionOpenList();
            }
        }
    }
</script>

<style scoped>
    .pa__card_wrapper {
        width: 338px;
        height: 213px;
        padding: 106px 15px 15px 15px;
        margin: 15px 0 15px 0;
        position: relative;
        box-sizing: border-box;
        border-radius: 5px !important;
        background: var(--pa-accent-color);
        color: black;
        font-size: 17px;
        font-family: monospace;
        overflow: hidden;
    }

    .pa__card_wrapper.empty {
        text-align: center;
        background: #f3f3f3;
        padding: 10px;
    }

    .pa__card_wrapper.error {
        background: var(--md-theme-default-accent);
    }
</style>