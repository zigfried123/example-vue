<template>
    <div class="pa__flex h-items-center v-items-center v-stretch">
        <div class="pa__flex v-items-center v-column">
            <i class="fa fa-circle-o-notch fa-spin pa__stub__icon">

            </i>
            <span class="pa_stub__message">{{ message }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pa_load_stub",
        props: {
            message: null
        }
    }
</script>

<style scoped>
    .pa__stub__icon {
        font-size: 25px;
        color: #ffbf00;
    }

    .pa_stub__message {
        margin: 10px;
        color: gray;
    }
</style>