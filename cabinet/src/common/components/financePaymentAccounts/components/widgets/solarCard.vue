<template>
    <div id="solarCard">


        <solar_card_adding :ref="'adding'">

        </solar_card_adding>


        <solar_card_selected :card="model" :errors="error">

        </solar_card_selected>

    </div>
</template>

<script>
    import _widget_mixin from "./_widget_mixin";
    import Solar_card_selected from "./solarCard/solar_card_selected.vue";
    import Solar_card_adding from "./solarCard/solar_card_adding.vue";

    export default {
        name: "solarCard",
        mixins: [_widget_mixin],
        components: {Solar_card_adding, Solar_card_selected},
        data() {
            return {
                secondStepError: null,
                error: {
                    card_holder: null,
                    card_id: null,
                    card_number: null,
                    card_expire: null,
                },
                model: {
                    card_holder: null,
                    card_id: null,
                    card_number: null,
                    card_expire: null,
                },
                state: null,
                cardsDialog: false
            }
        },
        computed: {},
        methods: {
            setCard(card) {
                for (let key in card) {
                    if (!card.hasOwnProperty(key) || !this.model.hasOwnProperty(key)) {
                        continue;
                    }
                    this.$set(this.model, key, card[key]);
                    this.validate();
                }
            },
            actionOpenList() {
                this.$refs['adding'].cardsDialog = true;
            },
        },
        watch: {}

    }
</script>

<style scoped>

</style>