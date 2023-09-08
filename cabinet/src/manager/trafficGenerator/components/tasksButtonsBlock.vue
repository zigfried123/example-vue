<template>

        <div class="md-layout-item md-size-20 action_button">
            <md-tooltip md-delay="500" md-direction="top">{{buttonTooltip}}</md-tooltip>
            <md-button :disabled="loading" class="md-raised md-default btn_item" @click="buttonAction">{{buttonCaption}}</md-button>
        </div>

</template>

<script>
    export default {
        name: "task-buttons-block",
        props: {
            loading: false,
            buttonCaption: String,
            buttonAction: null,
            buttonTooltip: String,
        },
    }
</script>

<style scoped>

</style>