<template>
    <md-dialog :md-active.sync="cardsDialog" class="pa__cards-dialog">
        <md-dialog-title>Выбор карты</md-dialog-title>

        <md-dialog-content>
            <div class="pa__cards-dialog-content">
                <h4 class="pa__header">Добавить новую карту</h4>
                <solar_processing>

                </solar_processing>

                <solar_card_list :ref="'cardList'">

                </solar_card_list>
            </div>
        </md-dialog-content>

        <md-dialog-actions>
            <md-button @click="actionCloseDialog">Отмена</md-button>
            <md-button class="md-primary" @click="actionAddSelected">Добавить</md-button>
        </md-dialog-actions>
    </md-dialog>
</template>

<script>
    import Solar_card_list from "./solar_card_list.vue";
    import Solar_processing from "./solar_processing.vue";
    export default {
        name: "solar_card_adding",
        components: {Solar_processing, Solar_card_list},
        data() {
            return {
                cardsDialog: false,
            }
        },
        methods: {
            actionOpenList() {
                console.log('open list');
                this.cardsDialog = true;
            },
            actionCloseDialog() {
                this.clearUpdateInterval();
                this.cardsDialog = false;
            },
            actionAddSelected() {
                this.actionCloseDialog();

                let listComponent = this.$refs['cardList'];
                let card = listComponent.getSelectedCard();

                if(!card){
                    return;
                }
                this.$parent.setCard(card);
            },
            clearUpdateInterval() {
                let listComponent = this.$refs['cardList'];
                clearInterval(listComponent.updateInterval);
            }
        }
    }
</script>

<style scoped>
    @media (min-width: 600px) {
        .pa__cards-dialog-content {
            width: 700px;
        }
    }

    .pa__cards-dialog {
        z-index: 6 !important;
    }
</style>